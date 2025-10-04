import React, { useState, useEffect } from 'react';
import AgentCard from './agentCard';

const {ipcRenderer} = window.electron;
import InstallAgent from '../InstallAgent/installAgent';

// const { exec } = require('child_process');

const ManageAgents = () => {
    // State for agents
    const [agents, setAgents] = useState([]);
    // State for modal
    const [installModalOpen, setInstallModalOpen] = useState(false);
    const [selectedAgentId, setSelectedAgentId] = useState('');
    const [selectedAgentVersion, setSelectedAgentVersion] = useState('latest');
    // Loading state
    const [isLoading, setIsLoading] = useState(true);
    // Keep track of pending deletions
    const [pendingDeletions, setPendingDeletions] = useState([]);   

    // Load agents from database on component mount
    useEffect(() => {
        loadAgents();

        // Set up IPC listener for install-agent event
        const handleInstallAgent = (event, agentId = "None", agentVersion = "latest") => {
            console.log('Agent installation request received:', agentId, agentVersion);
            setSelectedAgentId(agentId);
            setSelectedAgentVersion(agentVersion);
            setInstallModalOpen(true);
        };

        ipcRenderer.on('install-agent', handleInstallAgent);

        // Clean up the event listener on component unmount
        return () => {
            ipcRenderer.removeListener('install-agent', handleInstallAgent);
        };
    }, []);

    // Load agents from database
    const loadAgents = async () => {
        try {
            setIsLoading(true);
            const loadedAgents = await ipcRenderer.invoke('db:getAgentsInfo');
            
            if (!loadedAgents || loadedAgents.length === 0) {
                setAgents([]);
            } else {
                console.log('Agents loaded:', loadedAgents);
                // Transform data format if needed
                const formattedAgents = loadedAgents.map(agent => ({
                    id: agent.id,
                    name: agent.name,
                    status: 'Stopped', // Default status
                    type: agent.description || 'Assistant',
                    envVariables: agent.envVariables.reduce((acc, env) => {
                        acc[env.name] = env.value;
                        return acc;
                    }, {})
                }));
                setAgents(formattedAgents);
            }
        } catch (error) {
            console.error('Error loading agents:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Clean up completed deletions
    useEffect(() => {
        if (pendingDeletions.length > 0) {
            const timer = setTimeout(() => {
                // Filter out agents that were marked for deletion
                setAgents(agents.filter(agent => !pendingDeletions.includes(agent.id)));
                setPendingDeletions([]);
            }, 2000); // 2 second delay for deletion
            
            return () => clearTimeout(timer);
        }
    }, [pendingDeletions, agents]);

    // Function to handle adding a new agent
    const handleAddAgent = () => {
        setSelectedAgentId('');
        setSelectedAgentVersion('latest');
        setInstallModalOpen(true);
    };

    // Function to handle agent deletion with loading state
    const handleDeleteAgent = async (id) => {
        // Mark the agent as being deleted (UI indication)
        setAgents(agents.map(agent => 
            agent.id === id 
                ? { ...agent, status: 'Deleting' } 
                : agent
        ));
        
        try {
            // Stop the agent if it's running
            const agent = agents.find(a => a.id === id);
            if (agent && agent.status === 'Running') {
                const stopCommand = `wsl.exe -d Ubuntu -- bash -c "echo '226044' | sudo -S docker stop ${agent.id}_latest"`;
                await new Promise((resolve, reject) => {
                    exec(stopCommand, (error) => {
                        if (error) console.error(`Error stopping agent: ${error}`);
                        resolve();
                    });
                });
            }
            
            // Delete from database
            await ipcRenderer.invoke('db:deleteAgent', id);
            
            // Add to pending deletions
            setPendingDeletions([...pendingDeletions, id]);
        } catch (error) {
            console.error('Error deleting agent:', error);
        }
    };

    // Function to toggle agent status with loading state
    const handleToggleStatus = (id) => {
        const targetAgent = agents.find(agent => agent.id === id);
        const targetStatus = targetAgent.status;
        
        // First set to Loading state
        setAgents(agents.map(agent => 
            agent.id === id 
                ? { ...agent, status: 'Loading' } 
                : agent
        ));

        if (targetStatus === 'Running') {
            // Stop the agent
            const stopCommand = `wsl.exe -d Ubuntu -- bash -c "echo '226044' | sudo -S docker stop ${targetAgent.id}_latest"`;
            
            exec(stopCommand, (error) => {
                if (error) {
                    console.error(`Error stopping agent: ${error}`);
                    // Revert to previous status on error
                    setAgents(agents.map(agent => 
                        agent.id === id ? { ...agent, status: targetStatus } : agent
                    ));
                    return;
                }
                
                // Update status to Stopped
                setAgents(agents.map(agent => 
                    agent.id === id ? { ...agent, status: 'Stopped' } : agent
                ));
            });
        } else {
            // Start the agent
            const startCommand = `wsl.exe -d Ubuntu -- bash -c "echo '226044' | sudo -S docker run -d --name ${targetAgent.id}_latest --rm -p 5678:5678 ${targetAgent.id}:latest"`;
            
            exec(startCommand, (error) => {
                if (error) {
                    console.error(`Error starting agent: ${error}`);
                    // Revert to previous status on error
                    setAgents(agents.map(agent => 
                        agent.id === id ? { ...agent, status: targetStatus } : agent
                    ));
                    return;
                }
                
                // Update status to Running
                setAgents(agents.map(agent => 
                    agent.id === id ? { ...agent, status: 'Running' } : agent
                ));
            });
        }
    };

    // Function to update environment variables
    const handleUpdateEnvVariable = (id, key, value) => {
        setAgents(agents.map(agent => {
            if (agent.id === id) {
                return {
                    ...agent,
                    envVariables: {
                        ...agent.envVariables,
                        [key]: value
                    }
                };
            }
            return agent;
        }));
        
        // Save to database
        ipcRenderer.invoke('db:updateAgentEnv', id, key, value)
            .catch(err => {
                console.error(`Error saving environment variable ${key}:`, err);
            });
    };

    // Handle installation success
    const handleInstallSuccess = () => {
        loadAgents(); // Reload agents list
    };

    // Close the installation modal
    const handleCloseInstallModal = () => {
        setInstallModalOpen(false);
        setSelectedAgentId('');
        setSelectedAgentVersion('latest');
        loadAgents(); // Reload agents whenever the modal is closed
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold" style={{ color: '#F9FAFB' }}>Manage Agents</h2>
                <button 
                    className="px-4 py-2 rounded-md font-medium transition-colors flex items-center"
                    style={{ backgroundColor: '#6366F1', color: '#F9FAFB' }}
                    onClick={handleAddAgent}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Agent
                </button>
            </div>
            
            {/* Loading state */}
            {isLoading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            )}
            
            {/* Agent Cards */}
            {!isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agents.map(agent => (
                        <AgentCard 
                            key={agent.id} 
                            agent={agent} 
                            onDelete={handleDeleteAgent}
                            onToggleStatus={handleToggleStatus}
                            onUpdateEnvVariable={handleUpdateEnvVariable}
                        />
                    ))}
                </div>
            )}
            
            {/* No agents message */}
            {!isLoading && agents.length === 0 && (
                <div 
                    className="rounded-lg p-8 text-center mt-6"
                    style={{ backgroundColor: '#1D1F24', color: '#9CA3AF' }}
                >
                    <p className="text-lg">No agents found. Create your first agent to get started.</p>
                    <button 
                        className="mt-4 px-4 py-2 rounded-md font-medium transition-colors"
                        style={{ backgroundColor: '#6366F1', color: '#F9FAFB' }}
                        onClick={handleAddAgent}
                    >
                        Create Your First Agent
                    </button>
                </div>
            )}
            
            {/* Install Agent Modal */}
            {/* {installModalOpen && (
                <InstallAgent
                    agentId={selectedAgentId}
                    agentVersion={selectedAgentVersion}
                    onClose={handleCloseInstallModal}
                    onInstallSuccess={handleInstallSuccess}
                />
            )} */}
        </div>
    );
};

export default ManageAgents;

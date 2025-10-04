import React, { createContext, useState } from 'react';

// Create a context for tracking agent installation status
export const AgentInstallContext = createContext();

export const AgentInstallProvider = ({ children }) => {
    // Global state to track if an agent is currently being installed
    const [isAgentInstalling, setIsAgentInstalling] = useState(false);
    
    return (
        <AgentInstallContext.Provider value={{ isAgentInstalling, setIsAgentInstalling }}>
            {children}
        </AgentInstallContext.Provider>
    );
};

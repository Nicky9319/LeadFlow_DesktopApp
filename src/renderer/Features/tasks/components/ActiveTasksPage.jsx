import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import TaskThreadModal from './TaskThreadModal';

// Optionally keep the JSON import commented for future use
import allTasksData from '../api responses/get_all_task_information.json';

const ActiveTasksPage = () => {
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    const [selectedTask, setSelectedTask] = useState(null); // For modal
    const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Active' | 'Halted' | 'Stopped'
    const [tasks, setTasks] = useState([]);

    // Replace loadAllTasks with real API call
    const loadAllTasks = async () => {
        try {
            const response = await fetch('http://127.0.0.1:12672/api/get-all-tasks');
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const allTasksData = await response.json();
            if (allTasksData && Array.isArray(allTasksData.payload)) {
                const mapped = allTasksData.payload.map(t => ({
                    id: t.task_id,
                    query: t.task_query,
                    status:
                        t.task_status === 'running' ? 'active'
                        : t.task_status === 'halted' ? 'halted'
                        : t.task_status === 'stopped' || t.task_status === 'completed' || t.task_status === 'failed' ? 'userStopped'
                        : 'unknown'
                }));
                setTasks(mapped);
            } else {
                setTasks([]);
            }
        } catch (error) {
            setTasks([]);
            // Optionally log or handle error
        }

        // --- For future use: Simulate API call to load all tasks from JSON ---
        // if (allTasksData && Array.isArray(allTasksData.payload)) {
        //     const mapped = allTasksData.payload.map(t => ({
        //         id: t.task_id,
        //         query: t.task_query,
        //         status:
        //             t.task_status === 'running' ? 'active'
        //             : t.task_status === 'halted' ? 'halted'
        //             : t.task_status === 'stopped' || t.task_status === 'completed' || t.task_status === 'failed' ? 'userStopped'
        //             : 'unknown'
        //     }));
        //     setTasks(mapped);
        // } else {
        //     setTasks([]);
        // }
    };

    useEffect(() => {
        loadAllTasks();
    }, []);

    const handleTaskAction = (taskId, action) => {
        console.log(`Task ${taskId} action: ${action}`);
        // TODO: Implement task action logic
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
    };

    const closeModal = () => {
        setSelectedTask(null);
    };

    const normalizedStatus = (label) => {
        switch (label) {
            case 'Active':
                return 'active';
            case 'Halted':
                return 'halted';
            case 'Stopped':
                return 'userStopped';
            default:
                return null;
        }
    };

    const filteredTasks = activeFilter === 'All'
        ? tasks
        : tasks.filter(t => t.status === normalizedStatus(activeFilter));

    return (
        <div className="min-h-full p-4 space-y-8" style={{ backgroundColor: '#000000' }}>
            {/* Header */}
            <div className="flex items-center justify-between pb-3">
                <h1 
                    className="text-2xl font-light tracking-tight"
                    style={{ color: '#FFFFFF' }}
                >
                    Active Tasks
                </h1>
                
                {/* Task Statistics Widgets */}
                <div className="flex items-center space-x-4">
                    {/* Active Tasks Widget */}
                    <div 
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg"
                        style={{ 
                            backgroundColor: '#111111',
                            border: '1px solid #1C1C1E'
                        }}
                    >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00D09C' }}></div>
                        <span className="text-xs font-medium" style={{ color: '#E5E5E7' }}>
                            <span className="font-semibold" style={{ color: '#00D09C' }}>
                                {tasks.filter(t => t.status === 'active').length}
                            </span>
                            <span className="ml-1">Active</span>
                        </span>
                    </div>


                    {/* Halted Tasks Widget */}
                    <div 
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg"
                        style={{ 
                            backgroundColor: '#111111',
                            border: '1px solid #1C1C1E'
                        }}
                    >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FF9500' }}></div>
                        <span className="text-xs font-medium" style={{ color: '#E5E5E7' }}>
                            <span className="font-semibold" style={{ color: '#FF9500' }}>
                                {tasks.filter(t => t.status === 'halted').length}
                            </span>
                            <span className="ml-1">Halted</span>
                        </span>
                    </div>


                    {/* Stopped Tasks Widget */}
                    <div 
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg"
                        style={{ 
                            backgroundColor: '#111111',
                            border: '1px solid #1C1C1E'
                        }}
                    >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FF3B30' }}></div>
                        <span className="text-xs font-medium" style={{ color: '#E5E5E7' }}>
                            <span className="font-semibold" style={{ color: '#FF3B30' }}>
                                {tasks.filter(t => t.status === 'userStopped').length}
                            </span>
                            <span className="ml-1">Stopped</span>
                        </span>
                    </div>
                </div>
            </div>


            {/* Task Filters and View Toggle */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex space-x-1.5">
                    {['All', 'Active', 'Halted', 'Stopped'].map((filter) => (
                        <button
                            key={filter}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border"
                            style={{ 
                                backgroundColor: activeFilter === filter ? '#007AFF' : '#0A0A0A',
                                color: activeFilter === filter ? '#FFFFFF' : '#8E8E93',
                                borderColor: activeFilter === filter ? '#007AFF' : '#1C1C1E'
                            }}
                            onClick={() => setActiveFilter(filter)}
                            onMouseEnter={(e) => {
                                if (activeFilter !== filter) {
                                    e.target.style.backgroundColor = '#111111';
                                    e.target.style.borderColor = '#1C1C1E';
                                    e.target.style.color = '#E5E5E7';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeFilter !== filter) {
                                    e.target.style.backgroundColor = '#0A0A0A';
                                    e.target.style.borderColor = '#1C1C1E';
                                    e.target.style.color = '#8E8E93';
                                }
                            }}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* View Toggle */}
                <div className="flex items-center space-x-1 border rounded-lg p-1" style={{ borderColor: '#1C1C1E' }}>
                    <button
                        onClick={() => setViewMode('list')}
                        className="px-2 py-1 rounded text-xs transition-all duration-150"
                        style={{
                            backgroundColor: viewMode === 'list' ? '#007AFF' : 'transparent',
                            color: viewMode === 'list' ? '#FFFFFF' : '#8E8E93'
                        }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className="px-2 py-1 rounded text-xs transition-all duration-150"
                        style={{
                            backgroundColor: viewMode === 'grid' ? '#007AFF' : 'transparent',
                            color: viewMode === 'grid' ? '#FFFFFF' : '#8E8E93'
                        }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* <br /> */}


            {/* Task Cards */}
            <div className={viewMode === 'grid' ? 'pt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-30 pt-5'}>
                {filteredTasks.map((task) => (
                    <div key={task.id} className="cursor-pointer" onClick={() => handleTaskClick(task)}>
                        <TaskCard
                            id={task.id}
                            query={task.query}
                            status={task.status}
                            isClickable={true}
                        />
                        {viewMode != 'grid' && <div className="pb-6"/>}
                    </div>
                     
                     
                ))}
            </div>

            {/* Redesigned Empty State */}
            {tasks.length === 0 && (
                <div 
                    className="flex flex-col items-center justify-center py-16 rounded-xl border border-blue-900/30 shadow-lg"
                    style={{ 
                        background: 'linear-gradient(135deg, #0D1B2A 60%, #1C2541 100%)'
                    }}
                >
                    {/* Illustration */}
                    <div className="mb-6">
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                            <rect x="10" y="20" width="60" height="40" rx="8" fill="#1C2541"/>
                            <rect x="18" y="28" width="44" height="8" rx="4" fill="#3A86FF"/>
                            <rect x="18" y="40" width="28" height="8" rx="4" fill="#415A77"/>
                            <rect x="18" y="52" width="16" height="8" rx="4" fill="#415A77"/>
                            <circle cx="64" cy="56" r="6" fill="#3A86FF" opacity="0.7"/>
                        </svg>
                    </div>
                    <h3 
                        className="text-2xl font-semibold mb-2"
                        style={{ color: '#FFFFFF', letterSpacing: '-0.5px' }}
                    >
                        No Tasks Yet
                    </h3>
                    <p 
                        className="text-base mb-6 max-w-md text-center"
                        style={{ color: '#B0B8C1' }}
                    >
                        You haven&apos;t created any tasks. Start by creating your first task and let Donna help you get things done!
                    </p>
                </div>
            )}

            {/* Task Thread Modal */}
            {selectedTask && (
                <TaskThreadModal
                    task={selectedTask}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};



export default ActiveTasksPage;

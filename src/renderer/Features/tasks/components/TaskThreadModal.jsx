import React, { useState, useEffect } from 'react';
import ChatThread from '../../chat/components/ChatThread';
// Import the JSON file for simulating the API call
import taskThreadData from '../api responses/get_task_thread_information.json';

const TaskThreadModal = ({ task, onClose }) => {
    if (!task) return null;

    const [taskStatus, setTaskStatus] = useState(task.status);
    const [messages, setMessages] = useState([]);

    // Simulate API call to load messages from JSON
    const loadTaskThreadMessages = async (taskId) => {
        // In a real app, you'd fetch from an API using taskId
        // Here, we filter the imported JSON by task_id
        if (taskThreadData.task_id === taskId) {
            // Map the payload to the format expected by ChatThread
            const mapped = taskThreadData.payload.map(msg => ({
                sender: msg.type === 'human' ? 'user' : 'ai',
                text: msg.data.content,
                // Optionally add timestamp or other fields if needed
            }));
            setMessages(mapped);
        } else {
            setMessages([]);
        }
    };

    useEffect(() => {
        if (task && task.id) {
            loadTaskThreadMessages(task.id);
        }
    }, [task]);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'active':
                return {
                    color: '#00D09C',
                    label: 'Running',
                    bgColor: 'rgba(0, 208, 156, 0.15)',
                    canStop: true,
                    canStart: false
                };
            case 'halted':
                return {
                    color: '#FF9500',
                    label: 'Halted',
                    bgColor: 'rgba(255, 149, 0, 0.15)',
                    canStop: true,
                    canStart: false
                };
            case 'userStopped':
                return {
                    color: '#FF3B30',
                    label: 'Stopped',
                    bgColor: 'rgba(255, 59, 48, 0.15)',
                    canStop: false,
                    canStart: true
                };
            default:
                return {
                    color: '#8E8E93',
                    label: 'Unknown',
                    bgColor: 'rgba(142, 142, 147, 0.15)',
                    canStop: false,
                    canStart: false
                };
        }
    };

    const statusConfig = getStatusConfig(taskStatus);

    const handleStart = () => {
        setTaskStatus('active');
        console.log('Starting task:', task.id);
        // TODO: Implement actual start logic
    };

    const handleStop = () => {
        setTaskStatus('userStopped');
        console.log('Stopping task:', task.id);
        // TODO: Implement actual stop logic
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
            <div className="w-full max-w-4xl h-[80vh] flex flex-col rounded-2xl overflow-hidden" style={{ backgroundColor: '#000000', border: '1px solid #1C1C1E' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#1C1C1E' }}>
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                            <h2 className="text-xl font-light tracking-tight" style={{ color: '#FFFFFF' }}>
                                Task Thread
                            </h2>
                            <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ color: '#8E8E93' }}>
                                #{task.id}
                            </span>
                        </div>
                        <p className="text-sm" style={{ color: '#8E8E93' }}>
                            {task.query.length > 80 ? `${task.query.substring(0, 80)}...` : task.query}
                        </p>
                    </div>

                    {/* Status Widget and Controls */}
                    <div className="flex items-center space-x-3">
                        {/* Status Indicator */}
                        <div 
                            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg"
                            style={{ 
                                backgroundColor: statusConfig.bgColor,
                                border: `1px solid ${statusConfig.color}20`
                            }}
                        >
                            <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: statusConfig.color }}
                            />
                            <span className="text-xs font-medium" style={{ color: statusConfig.color }}>
                                {statusConfig.label}
                            </span>
                        </div>

                        {/* Control Button */}
                        {(statusConfig.canStart || statusConfig.canStop) && (
                            <button
                                onClick={statusConfig.canStart ? handleStart : handleStop}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center space-x-1.5"
                                style={{ 
                                    backgroundColor: statusConfig.canStart ? '#007AFF' : '#FF3B30',
                                    color: '#FFFFFF'
                                }}
                                onMouseEnter={(e) => {
                                    if (statusConfig.canStart) {
                                        e.target.style.backgroundColor = '#0056CC';
                                    } else {
                                        e.target.style.backgroundColor = '#D70015';
                                    }
                                    e.target.style.transform = 'scale(0.98)';
                                }}
                                onMouseLeave={(e) => {
                                    if (statusConfig.canStart) {
                                        e.target.style.backgroundColor = '#007AFF';
                                    } else {
                                        e.target.style.backgroundColor = '#FF3B30';
                                    }
                                    e.target.style.transform = 'scale(1)';
                                }}
                            >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    {statusConfig.canStart ? (
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    ) : (
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                    )}
                                </svg>
                                <span>{statusConfig.canStart ? 'Start' : 'Stop'}</span>
                            </button>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                            style={{ backgroundColor: '#111111' }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#1C1C1E';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#111111';
                            }}
                        >
                            <svg className="w-5 h-5" style={{ color: '#8E8E93' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Chat Thread */}
                <div className="flex-1">
                    <ChatThread messages={messages} />
                </div>
            </div>
        </div>
    );
};

export default TaskThreadModal;

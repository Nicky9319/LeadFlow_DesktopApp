import React from 'react';

const TaskCard = ({ id, query, status, isClickable }) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'active':
                return {
                    color: '#00D09C',
                    label: 'Active'
                };
            case 'halted':
                return {
                    color: '#FF9500',
                    label: 'Halted'
                };
            case 'userStopped':
                return {
                    color: '#FF3B30',
                    label: 'Stopped'
                };
            default:
                return {
                    color: '#8E8E93',
                    label: 'Unknown'
                };
        }
    };

    const statusConfig = getStatusConfig(status);

    return (
        <div 
            className={`rounded-2xl p-5 border transition-all duration-300 group ${isClickable ? 'hover:scale-[1.02]' : ''}`}
            style={{ 
                backgroundColor: '#1C1C1E',
                borderColor: '#2D2D2F'
            }}
            onMouseEnter={(e) => {
                if (isClickable) {
                    e.target.style.borderColor = '#007AFF';
                }
            }}
            onMouseLeave={(e) => {
                if (isClickable) {
                    e.target.style.borderColor = '#2D2D2F';
                }
            }}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                    <div className="flex flex-col flex-1">
                        {/* Task ID */}
                        <div className="flex items-center space-x-2 mb-2">
                            <span 
                                className="text-xs font-medium"
                                style={{ color: '#8E8E93' }}
                            >
                                Task ID:
                            </span>
                            <span 
                                className="text-xs font-semibold"
                                style={{ color: '#E5E5E7' }}
                            >
                                #{id}
                            </span>
                        </div>
                        
                        {/* Task Query */}
                        <p 
                            className="text-sm leading-relaxed"
                            style={{ color: '#E5E5E7' }}
                        >
                            {query}
                        </p>
                    </div>
                </div>
                
                {/* Status Indicator */}
                <div className="relative ml-4 flex-shrink-0">
                    <div 
                        className="w-3 h-3 rounded-full transition-all duration-150 group-hover:scale-110"
                        style={{ backgroundColor: statusConfig.color }}
                    />
                    
                    {/* Status Tooltip */}
                    <div 
                        className="absolute right-0 top-6 px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none transition-all duration-150 transform translate-y-1 group-hover:translate-y-0"
                        style={{
                            backgroundColor: '#111111',
                            color: '#E5E5E7',
                            border: '1px solid #1C1C1E',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                        }}
                    >
                        {statusConfig.label}
                        {/* Arrow pointing to status indicator */}
                        <div 
                            className="absolute right-1.5 -top-1 w-0 h-0"
                            style={{
                                borderLeft: '4px solid transparent',
                                borderRight: '4px solid transparent',
                                borderBottom: '4px solid #111111'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;


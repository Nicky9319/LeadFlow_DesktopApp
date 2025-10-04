import React from 'react';

const SidebarItem = ({ icon, label, isActive, onClick }) => {
    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onClick) {
            onClick();
        }
    };

    const handleMouseEnter = (e) => {
        if (!isActive) {
            e.currentTarget.style.backgroundColor = 'rgba(28, 28, 30, 0.6)';
            e.currentTarget.style.color = '#E5E5E7';
        }
    };

    const handleMouseLeave = (e) => {
        if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#8E8E93';
        }
    };

    return (
        <div
            className={`flex items-center w-full px-3 py-3 cursor-pointer transition-all duration-150 rounded-lg select-none`}
            onClick={handleClick}
            style={{
                backgroundColor: isActive ? '#007AFF' : 'transparent',
                color: isActive ? '#FFFFFF' : '#8E8E93'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex items-center space-x-3 pointer-events-none">
                {icon}
                <span className="text-sm font-medium">
                    {label}
                </span>
            </div>
        </div>
    );
};

export default SidebarItem;

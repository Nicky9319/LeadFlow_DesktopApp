import React from 'react';
import SidebarItem from './SidebarItem';

const Sidebar = ({ activeTab, setActiveTab }) => (
    <div 
        className="w-56 h-full flex flex-col py-6 px-4" 
        style={{ 
            backgroundColor: '#000000',
            borderRight: '1px solid #1C1C1E'
        }}
    >
        {/* Donna Introduction */}
        <div className="mb-4 px-2">
            <p 
                className="text-sm font-medium leading-tight"
                style={{ color: '#E5E5E7' }}
            >
                I'm <span style={{ color: '#007AFF' }}>Donna</span>
            </p>
            <p 
                className="text-xs leading-tight"
                style={{ color: '#8E8E93' }}
            >
                I know everything
            </p>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col space-y-2 flex-1">
            <SidebarItem
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
                    </svg>
                }
                label="Home"
                isActive={activeTab === 'home'}
                onClick={() => setActiveTab('home')}
            />
            
            <SidebarItem
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4m0 0V7a4 4 0 00-4-4H7a4 4 0 00-4 4v10a4 4 0 004 4h6a4 4 0 004-4v-4z" />
                    </svg>
                }
                label="Active Tasks"
                isActive={activeTab === 'activeTasks'}
                onClick={() => setActiveTab('activeTasks')}
            />
            

        </div>

        {/* Bottom Section - Settings */}
        <div className="mt-auto mb-4">
            <SidebarItem
                icon={
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                }
                label="Settings"
                isActive={activeTab === 'settings'}
                onClick={() => setActiveTab('settings')}
            />
        </div>
    </div>
);

export default Sidebar;

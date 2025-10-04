import React, { useState } from 'react';
import ManageAgents from '../../Features/ManageAgent/manageAgents';
import ManageProfile from '../../Features/ManageProfile/manageProfile';

// SidebarItem Component
const SidebarItem = ({ icon, label, isActive, onClick }) => (
    <div
        className={`px-6 py-4 cursor-pointer transition-colors flex items-center ${isActive ? 'border-l-4' : ''}`}
        onClick={onClick}
        style={{
            color: '#F9FAFB',
            backgroundColor: isActive ? '#252830' : 'transparent',
            borderColor: isActive ? '#6366F1' : 'transparent',
        }}
        onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#252830'; }}
        onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
        {icon}
        {label}
    </div>
);

// Sidebar Component
const Sidebar = ({ activeTab, setActiveTab }) => (
    <div className="w-64 h-screen shadow-lg" style={{ backgroundColor: '#1D1F24' }}>
        <div className="p-6 border-b" style={{ borderColor: '#2A2D35' }}>
            <h1 className="text-2xl font-bold" style={{ color: '#F9FAFB' }}>AgentBed</h1>
        </div>
        <nav className="mt-6">
            <SidebarItem
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>}
                label="Manage Agents"
                isActive={activeTab === 'agents'}
                onClick={() => setActiveTab('agents')}
            />
            <SidebarItem
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>}
                label="Profile"
                isActive={activeTab === 'profile'}
                onClick={() => setActiveTab('profile')}
            />
        </nav>
    </div>
);

// MainContent Component
const MainContent = ({ activeTab }) => (
    <div className="flex-1 p-10 overflow-auto">
        {activeTab === 'agents' && <ManageAgents />}
        {activeTab === 'profile' && <ManageProfile />}
    </div>
);

const MainPage = () => {
    const [activeTab, setActiveTab] = useState('agents'); // Default to agents tab
    
    return (
        <div className="flex h-screen" style={{ backgroundColor: '#121317' }}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <MainContent activeTab={activeTab} />
        </div>
    );
};

export default MainPage;
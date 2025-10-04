import React, { useState } from 'react';
import LeftNavBar from '../../left-navbar/left-nav-bar';
import Leads from '../../leads/leads';
import Buckets from '../../buckets/buckets';

const MainPage = () => {
    const [activeTab, setActiveTab] = useState('buckets');

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const renderActiveComponent = () => {
        switch (activeTab) {
            case 'leads':
                return <Leads />;
            case 'buckets':
            default:
                return <Buckets />;
        }
    };

    return (
        <div className="main-container">
            <LeftNavBar activeTab={activeTab} onTabChange={handleTabChange} />
            <div className="content-area">
                <header className="page-header">
                    <h1 className="page-title">Lead Flow</h1>
                </header>
                <div className="content-wrapper">
                    {renderActiveComponent()}
                </div>
            </div>
        </div>
    );
};

export default MainPage;
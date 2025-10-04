import React from 'react';

const Leads = () => {
    const mockLeads = [
        { 
            id: 1, 
            name: 'John Smith', 
            email: 'john.smith@company.com', 
            status: 'active', 
            bucket: 'Hot Leads',
            lastContact: '2 hours ago'
        },
        { 
            id: 2, 
            name: 'Sarah Johnson', 
            email: 'sarah.j@business.com', 
            status: 'active', 
            bucket: 'Warm Leads',
            lastContact: '1 day ago'
        },
        { 
            id: 3, 
            name: 'Mike Wilson', 
            email: 'mike.wilson@corp.com', 
            status: 'halted', 
            bucket: 'Follow Up',
            lastContact: '3 days ago'
        },
        { 
            id: 4, 
            name: 'Emily Davis', 
            email: 'emily.d@startup.com', 
            status: 'stopped', 
            bucket: 'Cold Leads',
            lastContact: '1 week ago'
        },
        { 
            id: 5, 
            name: 'Robert Brown', 
            email: 'robert.brown@enterprise.com', 
            status: 'active', 
            bucket: 'Qualified',
            lastContact: '30 minutes ago'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return '#00D09C';
            case 'halted': return '#FF9500';
            case 'stopped': return '#FF3B30';
            default: return '#8E8E93';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'active': return 'Active';
            case 'halted': return 'Halted';
            case 'stopped': return 'Stopped';
            default: return 'Unknown';
        }
    };

    return (
        <div className="leads-container">
            <div className="section-header">
                <h2 className="section-title">Leads</h2>
                <p className="section-description">Manage and track your leads</p>
            </div>
            
            <div className="leads-actions">
                <button className="add-lead-btn">
                    <span className="add-icon">+</span>
                    <span>Add New Lead</span>
                </button>
                <div className="leads-filters">
                    <select className="filter-select">
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="halted">Halted</option>
                        <option value="stopped">Stopped</option>
                    </select>
                    <select className="filter-select">
                        <option value="all">All Buckets</option>
                        <option value="hot">Hot Leads</option>
                        <option value="warm">Warm Leads</option>
                        <option value="cold">Cold Leads</option>
                    </select>
                </div>
            </div>
            
            <div className="leads-table">
                <div className="table-header">
                    <div className="header-cell">Name</div>
                    <div className="header-cell">Email</div>
                    <div className="header-cell">Status</div>
                    <div className="header-cell">Bucket</div>
                    <div className="header-cell">Last Contact</div>
                    <div className="header-cell">Actions</div>
                </div>
                
                <div className="table-body">
                    {mockLeads.map((lead) => (
                        <div key={lead.id} className="table-row">
                            <div className="table-cell" data-label="Name:">
                                <div className="lead-name">{lead.name}</div>
                            </div>
                            <div className="table-cell" data-label="Email:">
                                <div className="lead-email">{lead.email}</div>
                            </div>
                            <div className="table-cell" data-label="Status:">
                                <div className="status-badge" style={{ backgroundColor: getStatusColor(lead.status) }}>
                                    {getStatusLabel(lead.status)}
                                </div>
                            </div>
                            <div className="table-cell" data-label="Bucket:">
                                <div className="bucket-tag">{lead.bucket}</div>
                            </div>
                            <div className="table-cell" data-label="Last Contact:">
                                <div className="last-contact">{lead.lastContact}</div>
                            </div>
                            <div className="table-cell" data-label="Actions:">
                                <div className="action-buttons">
                                    <button className="action-btn view">View</button>
                                    <button className="action-btn edit">Edit</button>
                                    <button className="action-btn delete">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Leads;
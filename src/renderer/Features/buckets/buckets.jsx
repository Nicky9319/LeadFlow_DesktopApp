import React from 'react';

const Buckets = () => {
    const mockBuckets = [
        { id: 1, name: 'Hot Leads', count: 12, color: '#00D09C' },
        { id: 2, name: 'Warm Leads', count: 25, color: '#FF9500' },
        { id: 3, name: 'Cold Leads', count: 8, color: '#007AFF' },
        { id: 4, name: 'Qualified', count: 15, color: '#00D09C' },
        { id: 5, name: 'Follow Up', count: 30, color: '#FF9500' }
    ];

    return (
        <div className="buckets-container">
            <div className="section-header">
                <h2 className="section-title">Buckets</h2>
                <p className="section-description">Organize your leads into different categories</p>
            </div>
            
            <div className="buckets-grid">
                {mockBuckets.map((bucket) => (
                    <div key={bucket.id} className="bucket-card">
                        <div className="bucket-header">
                            <div 
                                className="bucket-indicator" 
                                style={{ backgroundColor: bucket.color }}
                            ></div>
                            <h3 className="bucket-name">{bucket.name}</h3>
                        </div>
                        <div className="bucket-count">
                            <span className="count-number">{bucket.count}</span>
                            <span className="count-label">leads</span>
                        </div>
                        <div className="bucket-actions">
                            <button className="bucket-btn primary">View</button>
                            <button className="bucket-btn secondary">Edit</button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="add-bucket-section">
                <button className="add-bucket-btn">
                    <span className="add-icon">+</span>
                    <span>Add New Bucket</span>
                </button>
            </div>
        </div>
    );
};

export default Buckets;
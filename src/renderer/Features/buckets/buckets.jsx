import React, { useState, useEffect } from 'react';
import BucketCard from './components/BucketCard';
import AddBucketModal from './components/AddBucketModal';
import './buckets.css';

const Buckets = () => {
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [buckets, setBuckets] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock function to fetch buckets - replace with actual API call
    const fetchBuckets = async () => {
        try {
            setLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock data with UUID-like IDs
            const mockBuckets = [
                { id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', name: 'Hot Leads' },
                { id: 'f1e2d3c4-b5a6-9870-5432-109876fedcba', name: 'Warm Leads' },
                { id: '12345678-9abc-def0-1234-56789abcdef0', name: 'Cold Leads' },
                { id: '87654321-0fed-cba9-8765-43210fedcba9', name: 'Qualified' },
                { id: 'abcdef12-3456-7890-abcd-ef1234567890', name: 'Follow Up' }
            ];
            
            setBuckets(mockBuckets);
            console.log('Fetched buckets:', mockBuckets);
            // TODO: Replace with actual API call
            // const response = await api.getBuckets();
            // setBuckets(response.data);
        } catch (error) {
            console.error('Error fetching buckets:', error);
            setBuckets([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch buckets on component mount
    useEffect(() => {
        fetchBuckets();
    }, []);

    // Function to handle bucket name update
    const handleUpdateBucket = (bucketId, newName) => {
        setBuckets(prevBuckets => 
            prevBuckets.map(bucket => 
                bucket.id === bucketId 
                    ? { ...bucket, name: newName }
                    : bucket
            )
        );
        
        // Make API call or function call with bucket ID and new name
        console.log('Updating bucket:', { bucketId, newName });
        // TODO: Replace with actual API call
        // updateBucketName(bucketId, newName);
    };

    // Function to handle bucket creation
    const handleCreateBucket = (bucketName) => {
        // Generate a mock UUID for the new bucket
        const generateMockId = () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };
        
        const newBucket = {
            id: generateMockId(),
            name: bucketName
        };
        
        setBuckets(prevBuckets => [...prevBuckets, newBucket]);
        
        // Make API call or function call with bucket name
        console.log('Creating bucket:', { bucketName });
        // TODO: Replace with actual API call
        // createBucket(bucketName);
    };

    return (
        <div className="buckets-container">
            <div className="section-header">
                <div className="header-content">
                    <div className="title-section">
                        <h2 className="section-title">Buckets</h2>
                        <p className="section-description">Organize your leads into different categories</p>
                    </div>
                    
                    <div className="header-actions">
                        <div className="view-toggle">
                            <button 
                                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <span className="view-icon">⊞</span>
                                Grid
                            </button>
                            <button 
                                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <span className="view-icon">☰</span>
                                List
                            </button>
                        </div>
                        
                        <button 
                            className="refresh-btn"
                            onClick={fetchBuckets}
                            disabled={loading}
                        >
                            <span className="refresh-icon">↻</span>
                            {loading ? 'Loading...' : 'Refresh'}
                        </button>
                        
                        <button 
                            className="add-bucket-btn"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <span className="add-icon">+</span>
                            Add Bucket
                        </button>
                    </div>
                </div>
            </div>
            
            {loading ? (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading buckets...</p>
                </div>
            ) : (
                <div className={`buckets-container-inner ${viewMode}`}>
                    {buckets.map((bucket) => (
                        <BucketCard
                            key={bucket.id}
                            bucket={bucket}
                            onUpdateBucket={handleUpdateBucket}
                            viewMode={viewMode}
                        />
                    ))}
                </div>
            )}
            
            {!loading && buckets.length === 0 && (
                <div className="empty-state">
                    <p>No buckets yet. Create your first bucket to get started!</p>
                </div>
            )}
            
            <AddBucketModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreateBucket={handleCreateBucket}
            />
        </div>
    );
};

export default Buckets;
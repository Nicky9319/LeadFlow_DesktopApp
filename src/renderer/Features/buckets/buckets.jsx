import React, { useState, useEffect } from 'react';
import BucketCard from './components/BucketCard';
import AddBucketModal from './components/AddBucketModal';

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
        <div className="p-5 max-w-6xl mx-auto bg-black min-h-screen">
            <div className="mb-8">
                <div className="flex justify-between items-start gap-5 flex-wrap">
                    <div className="flex-1">
                        <h2 className="text-3xl font-semibold text-white mb-2">Buckets</h2>
                        <p className="text-base text-gray-400">Organize your leads into different categories</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex border border-gray-800 rounded-lg overflow-hidden bg-gray-900">
                            <button 
                                className={`px-4 py-2 text-sm flex items-center gap-1.5 transition-all duration-200 ${
                                    viewMode === 'grid' 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                }`}
                                onClick={() => setViewMode('grid')}
                            >
                                <span className="text-base">⊞</span>
                                Grid
                            </button>
                            <button 
                                className={`px-4 py-2 text-sm flex items-center gap-1.5 transition-all duration-200 ${
                                    viewMode === 'list' 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                }`}
                                onClick={() => setViewMode('list')}
                            >
                                <span className="text-base">☰</span>
                                List
                            </button>
                        </div>
                        
                        <button 
                            className="px-4 py-2.5 bg-gray-900 text-gray-200 border border-gray-800 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 hover:bg-gray-800 hover:border-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={fetchBuckets}
                            disabled={loading}
                        >
                            <span className="text-base">↻</span>
                            {loading ? 'Loading...' : 'Refresh'}
                        </button>
                        
                        <button 
                            className="px-5 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors duration-200 hover:bg-blue-600"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <span className="text-lg font-bold">+</span>
                            Add Bucket
                        </button>
                    </div>
                </div>
            </div>
            
            {loading ? (
                <div className="text-center py-15 text-gray-400">
                    <div className="w-10 h-10 border-3 border-gray-800 border-t-blue-500 rounded-full mx-auto mb-2.5 animate-spin"></div>
                    <p className="text-base">Loading buckets...</p>
                </div>
            ) : (
                <div className={`transition-all duration-300 ${
                    viewMode === 'grid' 
                        ? 'grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5' 
                        : 'flex flex-col gap-3'
                }`}>
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
                <div className="text-center py-15 text-gray-400">
                    <p className="text-base">No buckets yet. Create your first bucket to get started!</p>
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
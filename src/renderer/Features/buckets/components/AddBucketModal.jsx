import React, { useState } from 'react';

const AddBucketModal = ({ isOpen, onClose, onCreateBucket }) => {
    const [bucketName, setBucketName] = useState('');

    const handleCreate = () => {
        if (bucketName.trim() !== '') {
            onCreateBucket(bucketName.trim());
            setBucketName('');
            onClose();
        }
    };

    const handleCancel = () => {
        setBucketName('');
        onClose();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleCreate();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Add New Bucket</h3>
                    <button 
                        className="modal-close-btn"
                        onClick={handleCancel}
                    >
                        ×
                    </button>
                </div>
                
                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="bucketName" className="form-label">
                            Bucket Name
                        </label>
                        <input
                            id="bucketName"
                            type="text"
                            value={bucketName}
                            onChange={(e) => setBucketName(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="form-input"
                            placeholder="Enter bucket name..."
                            autoFocus
                        />
                    </div>
                </div>
                
                <div className="modal-footer">
                    <button 
                        className="modal-btn secondary"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button 
                        className="modal-btn primary"
                        onClick={handleCreate}
                        disabled={bucketName.trim() === ''}
                    >
                        Create Bucket
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddBucketModal;
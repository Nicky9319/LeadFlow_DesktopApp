import React, { useState } from 'react';

const BucketCard = ({ bucket, onUpdateBucket, viewMode = 'grid' }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(bucket.name);

    const handleSave = () => {
        if (editName.trim() !== bucket.name && editName.trim() !== '') {
            onUpdateBucket(bucket.id, editName.trim());
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditName(bucket.name);
        setIsEditing(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    if (viewMode === 'list') {
        return (
            <div className="bucket-list-item">
                <div className="bucket-list-content">
                    <div className="bucket-id-section">
                        <span className="bucket-id-label">ID:</span>
                        <span className="bucket-id">{bucket.id}</span>
                    </div>
                    <div className="bucket-name-section">
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="bucket-name-input"
                                    autoFocus
                                />
                                <div className="bucket-actions-inline">
                                    <button 
                                        className="bucket-btn save"
                                        onClick={handleSave}
                                        title="Save changes"
                                    >
                                        ✓
                                    </button>
                                    <button 
                                        className="bucket-btn cancel"
                                        onClick={handleCancel}
                                        title="Cancel editing"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="bucket-name">{bucket.name}</span>
                                <button 
                                    className="bucket-btn edit"
                                    onClick={() => setIsEditing(true)}
                                    title="Edit bucket name"
                                >
                                    ✎
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Grid view (default)
    return (
        <div className="bucket-card">
            <div className="bucket-card-content">
                <div className="bucket-id-section">
                    <span className="bucket-id-label">ID:</span>
                    <span className="bucket-id">{bucket.id}</span>
                </div>
                
                <div className="bucket-name-section">
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="bucket-name-input"
                                autoFocus
                            />
                            <div className="bucket-actions-inline">
                                <button 
                                    className="bucket-btn save"
                                    onClick={handleSave}
                                    title="Save changes"
                                >
                                    ✓
                                </button>
                                <button 
                                    className="bucket-btn cancel"
                                    onClick={handleCancel}
                                    title="Cancel editing"
                                >
                                    ✕
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h3 className="bucket-name">{bucket.name}</h3>
                            <button 
                                className="bucket-btn edit"
                                onClick={() => setIsEditing(true)}
                                title="Edit bucket name"
                            >
                                ✎
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BucketCard;
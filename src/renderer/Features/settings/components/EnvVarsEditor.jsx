import React, { useState } from 'react';

const EnvVarsEditor = ({ variables = {}, onSave }) => {
    const [vars, setVars] = useState(variables);
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (key, value) => {
        setVars(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        if (onSave) {
            onSave(vars);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setVars(variables);
        setIsEditing(false);
    };

    return (
        <div 
            className="rounded-xl p-6 border border-[#3A86FF]/20"
            style={{ backgroundColor: '#0D1B2A' }}
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold" style={{ color: '#FFFFFF' }}>
                    Environment Variables
                </h3>
                <div className="flex gap-2">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 rounded text-sm font-medium transition-colors"
                            style={{ 
                                backgroundColor: '#3A86FF',
                                color: '#FFFFFF'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#265DF2'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#3A86FF'}
                        >
                            Edit
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 rounded text-sm font-medium transition-colors"
                                style={{ 
                                    backgroundColor: '#00D09C',
                                    color: '#FFFFFF'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#00B894'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#00D09C'}
                            >
                                Save
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 rounded text-sm font-medium transition-colors border"
                                style={{ 
                                    backgroundColor: 'transparent',
                                    color: '#E0E0E0',
                                    borderColor: '#3A86FF'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#3A86FF/10'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>
            
            <div className="space-y-4">
                {Object.entries(vars).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                        <label 
                            className="block text-sm font-medium"
                            style={{ color: '#E0E0E0' }}
                        >
                            {key}
                        </label>
                        <input
                            className="w-full rounded-md p-3 text-sm transition-colors border"
                            style={{ 
                                backgroundColor: '#1A2332',
                                color: '#E0E0E0',
                                borderColor: isEditing ? '#3A86FF' : '#2A3441'
                            }}
                            value={value}
                            onChange={e => handleChange(key, e.target.value)}
                            disabled={!isEditing}
                            placeholder={`Enter ${key}...`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EnvVarsEditor;

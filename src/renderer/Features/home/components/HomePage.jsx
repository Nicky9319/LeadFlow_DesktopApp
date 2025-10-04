import React, { useState, useEffect } from 'react';
import '../../../styles/scrollbar.css';
import envVarsResponse from '../API Calls Responses/get-all-env-var.json';

const HomePage = () => {
    const [apiKeys, setApiKeys] = useState({
        OPENAI_API_KEY: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        ANTHROPIC_API_KEY: 'sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        GOOGLE_API_KEY: 'AIza-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    });

    const [quickAction, setQuickAction] = useState('');
    const [editingKey, setEditingKey] = useState(null);
    const [showPasswords, setShowPasswords] = useState({});
    const [newVar, setNewVar] = useState({ key: '', value: '' });

    // show inline add form when plus is clicked
    const [showAddForm, setShowAddForm] = useState(false);

    // Simulate API call to fetch all env variables
    const fetchEnvVariables = async () => {
        // In the future, replace this with an actual API call
        if (envVarsResponse && Array.isArray(envVarsResponse.data)) {
            const vars = {};
            envVarsResponse.data.forEach(item => {
                vars[item.name] = item.value;
            });
            setApiKeys(vars);
        }
    };

    useEffect(() => {
        fetchEnvVariables();
    }, []);

    // Add new env variable via API
    const addEnvVariable = async (key, value) => {
        try {
            const response = await fetch('http://127.0.0.1:12672/api/add-new-env', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    env_var_name: key,
                    env_var_value: value
                })
            });
            // Optionally handle response
            // const data = await response.json();
        } catch (e) {
            // Optionally handle error
        }
    };

    // Update env variable via API
    const updateEnvVariable = async (key, value) => {
        try {
            const response = await fetch('http://127.0.0.1:12672/api/update-env-var', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    env_var: key,
                    value: value
                })
            });
            // Optionally handle response
            // const data = await response.json();
        } catch (e) {
            // Optionally handle error
        }
    };

    // Delete env variable via API
    const deleteEnvVariable = async (key) => {
        try {
            await fetch(`http://127.0.0.1:12672/api/delete-env/${encodeURIComponent(key)}`, {
                method: 'DELETE'
            });
            // Optionally handle response
        } catch (e) {
            // Optionally handle error
        }
    };

    const handleDeleteVariable = (key) => {
        deleteEnvVariable(key);
        setApiKeys(prev => {
            const updated = { ...prev };
            delete updated[key];
            return updated;
        });
        setShowPasswords(prev => {
            const updated = { ...prev };
            delete updated[key];
            return updated;
        });
        if (editingKey === key) setEditingKey(null);
    };

    const handleApiKeyChange = (key, value) => {
        setApiKeys(prev => ({ ...prev, [key]: value }));
    };

    const handleQuickAction = () => {
        if (quickAction.trim()) {
            console.log('Quick action:', quickAction);
            // TODO: Handle quick action
            setQuickAction('');
        }
    };

    const togglePasswordVisibility = (key) => {
        setShowPasswords(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const startEditing = (key) => {
        setEditingKey(key);
    };

    const saveEdit = (key) => {
        updateEnvVariable(key, apiKeys[key]);
        setEditingKey(null);
    };

    const cancelEdit = () => {
        setEditingKey(null);
    };

    const handleAddVariable = () => {
        const raw = newVar.key.trim();
        if (!raw) return;
        // normalize variable name to use underscores instead of spaces
        const normalized = raw.replace(/\s+/g, '_');
        if (apiKeys.hasOwnProperty(normalized)) return;
        addEnvVariable(normalized, newVar.value);
        setApiKeys(prev => ({ ...prev, [normalized]: newVar.value }));
        setNewVar({ key: '', value: '' });
        setShowAddForm(false);
    };

    const cancelAdd = () => {
        setNewVar({ key: '', value: '' });
        setShowAddForm(false);
    };

    return (
        <div className="min-h-full flex flex-col px-8 py-8 overflow-y-auto" 
            style={{ backgroundColor: '#000000' }}>
            {/* Header Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extralight tracking-tight mb-3" style={{ color: '#FFFFFF' }}>
                    Meet{' '}
                    <span className="font-light" style={{ color: '#00D09C' }}>
                        Donna
                    </span>
                </h1>
                <p className="text-base font-light opacity-70" style={{ color: '#FFFFFF' }}>
                    Your intelligent assistant for any task
                </p>
            </div>

            {/* Main Content */}
            <div className="flex justify-center pb-8">
                <div 
                    className="w-full max-w-2xl rounded-2xl p-8"
                    style={{ 
                        backgroundColor: '#0A0A0A',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                    }}
                >
                    {/* Section Title */}
                    <div className="mb-8">
                        <h2 className="text-lg font-light mb-2" style={{ color: '#FFFFFF' }}>
                            Environment Variables
                        </h2>
                        <p className="text-xs opacity-60" style={{ color: '#FFFFFF' }}>
                            Configure your API keys and environment variables
                        </p>
                    </div>

                    {/* Variables List */}
                    <div className="space-y-6">
                        {Object.entries(apiKeys).map(([key, value]) => (
                            <div 
                                key={key} 
                                className="rounded-xl p-5 transition-all duration-200"
                                style={{ 
                                    backgroundColor: '#111111',
                                    border: '1px solid rgba(255,255,255,0.06)'
                                }}
                            >
                                <label className="text-sm font-medium block mb-3" style={{ color: '#E5E5E7' }}>
                                    {key.replace(/_/g, ' ')}
                                </label>
                                <div className="flex items-center space-x-2">
                                    <div 
                                        className="flex-1 px-4 py-3 rounded-lg text-sm font-mono"
                                        style={{
                                            backgroundColor: '#1A1A1A',
                                            color: '#8E8E93',
                                            border: '1px solid rgba(255,255,255,0.05)'
                                        }}
                                    >
                                        {editingKey === key ? (
                                            <input
                                                type={showPasswords[key] ? "text" : "password"}
                                                value={value}
                                                onChange={(e) => handleApiKeyChange(key, e.target.value)}
                                                className="w-full bg-transparent outline-none"
                                                style={{
                                                    color: '#E5E5E7',
                                                    background: 'transparent',
                                                    border: 'none'
                                                }}
                                            />
                                        ) : (
                                            showPasswords[key] ? value : '•'.repeat(40)
                                        )}
                                    </div>
                                    {/* Action Buttons */}
                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={() => togglePasswordVisibility(key)}
                                            className="p-2.5 rounded-lg transition-colors hover:bg-[#1C1C1E]"
                                            style={{ color: '#8E8E93' }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                {showPasswords[key] ? (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                ) : (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                )}
                                            </svg>
                                        </button>
                                        {editingKey === key ? (
                                            <>
                                                <button
                                                    onClick={() => saveEdit(key)}
                                                    className="p-2.5 rounded-lg transition-colors hover:bg-[#1C1C1E]"
                                                    style={{ color: '#00D09C' }}
                                                >
                                                    {/* Save icon */}
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="p-2.5 rounded-lg transition-colors hover:bg-[#1C1C1E]"
                                                    style={{ color: '#8E8E93' }}
                                                >
                                                    {/* Cancel icon */}
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => startEditing(key)}
                                                className="p-2.5 rounded-lg transition-colors hover:bg-[#1C1C1E]"
                                                style={{ color: '#007AFF' }}
                                            >
                                                {/* Edit icon */}
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteVariable(key)}
                                            className="p-2.5 rounded-lg transition-colors hover:bg-[#1C1C1E]"
                                            style={{ color: '#FF3B30' }}
                                        >
                                            {/* Delete (dustbin/trash) icon */}
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Simplified Add Variable Form */}
                        {showAddForm ? (
                            <div 
                                className="rounded-xl p-5"
                                style={{ 
                                    backgroundColor: '#111111',
                                    border: '1px solid rgba(0,208,156,0.3)'
                                }}
                            >
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Variable name (e.g., MY_API_KEY)"
                                        value={newVar.key}
                                        onChange={e => setNewVar(v => ({ ...v, key: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-lg text-sm transition-all focus:outline-none"
                                        style={{
                                            backgroundColor: '#1A1A1A',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            color: '#FFFFFF'
                                        }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Variable value"
                                        value={newVar.value}
                                        onChange={e => setNewVar(v => ({ ...v, value: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-lg text-sm transition-all focus:outline-none"
                                        style={{
                                            backgroundColor: '#1A1A1A',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            color: '#FFFFFF'
                                        }}
                                    />
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            onClick={cancelAdd}
                                            className="px-4 py-2 rounded-lg text-xs font-medium"
                                            style={{
                                                backgroundColor: 'transparent',
                                                color: '#8E8E93'
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddVariable}
                                            className="px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                                            style={{
                                                backgroundColor: '#00D09C',
                                                color: '#000000'
                                            }}
                                            disabled={!newVar.key.trim()}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-200"
                                style={{
                                    backgroundColor: 'transparent',
                                    color: '#00D09C',
                                    border: '1px dashed rgba(0,208,156,0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'rgba(0,208,156,0.05)';
                                    e.target.style.borderColor = 'rgba(0,208,156,0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.borderColor = 'rgba(0,208,156,0.3)';
                                }}
                            >
                                + Add Variable
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default HomePage;

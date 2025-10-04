import React, { useState, useEffect } from 'react';

const ProfilePage = () => {
    const [user] = useState({
        name: 'John Doe',
        userId: 'user_123456',
    });

    const [copied, setCopied] = useState(false);
    const [animate, setAnimate] = useState(false);

    // API keys state
    const [apiKeys, setApiKeys] = useState({
        openai: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        google: 'AIza-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        anthropic: 'sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    });

    // Visibility state for each API key
    const [visibility, setVisibility] = useState({
        openai: false,
        google: false,
        anthropic: false,
    });

    // Editing state
    const [editing, setEditing] = useState({
        openai: false,
        google: false,
        anthropic: false,
    });

    useEffect(() => {
        setAnimate(true);
    }, []);

    const handleCopyId = () => {
        navigator.clipboard.writeText(user.userId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Toggle visibility of API key
    const toggleVisibility = (key) => {
        setVisibility({
            ...visibility,
            [key]: !visibility[key],
        });
    };

    // Toggle editing mode
    const toggleEditing = (key) => {
        setEditing({
            ...editing,
            [key]: !editing[key],
        });
    };

    // Handle API key change
    const handleApiKeyChange = (key, value) => {
        setApiKeys({
            ...apiKeys,
            [key]: value,
        });
    };

    // Save API key
    const saveApiKey = (key) => {
        toggleEditing(key);
        console.log(`Saving ${key} API key: ${apiKeys[key]}`);
    };

    return (
        <div className="flex items-center justify-center w-full min-h-[60vh] bg-[#121317] p-4">
            <div className={`w-full max-w-4xl transform transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Profile Card */}
                    <div className="w-full md:w-1/3">
                        <div className="bg-[#1D1F24] rounded-2xl shadow-lg overflow-hidden">
                            {/* Profile Header with Gradient */}
                            <div className="h-24 bg-gradient-to-r from-[#6366F1] to-[#0EA5E9] relative"></div>

                            {/* Profile Avatar and Info */}
                            <div className="flex flex-col items-center px-6 pb-8 -mt-12 relative">
                                <div className="w-24 h-24 rounded-full border-4 border-[#1D1F24] shadow-xl bg-[#1D1F24] flex items-center justify-center overflow-hidden">
                                    <span className="text-4xl font-extrabold text-[#F9FAFB]">
                                        {user.name.split(' ').map((n) => n[0]).join('')}
                                    </span>
                                </div>
                                <div className="absolute top-14 right-[calc(50%-40px)] w-6 h-6 rounded-full bg-[#22C55E] border-2 border-[#1D1F24] flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
                                </div>

                                <h2 className="text-xl font-bold text-[#F9FAFB] mt-4">{user.name}</h2>
                                <span className="px-3 py-1 mt-2 bg-[#6366F1] text-[#F9FAFB] text-xs font-medium rounded-full">Active User</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-full md:w-2/3 flex flex-col gap-6">
                        {/* Welcome Section */}
                        <div className="bg-[#1D1F24] rounded-2xl shadow-lg p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 rounded-full bg-[#6366F1]/20 flex items-center justify-center mr-4">
                                    <svg className="w-5 h-5 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-[#F9FAFB]">Welcome, {user.name.split(' ')[0]}!</h2>
                                    <p className="text-[#9CA3AF]">Your profile is ready to go</p>
                                </div>
                            </div>
                        </div>

                        {/* Account Info Section */}
                        <div className="bg-[#1D1F24] rounded-2xl shadow-lg p-6 flex-grow">
                            <h3 className="text-xl font-semibold text-[#F9FAFB] mb-5 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-[#0EA5E9]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Account Information
                            </h3>

                            {/* Account ID Card */}
                            <div className="relative mb-8">
                                <label className="text-sm font-medium text-[#9CA3AF] mb-2 block">User ID</label>
                                <div className="group relative">
                                    <div
                                        onClick={handleCopyId}
                                        className="flex items-center justify-between w-full bg-[#121317] text-[#F9FAFB] p-4 rounded-lg border border-[#2A2D35] cursor-pointer transition-all hover:border-[#6366F1]"
                                    >
                                        <span className="font-mono tracking-wide">{user.userId}</span>
                                        <button className="p-1.5 bg-[#6366F1] rounded-md opacity-90 hover:opacity-100 transition-opacity">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Copy Notification */}
                                    <div className={`absolute -top-12 left-1/2 transform -translate-x-1/2 bg-[#6366F1] text-white px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${copied ? 'opacity-100' : 'opacity-0'}`}>
                                        Copied to clipboard!
                                        <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 border-t-4 border-l-4 border-r-4 border-transparent border-t-[#6366F1]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* API Keys Section */}
                <div className="bg-[#1D1F24] rounded-2xl shadow-lg p-6 mb-4 w-full">
                    <h3 className="text-xl font-semibold text-[#F9FAFB] mb-5 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-[#0EA5E9]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                        </svg>
                        API Keys & Environment Variables
                    </h3>

                    <div className="space-y-4">
                        {/* OpenAI API Key */}
                        <div className="border border-[#2A2D35] rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-md bg-[#6366F1]/20 flex items-center justify-center mr-2">
                                        <span className="text-lg font-bold text-[#6366F1]">O</span>
                                    </div>
                                    <h4 className="text-[#F9FAFB] font-medium">OpenAI API Key</h4>
                                </div>
                                <div className="flex space-x-2">
                                    {!editing.openai ? (
                                        <>
                                            <button
                                                onClick={() => toggleVisibility('openai')}
                                                className="p-1.5 rounded-md bg-[#121317] text-[#9CA3AF] hover:text-[#F9FAFB]"
                                            >
                                                {visibility.openai ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                    </svg>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => toggleEditing('openai')}
                                                className="p-1.5 rounded-md bg-[#121317] text-[#9CA3AF] hover:text-[#F9FAFB]"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                                </svg>
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => saveApiKey('openai')}
                                            className="p-1.5 px-3 rounded-md bg-[#22C55E] text-white font-medium text-sm"
                                        >
                                            Save
                                        </button>
                                    )}
                                </div>
                            </div>

                            {editing.openai ? (
                                <input
                                    type="text"
                                    value={apiKeys.openai}
                                    onChange={(e) => handleApiKeyChange('openai', e.target.value)}
                                    className="w-full bg-[#121317] border border-[#2A2D35] rounded-md p-2 text-[#F9FAFB] font-mono text-sm focus:border-[#6366F1] focus:outline-none"
                                />
                            ) : (
                                <div className="bg-[#121317] border border-[#2A2D35] rounded-md p-2 font-mono text-sm overflow-x-auto">
                                    <code className="text-[#F9FAFB]">
                                        {visibility.openai ? apiKeys.openai : '•'.repeat(Math.min(apiKeys.openai.length, 40))}
                                    </code>
                                </div>
                            )}
                        </div>

                        {/* Google API Key */}
                        <div className="border border-[#2A2D35] rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-md bg-[#0EA5E9]/20 flex items-center justify-center mr-2">
                                        <span className="text-lg font-bold text-[#0EA5E9]">G</span>
                                    </div>
                                    <h4 className="text-[#F9FAFB] font-medium">Google API Key</h4>
                                </div>
                                <div className="flex space-x-2">
                                    {!editing.google ? (
                                        <>
                                            <button
                                                onClick={() => toggleVisibility('google')}
                                                className="p-1.5 rounded-md bg-[#121317] text-[#9CA3AF] hover:text-[#F9FAFB]"
                                            >
                                                {visibility.google ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                    </svg>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => toggleEditing('google')}
                                                className="p-1.5 rounded-md bg-[#121317] text-[#9CA3AF] hover:text-[#F9FAFB]"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                                </svg>
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => saveApiKey('google')}
                                            className="p-1.5 px-3 rounded-md bg-[#22C55E] text-white font-medium text-sm"
                                        >
                                            Save
                                        </button>
                                    )}
                                </div>
                            </div>

                            {editing.google ? (
                                <input
                                    type="text"
                                    value={apiKeys.google}
                                    onChange={(e) => handleApiKeyChange('google', e.target.value)}
                                    className="w-full bg-[#121317] border border-[#2A2D35] rounded-md p-2 text-[#F9FAFB] font-mono text-sm focus:border-[#6366F1] focus:outline-none"
                                />
                            ) : (
                                <div className="bg-[#121317] border border-[#2A2D35] rounded-md p-2 font-mono text-sm overflow-x-auto">
                                    <code className="text-[#F9FAFB]">
                                        {visibility.google ? apiKeys.google : '•'.repeat(Math.min(apiKeys.google.length, 40))}
                                    </code>
                                </div>
                            )}
                        </div>

                        {/* Anthropic API Key */}
                        <div className="border border-[#2A2D35] rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-md bg-[#F87171]/20 flex items-center justify-center mr-2">
                                        <span className="text-lg font-bold text-[#F87171]">A</span>
                                    </div>
                                    <h4 className="text-[#F9FAFB] font-medium">Anthropic API Key (Claude)</h4>
                                </div>
                                <div className="flex space-x-2">
                                    {!editing.anthropic ? (
                                        <>
                                            <button
                                                onClick={() => toggleVisibility('anthropic')}
                                                className="p-1.5 rounded-md bg-[#121317] text-[#9CA3AF] hover:text-[#F9FAFB]"
                                            >
                                                {visibility.anthropic ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                    </svg>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => toggleEditing('anthropic')}
                                                className="p-1.5 rounded-md bg-[#121317] text-[#9CA3AF] hover:text-[#F9FAFB]"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                                </svg>
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => saveApiKey('anthropic')}
                                            className="p-1.5 px-3 rounded-md bg-[#22C55E] text-white font-medium text-sm"
                                        >
                                            Save
                                        </button>
                                    )}
                                </div>
                            </div>

                            {editing.anthropic ? (
                                <input
                                    type="text"
                                    value={apiKeys.anthropic}
                                    onChange={(e) => handleApiKeyChange('anthropic', e.target.value)}
                                    className="w-full bg-[#121317] border border-[#2A2D35] rounded-md p-2 text-[#F9FAFB] font-mono text-sm focus:border-[#6366F1] focus:outline-none"
                                />
                            ) : (
                                <div className="bg-[#121317] border border-[#2A2D35] rounded-md p-2 font-mono text-sm overflow-x-auto">
                                    <code className="text-[#F9FAFB]">
                                        {visibility.anthropic ? apiKeys.anthropic : '•'.repeat(Math.min(apiKeys.anthropic.length, 40))}
                                    </code>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

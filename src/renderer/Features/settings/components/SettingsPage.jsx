import React, { useState } from 'react';

const SettingsPage = () => {
    const [activeSection, setActiveSection] = useState('general');
    const [settings, setSettings] = useState({
        // General Settings
        theme: 'dark',
        language: 'english',
        autoSave: true,
        notifications: true,
        soundEffects: false,
        
        // API Settings
        openaiKey: '',
        anthropicKey: '',
        googleKey: '',
        apiTimeout: 30,
        maxRetries: 3,
        
        // Task Settings
        autoStart: false,
        maxConcurrentTasks: 5,
        taskTimeout: 300,
        saveTaskHistory: true,
        
        // Privacy Settings
        dataCollection: false,
        crashReports: true,
        analytics: false,
        
        // Performance Settings
        enableLogging: true,
        logLevel: 'info',
        maxLogSize: 100,
        cacheSize: 500
    });

    const settingSections = [
        {
            id: 'general',
            label: 'General',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        },
        {
            id: 'api',
            label: 'API Keys',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
            )
        },
        {
            id: 'tasks',
            label: 'Tasks',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10V9a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2H9V7" />
                </svg>
            )
        },
        {
            id: 'privacy',
            label: 'Privacy',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            )
        },
        {
            id: 'performance',
            label: 'Performance',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        }
    ];

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const renderToggleSwitch = (key, label, description) => (
        <div className="flex items-center justify-between py-3">
            <div className="flex-1">
                <h3 className="text-sm font-medium" style={{ color: '#FFFFFF' }}>
                    {label}
                </h3>
                {description && (
                    <p className="text-xs mt-1" style={{ color: '#8E8E93' }}>
                        {description}
                    </p>
                )}
            </div>
            <button
                onClick={() => handleSettingChange(key, !settings[key])}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    settings[key] ? 'bg-blue-600' : 'bg-gray-600'
                }`}
                style={{
                    backgroundColor: settings[key] ? '#007AFF' : '#3A3A3C'
                }}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        settings[key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );

    const renderSelectField = (key, label, options, description) => (
        <div className="py-3">
            <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                {label}
            </label>
            {description && (
                <p className="text-xs mb-3" style={{ color: '#8E8E93' }}>
                    {description}
                </p>
            )}
            <select
                value={settings[key]}
                onChange={(e) => handleSettingChange(key, e.target.value)}
                className="w-full px-3 py-2 rounded-lg border transition-all duration-150 focus:outline-none text-sm"
                style={{
                    backgroundColor: '#111111',
                    borderColor: '#1C1C1E',
                    color: '#FFFFFF'
                }}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );

    const renderNumberField = (key, label, min, max, description) => (
        <div className="py-3">
            <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                {label}
            </label>
            {description && (
                <p className="text-xs mb-3" style={{ color: '#8E8E93' }}>
                    {description}
                </p>
            )}
            <input
                type="number"
                min={min}
                max={max}
                value={settings[key]}
                onChange={(e) => handleSettingChange(key, parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border transition-all duration-150 focus:outline-none text-sm"
                style={{
                    backgroundColor: '#111111',
                    borderColor: '#1C1C1E',
                    color: '#FFFFFF'
                }}
            />
        </div>
    );

    const renderPasswordField = (key, label, description) => (
        <div className="py-3">
            <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                {label}
            </label>
            {description && (
                <p className="text-xs mb-3" style={{ color: '#8E8E93' }}>
                    {description}
                </p>
            )}
            <input
                type="password"
                value={settings[key]}
                onChange={(e) => handleSettingChange(key, e.target.value)}
                placeholder={`Enter your ${label.toLowerCase()}...`}
                className="w-full px-3 py-2 rounded-lg border transition-all duration-150 focus:outline-none text-sm"
                style={{
                    backgroundColor: '#111111',
                    borderColor: '#1C1C1E',
                    color: '#FFFFFF'
                }}
            />
        </div>
    );

    const renderSettingsContent = () => {
        switch (activeSection) {
            case 'general':
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold mb-4" style={{ color: '#FFFFFF' }}>
                                General Settings
                            </h2>
                            <div className="space-y-1">
                                {renderSelectField('theme', 'Theme', [
                                    { value: 'dark', label: 'Dark' },
                                    { value: 'light', label: 'Light' },
                                    { value: 'auto', label: 'Auto' }
                                ], 'Choose your preferred color scheme')}
                                
                                {renderSelectField('language', 'Language', [
                                    { value: 'english', label: 'English' },
                                    { value: 'spanish', label: 'Spanish' },
                                    { value: 'french', label: 'French' },
                                    { value: 'german', label: 'German' }
                                ], 'Select your preferred language')}
                                
                                {renderToggleSwitch('autoSave', 'Auto Save', 'Automatically save your work')}
                                {renderToggleSwitch('notifications', 'Notifications', 'Receive desktop notifications')}
                                {renderToggleSwitch('soundEffects', 'Sound Effects', 'Play sound effects for actions')}
                            </div>
                        </div>
                    </div>
                );

            case 'api':
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold mb-4" style={{ color: '#FFFFFF' }}>
                                API Configuration
                            </h2>
                            <div className="space-y-1">
                                {renderPasswordField('openaiKey', 'OpenAI API Key', 'Your OpenAI API key for GPT models')}
                                {renderPasswordField('anthropicKey', 'Anthropic API Key', 'Your Anthropic API key for Claude models')}
                                {renderPasswordField('googleKey', 'Google API Key', 'Your Google API key for services')}
                                
                                {renderNumberField('apiTimeout', 'API Timeout (seconds)', 10, 300, 'Maximum time to wait for API responses')}
                                {renderNumberField('maxRetries', 'Max Retries', 1, 10, 'Number of times to retry failed API calls')}
                            </div>
                        </div>
                    </div>
                );

            case 'tasks':
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold mb-4" style={{ color: '#FFFFFF' }}>
                                Task Management
                            </h2>
                            <div className="space-y-1">
                                {renderToggleSwitch('autoStart', 'Auto Start Tasks', 'Automatically start new tasks when created')}
                                {renderToggleSwitch('saveTaskHistory', 'Save Task History', 'Keep a history of completed tasks')}
                                
                                {renderNumberField('maxConcurrentTasks', 'Max Concurrent Tasks', 1, 20, 'Maximum number of tasks running simultaneously')}
                                {renderNumberField('taskTimeout', 'Task Timeout (seconds)', 60, 3600, 'Maximum time for a single task to run')}
                            </div>
                        </div>
                    </div>
                );

            case 'privacy':
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold mb-4" style={{ color: '#FFFFFF' }}>
                                Privacy & Security
                            </h2>
                            <div className="space-y-1">
                                {renderToggleSwitch('dataCollection', 'Data Collection', 'Allow anonymous usage data collection')}
                                {renderToggleSwitch('crashReports', 'Crash Reports', 'Send crash reports to help improve the app')}
                                {renderToggleSwitch('analytics', 'Analytics', 'Enable usage analytics')}
                            </div>
                        </div>
                    </div>
                );

            case 'performance':
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold mb-4" style={{ color: '#FFFFFF' }}>
                                Performance Settings
                            </h2>
                            <div className="space-y-1">
                                {renderToggleSwitch('enableLogging', 'Enable Logging', 'Enable application logging for debugging')}
                                
                                {renderSelectField('logLevel', 'Log Level', [
                                    { value: 'error', label: 'Error' },
                                    { value: 'warn', label: 'Warning' },
                                    { value: 'info', label: 'Info' },
                                    { value: 'debug', label: 'Debug' }
                                ], 'Set the minimum log level to record')}
                                
                                {renderNumberField('maxLogSize', 'Max Log Size (MB)', 10, 1000, 'Maximum size of log files before rotation')}
                                {renderNumberField('cacheSize', 'Cache Size (MB)', 100, 2000, 'Maximum size of application cache')}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-full flex" style={{ backgroundColor: '#000000' }}>
            {/* Sidebar Navigation */}
            <div className="w-64 border-r p-6" style={{ borderColor: '#1C1C1E' }}>
                <h1 className="text-2xl font-light tracking-tight mb-8" style={{ color: '#FFFFFF' }}>
                    Settings
                </h1>
                
                <nav className="space-y-2">
                    {settingSections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
                                activeSection === section.id ? 'bg-blue-600' : 'hover:bg-gray-800'
                            }`}
                            style={{
                                backgroundColor: activeSection === section.id ? '#007AFF' : 'transparent',
                                color: activeSection === section.id ? '#FFFFFF' : '#8E8E93'
                            }}
                            onMouseEnter={(e) => {
                                if (activeSection !== section.id) {
                                    e.target.style.backgroundColor = '#1C1C1E';
                                    e.target.style.color = '#E5E5E7';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeSection !== section.id) {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = '#8E8E93';
                                }
                            }}
                        >
                            {section.icon}
                            <span>{section.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="max-w-2xl">
                    {renderSettingsContent()}
                    
                    {/* Save Button */}
                    <div className="mt-8 pt-6 border-t" style={{ borderColor: '#1C1C1E' }}>
                        <button
                            className="px-6 py-2.5 rounded-xl font-medium transition-all duration-150 text-sm"
                            style={{
                                backgroundColor: '#007AFF',
                                color: '#FFFFFF'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#0056CC';
                                e.target.style.transform = 'scale(0.98)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#007AFF';
                                e.target.style.transform = 'scale(1)';
                            }}
                        >
                            Save Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;

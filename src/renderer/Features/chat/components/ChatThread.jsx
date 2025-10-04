import React from 'react';
import ChatMessage from './ChatMessage';

const ChatThread = ({ messages = [] }) => {
    return (
        <div className="h-full flex flex-col" style={{ backgroundColor: '#000000' }}>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
                {messages && messages.length > 0 ? (
                    <div className="space-y-4 max-w-4xl mx-auto">
                        {messages.map((msg, index) => (
                            <ChatMessage
                                key={index}
                                message={msg.text}
                                sender={msg.sender}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center space-y-3">
                            <div 
                                className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center"
                                style={{ backgroundColor: 'rgba(0, 122, 255, 0.1)' }}
                            >
                                <svg 
                                    className="w-6 h-6" 
                                    style={{ color: '#007AFF' }}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div>
                                <h3 
                                    className="text-lg font-medium mb-1"
                                    style={{ color: '#FFFFFF' }}
                                >
                                    No messages yet
                                </h3>
                                <p 
                                    className="text-sm"
                                    style={{ color: '#8E8E93' }}
                                >
                                    Start a conversation with Donna
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t" style={{ borderColor: '#1C1C1E' }}>
                <div className="flex space-x-3">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 rounded-xl border transition-all duration-150 focus:outline-none text-sm"
                        style={{
                            backgroundColor: '#111111',
                            borderColor: '#1C1C1E',
                            color: '#E5E5E7'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#007AFF';
                            e.target.style.boxShadow = '0 0 0 3px rgba(0, 122, 255, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#1C1C1E';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                    <button
                        className="px-4 py-3 rounded-xl transition-all duration-150"
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
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatThread;

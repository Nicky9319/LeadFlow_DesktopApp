import React from 'react';

const ChatMessage = ({ message, sender }) => {
    const isUser = sender === 'user';
    
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div 
                className={`max-w-xl px-4 py-3 rounded-2xl transition-all duration-150 ${
                    isUser 
                        ? 'rounded-br-lg' 
                        : 'rounded-bl-lg'
                }`}
                style={{
                    backgroundColor: isUser ? '#007AFF' : '#111111',
                    color: '#FFFFFF',
                    border: isUser ? 'none' : '1px solid #1C1C1E'
                }}
            >
                <div className="flex items-start space-x-2.5">
                    {!isUser && (
                        <div 
                            className="w-6 h-6 rounded-xl flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5"
                            style={{ 
                                backgroundColor: '#00D09C'
                            }}
                        >
                            D
                        </div>
                    )}
                    <div className="flex-1">
                        <div 
                            className="text-xs font-medium mb-1" 
                            style={{ color: isUser ? 'rgba(255, 255, 255, 0.8)' : '#00D09C' }}
                        >
                            {isUser ? 'You' : 'Donna'}
                        </div>
                        <div 
                            className="text-sm leading-relaxed"
                            style={{ color: isUser ? '#FFFFFF' : '#E5E5E7' }}
                        >
                            {message}
                        </div>
                    </div>
                    {isUser && (
                        <div 
                            className="w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.2)'
                            }}
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;

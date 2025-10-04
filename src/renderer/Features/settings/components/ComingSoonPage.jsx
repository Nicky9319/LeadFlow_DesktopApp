import React from 'react';

const ComingSoonPage = () => {
    return (
        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#000000' }}>
            {/* Coming Soon Content */}
            <div className="text-center space-y-8">
                {/* Big Coming Soon Heading */}
                <h1 
                    className="text-8xl font-bold tracking-tight"
                    style={{ 
                        color: '#007AFF'
                    }}
                >
                    Coming Soon
                </h1>

                {/* Small Description */}
                <p 
                    className="text-lg leading-relaxed max-w-md mx-auto"
                    style={{ 
                        color: '#8E8E93'
                    }}
                >
                    We're building something amazing. Stay tuned for powerful customization options.
                </p>
            </div>
        </div>
    );
};

export default ComingSoonPage;

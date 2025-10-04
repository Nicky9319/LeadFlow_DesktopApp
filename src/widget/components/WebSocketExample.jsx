import React, { useState } from 'react';
import { useWebSocket, useWebSocketEvent } from '../hooks/useWebSocket';

const WebSocketExample = () => {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  
  const {
    isConnected,
    isConnecting,
    lastEvent,
    error,
    socketId,
    emit,
    connect,
    disconnect,
    clearError,
  } = useWebSocket();

  // Listen for 'message' events
  useWebSocketEvent('message', (data) => {
    console.log('📨 Received message:', data);
    setReceivedMessages(prev => [...prev, { ...data, timestamp: new Date().toISOString() }]);
  });

  // Listen for 'notification' events
  useWebSocketEvent('notification', (data) => {
    console.log('🔔 Received notification:', data);
    // Handle notifications
  });

  const handleSendMessage = () => {
    if (message.trim() && isConnected) {
      emit('message', {
        text: message,
        timestamp: new Date().toISOString(),
        sender: 'widget'
      });
      setMessage('');
    }
  };

  const handleConnect = () => {
    connect({
      transports: ['websocket', 'polling'],
      timeout: 20000
    });
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>WebSocket Example Component</h2>
      
      {/* Connection Status */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Connection Status</h3>
        <p>
          Status: 
          <span style={{ 
            color: isConnected ? 'green' : isConnecting ? 'orange' : 'red',
            fontWeight: 'bold',
            marginLeft: '10px'
          }}>
            {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
          </span>
        </p>
        {socketId && <p>Socket ID: {socketId}</p>}
        {error && (
          <p style={{ color: 'red' }}>
            Error: {error}
            <button onClick={clearError} style={{ marginLeft: '10px' }}>Clear</button>
          </p>
        )}
      </div>

      {/* Connection Controls */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Connection Controls</h3>
        <button 
          onClick={handleConnect} 
          disabled={isConnected || isConnecting}
          style={{ marginRight: '10px' }}
        >
          Connect
        </button>
        <button 
          onClick={handleDisconnect} 
          disabled={!isConnected}
        >
          Disconnect
        </button>
      </div>

      {/* Send Message */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Send Message</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1, padding: '8px' }}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!isConnected || !message.trim()}
          >
            Send
          </button>
        </div>
      </div>

      {/* Last Event */}
      {lastEvent && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Last Event</h3>
          <div style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            <strong>Event:</strong> {lastEvent.event}<br/>
            <strong>Data:</strong> {JSON.stringify(lastEvent.data, null, 2)}<br/>
            <strong>Time:</strong> {lastEvent.timestamp}
          </div>
        </div>
      )}

      {/* Received Messages */}
      <div>
        <h3>Received Messages ({receivedMessages.length})</h3>
        <div style={{ 
          maxHeight: '300px', 
          overflowY: 'auto', 
          border: '1px solid #ccc',
          padding: '10px'
        }}>
          {receivedMessages.length === 0 ? (
            <p style={{ color: '#666' }}>No messages received yet...</p>
          ) : (
            receivedMessages.map((msg, index) => (
              <div 
                key={index} 
                style={{ 
                  marginBottom: '10px', 
                  padding: '8px', 
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px'
                }}
              >
                <strong>{msg.sender || 'Unknown'}:</strong> {msg.text}<br/>
                <small style={{ color: '#666' }}>{msg.timestamp}</small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WebSocketExample;

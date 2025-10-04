import React, { useEffect } from 'react';
import { useWebSocket, useWebSocketEvent } from '../hooks/useWebSocket';

const WebSocketLifecycleTest = () => {
  const { 
    isConnected, 
    isConnecting, 
    error, 
    socketId,
    emit 
  } = useWebSocket();

  // Listen for connection events
  useWebSocketEvent('connect', () => {
    console.log('🎉 WebSocket connected!');
  });

  useWebSocketEvent('disconnect', () => {
    console.log('🔌 WebSocket disconnected!');
  });

  // Listen for test events
  useWebSocketEvent('test-response', (data) => {
    console.log('📨 Test response received:', data);
  });

  // Send a test event when connected
  useEffect(() => {
    if (isConnected) {
      console.log('🚀 Sending test event...');
      emit('test-event', { 
        message: 'Hello from lifecycle test!',
        timestamp: new Date().toISOString()
      });
    }
  }, [isConnected, emit]);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 9999,
      backgroundColor: '#1f2937',
      padding: '15px',
      borderRadius: '8px',
      color: 'white',
      fontSize: '12px',
      border: '1px solid #374151',
      minWidth: '200px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
        WebSocket Lifecycle Test
      </h3>
      
      <div style={{ marginBottom: '8px' }}>
        <span style={{ fontWeight: 'bold' }}>Status: </span>
        <span style={{ 
          color: isConnected ? '#10B981' : isConnecting ? '#F59E0B' : '#EF4444',
          fontWeight: 'bold'
        }}>
          {isConnecting ? '🟡 Connecting...' : isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </span>
      </div>

      {socketId && (
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold' }}>Socket ID: </span>
          <span style={{ fontFamily: 'monospace', fontSize: '10px' }}>
            {socketId}
          </span>
        </div>
      )}

      {error && (
        <div style={{ marginBottom: '8px', color: '#EF4444' }}>
          <span style={{ fontWeight: 'bold' }}>Error: </span>
          {error}
        </div>
      )}

      <button 
        onClick={() => {
          if (isConnected) {
            emit('test-event', { 
              message: 'Manual test event',
              timestamp: new Date().toISOString()
            });
            console.log('📤 Manual test event sent');
          }
        }}
        disabled={!isConnected}
        style={{
          width: '100%',
          padding: '8px',
          backgroundColor: isConnected ? '#10B981' : '#6B7280',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isConnected ? 'pointer' : 'not-allowed',
          fontSize: '11px'
        }}
      >
        Send Test Event
      </button>

      <div style={{ 
        marginTop: '10px', 
        padding: '8px', 
        backgroundColor: '#111827', 
        borderRadius: '4px',
        fontSize: '10px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Lifecycle:</div>
        <div>• Mount: Connect to WebSocket</div>
        <div>• Unmount: Disconnect from WebSocket</div>
        <div>• Events: Listen for test events</div>
      </div>
    </div>
  );
};

export default WebSocketLifecycleTest;

# Renderer Services

This directory contains service modules for the renderer window.

## WebSocketManager

A singleton WebSocket manager for handling real-time communication with the WebSocket server.

### Features

- **Singleton Pattern**: Ensures only one WebSocket instance exists across the renderer
- **Automatic Reconnection**: Handles connection drops and reconnection
- **Event Management**: Provides a clean API for event handling
- **Connection Status**: Tracks and provides connection state information

### Usage

```javascript
import webSocketManager from '../services/WebSocketManager';

// Connect to WebSocket server
await webSocketManager.connect();

// Listen for events
webSocketManager.on('message', (data) => {
  console.log('Received message:', data);
});

// Emit events
webSocketManager.emit('send_message', { text: 'Hello!' });

// Check connection status
const status = webSocketManager.getConnectionStatus();
console.log('Connected:', status.isConnected);

// Disconnect
webSocketManager.disconnect();
```

### API Reference

#### Methods

- `connect(url?, options?)`: Connect to WebSocket server
- `disconnect()`: Disconnect from server
- `emit(event, data?, callback?)`: Emit event to server
- `on(event, callback)`: Add event listener
- `off(event, callback)`: Remove event listener
- `getConnectionStatus()`: Get connection status
- `getSocket()`: Get raw socket instance
- `isConnected()`: Check if connected

#### Events

- `connect`: Fired when connection is established
- `disconnect`: Fired when connection is lost
- `reconnect`: Fired when reconnection occurs
- `connect_error`: Fired when connection fails
- `authenticated`: Fired when authentication succeeds

### Configuration

The WebSocket manager connects to `http://localhost:12672` by default. You can override this by passing a URL to the `connect()` method.

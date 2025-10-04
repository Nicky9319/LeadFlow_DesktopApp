import io from 'socket.io-client';

class WebSocketManager {
  constructor() {
    // Singleton pattern - ensure only one instance
    if (WebSocketManager.instance) {
      return WebSocketManager.instance;
    }
    
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();

    this.connectionUrl = 'http://57.159.24.214:4500';

    
    WebSocketManager.instance = this;
  }

  /**
   * Connect to WebSocket server
   * @param {string} url - WebSocket server URL (optional)
   * @param {Object} options - Connection options (optional)
   */
  connect(url = null, options = {}) {
    const connectionUrl = url || this.connectionUrl;
    
    // Disconnect existing socket if present
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }

    console.log('🔌 [Renderer] Connecting to WebSocket server:', connectionUrl);
    
    this.socket = io(connectionUrl, {
      transports: ['websocket', 'polling'],
      auth: {
        token: 'desktop_app'  // Add this authentication token
      },
      ...options
    });

    this.setupEventListeners();
    
    return new Promise((resolve) => {
      this.socket.on('connect', () => {
        console.log('✅ [Renderer] WebSocket connected with ID:', this.socket.id);
        this.isConnected = true;
        this.triggerEvent('connect');
        resolve(true);
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ [Renderer] WebSocket connection error:', error);
        console.error('❌ [Renderer] Error details:', {
          message: error.message,
          description: error.description,
          context: error.context,
          type: error.type,
          stack: error.stack
        });
        
        // Try to get more info about the transport
        if (this.socket) {
          console.log('❌ [Renderer] Socket transport:', this.socket.io.engine.transport.name);
          console.log('❌ [Renderer] Socket ready state:', this.socket.io.engine.readyState);
        }
        
        this.isConnected = false;
        this.triggerEvent('connect_error', error);
        resolve(false);
      });
    });
  }

  /**
   * Setup default event listeners
   */
  setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('disconnect', (reason) => {
      console.log('🔌 [Renderer] WebSocket disconnected:', reason);
      this.isConnected = false;
      this.triggerEvent('disconnect', reason);
    });

    this.socket.on('reconnect', () => {
      console.log('🔄 [Renderer] WebSocket reconnected');
      this.isConnected = true;
      this.triggerEvent('reconnect');
    });

    // Authentication events
    this.socket.on('authenticated', (data) => {
      console.log('✅ [Renderer] WebSocket authenticated:', data);
      this.triggerEvent('authenticated', data);
    });

    // Generic event listener for debugging
    this.socket.onAny((eventName, ...args) => {
      console.log(`📡 [Renderer] WebSocket event received: '${eventName}'`, args);
      this.triggerEvent(eventName, ...args);
    });
  }

  /**
   * Emit event to server
   * @param {string} event - Event name
   * @param {*} data - Event data (optional)
   * @param {Function} callback - Callback function (optional)
   */
  emit(event, data, callback) {
    if (!event) {
      console.warn('[Renderer] WebSocketManager.emit called with undefined event!');
      return;
    }
    
    if (!this.socket) {
      console.warn(`[Renderer] WebSocketManager.emit('${event}') skipped: socket not initialized.`);
      return;
    }
    
    if (!this.isConnected) {
      console.warn(`[Renderer] WebSocketManager.emit('${event}') skipped: socket not connected.`);
      return;
    }

    console.log(`📤 [Renderer] Emitting event: '${event}'`, data || '');
    
    // Handle different emit patterns
    if (typeof data === 'function') {
      // Pattern: emit(event, callback)
      this.socket.emit(event, data);
    } else if (callback && typeof callback === 'function') {
      // Pattern: emit(event, data, callback)
      this.socket.emit(event, data, callback);
    } else {
      // Pattern: emit(event, data) or emit(event)
      this.socket.emit(event, data);
    }
  }

  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  /**
   * Trigger event for all listeners
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  triggerEvent(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`❌ [Renderer] Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    if (this.socket) {
      console.log('🔌 [Renderer] Disconnecting WebSocket...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  /**
   * Get connection status
   * @returns {Object} Connection status information
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id,
      url: this.connectionUrl
    };
  }

  /**
   * Get socket instance
   * @returns {Socket} Socket.io instance
   */
  getSocket() {
    return this.socket;
  }

  /**
   * Check if connected
   * @returns {boolean} Connection status
   */
  isConnected() {
    return this.isConnected;
  }
}

// Export singleton instance
const webSocketManager = new WebSocketManager();
export default webSocketManager;

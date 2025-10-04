// Import the conversation JSON file (keeping as fallback)
import conversationData from '../API Responses/conversation-with-donna.json';

export class ChatHistoryService {
  
  /**
   * Load chat history from the API
   * @returns {Promise<Array>} Array of processed messages
   */
  static async loadChatHistory() {
    try {
      console.log('🔄 Loading chat history from API...');
      
      // Make API call to the specified endpoint
      const response = await fetch('http://localhost:12672/api/get-conversation-with-donna-agent', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any authentication headers if needed
          // 'Authorization': `Bearer ${token}`
        },
        // Add timeout and other fetch options
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ API response received:', data);
      
      if (data.status === 200 && data.data) {
        return this.processChatData(data.data);
      } else {
        throw new Error(`Invalid API response format: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('❌ API request timed out after 10 seconds');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('❌ Network error - server may be down or CORS issue');
      } else {
        console.error('❌ Error loading chat history from API:', error);
      }
      
      // Commented out JSON fallback for now - can be re-enabled if needed
      /*
      console.log('🔄 Falling back to JSON file...');
      
      // Fallback to JSON file if API fails
      try {
        const response = conversationData;
        
        if (response.status === 200 && response.data) {
          console.log('✅ Fallback to JSON file successful');
          return this.processChatData(response.data);
        } else {
          throw new Error('Invalid fallback response format');
        }
      } catch (fallbackError) {
        console.error('❌ Fallback to JSON file also failed:', fallbackError);
        throw fallbackError;
      }
      */
      
      // For now, just throw the original error since fallback is disabled
      throw error;
    }
  }

  /**
   * Process raw chat data into a format suitable for the UI
   * @param {Array} rawData - Raw chat data from the API/JSON
   * @returns {Array} Processed messages
   */
  static processChatData(rawData) {
    const processedMessages = rawData.map((item, index) => {
      const messageData = item.data;
      
      // Better timestamp handling with validation
      let timestamp = messageData.additional_kwargs?.time_stamp;
      
      // Validate the timestamp format
      if (timestamp) {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
          // Invalid timestamp format, use fallback
          timestamp = null;
        }
      }
      
      // If no valid timestamp, create a reasonable fallback based on message order
      if (!timestamp) {
        // Create a timestamp that's a few seconds after the previous message
        // or use current time for the first message
        const baseTime = index === 0 ? Date.now() : Date.now() - (rawData.length - index) * 5000;
        timestamp = new Date(baseTime).toISOString();
      }
      
      return {
        id: messageData.id || `msg-${index}-${Date.now()}`,
        text: messageData.content,
        sender: item.type === 'human' ? 'user' : 'assistant',
        timestamp: timestamp,
        // Add any additional metadata if needed
        metadata: {
          modelName: messageData.response_metadata?.model_name,
          tokenUsage: messageData.response_metadata?.token_usage,
          finishReason: messageData.response_metadata?.finish_reason,
          originalId: messageData.id
        }
      };
    });

    // Add a welcome message if no messages exist
    if (processedMessages.length === 0) {
      processedMessages.unshift({
        id: 'welcome-message',
        text: "Hello! How can I help you today?",
        sender: 'assistant',
        timestamp: new Date().toISOString()
      });
    }

    return processedMessages;
  }

  /**
   * Process a single message for WebSocket handling
   * @param {Object} rawMessage - Raw message from WebSocket
   * @returns {Object} Processed message
   */
  static processSingleMessage(rawMessage) {
    const messageData = rawMessage.data;
    
    // Better timestamp handling with validation
    let timestamp = messageData.additional_kwargs?.time_stamp;
    
    // Validate the timestamp format
    if (timestamp) {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        // Invalid timestamp format, use fallback
        timestamp = null;
      }
    }
    
    // If no valid timestamp, use current time
    if (!timestamp) {
      timestamp = new Date().toISOString();
    }
    
    return {
      id: messageData.id || `msg-${Date.now()}-${Math.random()}`,
      text: messageData.content,
      sender: rawMessage.type === 'human' ? 'user' : 'assistant',
      timestamp: timestamp,
      metadata: {
        modelName: messageData.response_metadata?.model_name,
        tokenUsage: messageData.response_metadata?.token_usage,
        finishReason: messageData.response_metadata?.finish_reason,
        originalId: messageData.id
      }
    };
  }

  /**
   * Alternative API call function for specific conversation IDs
   * @param {string} conversationId - Optional conversation ID
   * @returns {Promise<Array>} Array of processed messages
   */
  static async loadChatHistoryFromAPI(conversationId = null) {
    try {
      console.log('🔄 Loading chat history from API with conversation ID:', conversationId);
      
      const url = conversationId 
        ? `http://localhost:12672/api/get-conversation-with-donna-agent/${conversationId}`
        : 'http://localhost:12672/api/get-conversation-with-donna-agent';
        
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers here when needed
          // 'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API response received:', data);
      return this.processChatData(data.data || data);
    } catch (error) {
      console.error('❌ API Error loading chat history:', error);
      throw error;
    }
  }
}

export default ChatHistoryService;
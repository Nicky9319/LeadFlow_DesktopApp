# Chat Interface - Chat History Feature

This directory contains the chat interface component with chat history loading functionality.

## Files

- `ChatInterface.jsx` - Main chat interface component
- `utils/chatHistoryService.js` - Service for loading chat history
- `API Responses/conversation-with-donna.json` - Sample conversation data
- `README.md` - This documentation file

## Features

### Chat History Loading
- **JSON File Loading**: Currently loads chat history from a local JSON file
- **API Ready**: Service is designed to be easily replaced with API calls
- **Error Handling**: Graceful fallback to default messages on errors
- **Loading States**: Visual feedback during data loading
- **Message Processing**: Converts API/JSON format to UI-friendly format

### Message Display
- **Real-time Updates**: Messages appear with smooth animations
- **Timestamps**: Each message shows when it was sent
- **Sender Identification**: Different styling for user vs assistant messages
- **Auto-scroll**: Automatically scrolls to latest messages
- **Responsive Design**: Adapts to different screen sizes

## Usage

### Current Implementation (JSON File)

The chat interface currently loads conversation history from the JSON file:

```javascript
// In ChatInterface.jsx
import ChatHistoryService from './utils/chatHistoryService';

const loadChatHistory = async () => {
  try {
    const processedMessages = await ChatHistoryService.loadChatHistory();
    dispatch(setMessages(processedMessages));
  } catch (error) {
    console.error('Error loading chat history:', error);
  }
};
```

### Future API Implementation

When you're ready to replace the JSON file with an API call, simply update the service:

```javascript
// In chatHistoryService.js
static async loadChatHistory() {
  try {
    // Replace this line:
    // const response = conversationData;
    
    // With this:
    const response = await fetch('/api/chat-history', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Add authentication
      }
    });
    
    const data = await response.json();
    return this.processChatData(data.data);
  } catch (error) {
    console.error('Error loading chat history:', error);
    throw error;
  }
}
```

## Data Format

### Input Format (JSON/API Response)
```json
{
  "status": 200,
  "message": "Conversation with Donna Agent has been started",
  "data": [
    {
      "type": "human",
      "data": {
        "content": "I would be late tonight inform aarush the same",
        "additional_kwargs": {
          "time_stamp": "2025-08-20T20:21:34.658510"
        },
        "response_metadata": {},
        "type": "human",
        "name": null,
        "id": "992f6314-5193-4629-b5ac-99a6e9964446",
        "example": false
      }
    },
    {
      "type": "ai",
      "data": {
        "content": "I've started the task to inform Aarush that you'll be late tonight...",
        "additional_kwargs": {
          "refusal": null
        },
        "response_metadata": {
          "model_name": "gpt-4o-mini-2024-07-18",
          "token_usage": { ... },
          "finish_reason": "stop"
        },
        "type": "ai",
        "name": null,
        "id": "run--dbc58c80-5244-4b0a-b285-5dacd51b0a17-0",
        "example": false
      }
    }
  ]
}
```

### Output Format (UI Messages)
```javascript
[
  {
    id: "992f6314-5193-4629-b5ac-99a6e9964446",
    text: "I would be late tonight inform aarush the same",
    sender: "user",
    timestamp: "2025-08-20T20:21:34.658510",
    metadata: {
      modelName: null,
      tokenUsage: null,
      finishReason: null,
      originalId: "992f6314-5193-4629-b5ac-99a6e9964446"
    }
  },
  {
    id: "run--dbc58c80-5244-4b0a-b285-5dacd51b0a17-0",
    text: "I've started the task to inform Aarush that you'll be late tonight...",
    sender: "assistant",
    timestamp: "2025-08-20T20:21:34.658510",
    metadata: {
      modelName: "gpt-4o-mini-2024-07-18",
      tokenUsage: { ... },
      finishReason: "stop",
      originalId: "run--dbc58c80-5244-4b0a-b285-5dacd51b0a17-0"
    }
  }
]
```

## API Endpoints (Future)

When implementing the API, you'll need these endpoints:

### GET /api/chat-history
Retrieve chat history for the current user/session.

**Response:**
```json
{
  "status": 200,
  "message": "Chat history retrieved successfully",
  "data": [
    // Array of message objects in the format shown above
  ]
}
```

### GET /api/chat-history/{conversationId}
Retrieve chat history for a specific conversation.



## Error Handling

The system includes comprehensive error handling:

1. **Network Errors**: Fallback to default welcome message
2. **Invalid Data**: Graceful degradation with error logging
3. **Loading States**: Visual feedback during data operations
4. **Retry Mechanism**: Reload button for manual retry

## Customization

### Adding New Message Types
To support new message types, update the `processChatData` method:

```javascript
static processChatData(rawData) {
  return rawData.map((item, index) => {
    const messageData = item.data;
    
    // Add support for new message types
    let sender = 'assistant';
    if (item.type === 'human') sender = 'user';
    else if (item.type === 'system') sender = 'system';
    else if (item.type === 'error') sender = 'error';
    
    return {
      id: messageData.id || `msg-${index}-${Date.now()}`,
      text: messageData.content,
      sender: sender,
      timestamp: messageData.additional_kwargs?.time_stamp || new Date().toISOString(),
      metadata: {
        // Add any additional processing here
      }
    };
  });
}
```

### Styling Customization
Message styling can be customized in the `ChatInterface.jsx` component by modifying the style objects for different sender types.

## Testing

To test the chat history functionality:

1. **Load History**: Click the reload button (↻) in the sidebar
2. **Check Console**: Look for success/error messages in the browser console
3. **Verify Display**: Ensure messages appear with correct styling and timestamps
4. **Test Error Handling**: Temporarily break the JSON file to test error fallbacks

## Migration Checklist

When ready to switch to API calls:

- [ ] Update `ChatHistoryService.loadChatHistory()` to use fetch
- [ ] Add authentication headers
- [ ] Update error handling for network errors
- [ ] Test with real API endpoints
- [ ] Remove JSON file import
- [ ] Update documentation
- [ ] Add loading states for network delays
- [ ] Implement retry logic for failed requests

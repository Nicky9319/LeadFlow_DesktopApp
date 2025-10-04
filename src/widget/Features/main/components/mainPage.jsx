import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { incrementMessageCount, clearMessageCount } from '../../../store/slices/uiVisibilitySlice'
import { incrementNotificationCount, clearNotificationCount } from '../../../store/slices/floatingWidgetSlice'
import { addMessage, setIsTyping, setMessages } from '../../../store/slices/chatStateSlice'
import { themeColors } from '../../common/utils/colors'
import FloatingWidget from '../../floatingWidget/FloatingWidget'
import ActionBar from '../../actionBar/ActionBar'
import ChatInterface from '../../chatInterface/ChatInterface'

import webSocketManager from '../../../services/WebSocketManager';
import ChatHistoryService from '../../chatInterface/utils/chatHistoryService';

// Generic Event Router for handling events from Main Window
const useEventRouter = () => {
    const dispatch = useDispatch();

    // Event handlers for different event types
    const eventHandlers = {
        // Handle messages from main window
        'msgFromDonnaMobile': (payload) => {
            console.log('[Widget] Message from Donna Mobile received via main window:', payload);

            // The expected format is:
            // {
            //   id: <number>,
            //   text: <string>,
            //   sender: 'user',
            //   timestamp: <string>
            // }
            const isValidFormat =
                payload &&
                typeof payload === 'object' &&
                typeof payload.id === 'number' &&
                typeof payload.text === 'string' &&
                typeof payload.sender === 'string' &&
                typeof payload.timestamp === 'string';

            if (isValidFormat) {
                console.log("Processing message from mobile (valid format)");
                webSocketManager.emit('new-user-message', payload.text);
                dispatch(addMessage(payload));
            } else {
                console.warn('[Widget] Message from Donna Mobile is not in the expected format:', payload);
            }
        },

        // Flow: Main Window -> Widget -> API -> Main Window -> Mobile App
        'getConversationWithDonna': async (payload) => {
            console.log('[Widget] getConversationWithDonna EventTriggered received:', payload);
            
            try {
                // Make API call to get chat history
                console.log('[Widget] Fetching chat history from API...');
                const chatHistory = await ChatHistoryService.loadChatHistory();
                
                console.log('[Widget] Chat history loaded successfully:', chatHistory);
                
                // Send the conversation data to main window
                const result = await sendEventToMain('conversationWithDonna', chatHistory);
                
                if (result.success) {
                    console.log('[Widget] conversationWithDonna event sent to main window successfully');
                } else {
                    console.error('[Widget] Failed to send conversationWithDonna to main window:', result.error);
                }
                
            } catch (error) {
                console.error('[Widget] Error in getConversationWithDonna handler:', error);
                
                // Send error response to main window
                const errorPayload = {
                    error: true,
                    message: 'Failed to load chat history',
                    details: error.message
                };
                
                await sendEventToMain('conversationWithDonna', errorPayload);
            }
        },

        'conversationWithDonna': (payload) => {
            console.log('[Widget] conversationWithDonna received:', payload);
            webSocketManager.emit('conversationWithDonna', payload);
            console.log('[Widget] conversationWithDonna sent to Donna Mobile');
        },

        // Default handler for unknown events
        'default': (payload) => {
            console.warn('[Widget] Unknown event received:', payload);
        }
    };

    // Generic event handler that routes to specific handlers
    const handleEventFromMain = async (eventData) => {
        const { eventName, payload } = eventData;
        console.log('[Widget] Event from main window received:', { eventName, payload });

        // Route to specific handler based on event name
        const handler = eventHandlers[eventName] || eventHandlers.default;
        
        try {
            // Handle both async and sync handlers
            const result = await handler(payload);
            return result;
        } catch (error) {
            console.error('[Widget] Error in event handler:', { eventName, error });
            throw error;
        }
    };

    return { handleEventFromMain };
};

// Function to send events to main window
const sendEventToMain = async (eventName, payload) => {
    try {
        if (window.widgetAPI && window.widgetAPI.sendToMain) {
            const result = await window.widgetAPI.sendToMain(eventName, payload);
            console.log('[Widget] Event sent to main window:', { eventName, payload, result });
            return result;
        } else {
            console.warn('[Widget] sendToMain method not available');
            return { success: false, error: 'sendToMain method not available' };
        }
    } catch (error) {
        console.error('[Widget] Error sending event to main window:', error);
        return { success: false, error: error.message };
    }
};

const MainPage = () => {
  const dispatch = useDispatch();
  const { floatingWidgetVisible, actionBarVisible, chatInterfaceVisible, allWidgetsVisible, messageCount } = useSelector(
    (state) => state.uiVisibility
  );
  const notificationCount = useSelector((state) => state.floatingWidget.notificationCount);
  const { messages } = useSelector((state) => state.chatState);
  const { handleEventFromMain } = useEventRouter();

  // Use ref to track current visibility state for WebSocket handler
  const currentVisibilityRef = useRef({
    chatInterfaceVisible: false,
    allWidgetsVisible: true
  });

  // Update ref whenever visibility state changes
  useEffect(() => {
    currentVisibilityRef.current = {
      chatInterfaceVisible,
      allWidgetsVisible
    };
  }, [chatInterfaceVisible, allWidgetsVisible]);

  // Load initial chat history when application starts
  useEffect(() => {
    const loadInitialChatHistory = async () => {
      // Only load if there are no messages in Redux state
      if (messages.length <= 1) { // <= 1 because there might be a default greeting message
        try {
          console.log('Loading initial chat history on app start');
          const processedMessages = await ChatHistoryService.loadChatHistory();
          dispatch(setMessages(processedMessages));
          console.log('Initial chat history loaded successfully');
        } catch (error) {
          console.error('Error loading initial chat history:', error);
        }
      } else {
        console.log('Chat history already exists in Redux state, skipping initial load');
      }
    };

    loadInitialChatHistory();
  }, []); // Empty dependency array - only run once on mount

  // Set up IPC event listener for events from main window
  useEffect(() => {
    const handleEventFromMainIPC = async (event, eventData) => {
      try {
        await handleEventFromMain(eventData);
      } catch (error) {
        console.error('[Widget] Error handling IPC event:', error);
      }
    };

    // Add event listener
    if (window.widgetAPI) {
      window.widgetAPI.onEventFromMain(handleEventFromMainIPC);
      console.log('[Widget] IPC event listener for main window events set up');
    }

    // Cleanup function to remove listener
    return () => {
      if (window.widgetAPI) {
        window.widgetAPI.removeAllListeners('eventFromMain');
        console.log('[Widget] IPC event listener for main window events removed');
      }
    };
  }, [handleEventFromMain]);

  // Local state to handle smooth transitions
  const [localVisibility, setLocalVisibility] = useState({
    floatingWidget: floatingWidgetVisible && allWidgetsVisible,
    actionBar: actionBarVisible && allWidgetsVisible,
    chatInterface: chatInterfaceVisible && allWidgetsVisible
  });

  // Handle click-through based on allWidgetsVisible state
  useEffect(() => {
    if (window.widgetAPI) {
      if (!allWidgetsVisible) {
        // Enable click-through when all widgets are hidden
        window.widgetAPI.enableClickThrough();
      } else {
        // Disable click-through when widgets are visible
        window.widgetAPI.disableClickThrough();
      }
    }
  }, [allWidgetsVisible]);

  // useEffect to handle visibility state changes with smooth transitions
  useEffect(() => {
    const timeoutIds = [];

    // Handle floating widget visibility (considering both individual and global state)
    const shouldShowFloatingWidget = floatingWidgetVisible && allWidgetsVisible;
    if (shouldShowFloatingWidget !== localVisibility.floatingWidget) {
      if (shouldShowFloatingWidget) {
        // Show immediately
        setLocalVisibility(prev => ({ ...prev, floatingWidget: true }));
      } else {
        // Hide with delay for smooth transition
        const timeoutId = setTimeout(() => {
          setLocalVisibility(prev => ({ ...prev, floatingWidget: false }));
        }, 300); // Match the transition duration
        timeoutIds.push(timeoutId);
      }
    }

    // Handle action bar visibility (considering both individual and global state)
    const shouldShowActionBar = actionBarVisible && allWidgetsVisible;
    if (shouldShowActionBar !== localVisibility.actionBar) {
      if (shouldShowActionBar) {
        setLocalVisibility(prev => ({ ...prev, actionBar: true }));
      } else {
        const timeoutId = setTimeout(() => {
          setLocalVisibility(prev => ({ ...prev, actionBar: false }));
        }, 300);
        timeoutIds.push(timeoutId);
      }
    }

    // Handle chat interface visibility (considering both individual and global state)
    const shouldShowChatInterface = chatInterfaceVisible && allWidgetsVisible;
    if (shouldShowChatInterface !== localVisibility.chatInterface) {
      if (shouldShowChatInterface) {
        setLocalVisibility(prev => ({ ...prev, chatInterface: true }));
      } else {
        const timeoutId = setTimeout(() => {
          setLocalVisibility(prev => ({ ...prev, chatInterface: false }));
        }, 300);
        timeoutIds.push(timeoutId);
      }
    }

    // Cleanup timeouts on unmount or state change
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [floatingWidgetVisible, actionBarVisible, chatInterfaceVisible, allWidgetsVisible, localVisibility]);


  const handleDonnaMessage = (messages) => {
    console.log('Donna messages received:', messages);
    
    // Use ref to get the most current visibility state
    const currentState = currentVisibilityRef.current;
    const isChatInterfaceVisible = currentState.chatInterfaceVisible && currentState.allWidgetsVisible;
    
    console.log('Current visibility state:', currentState);
    console.log('Is chat interface visible:', isChatInterfaceVisible);
    
    // If chat interface is not visible, increment notification count
    if (!isChatInterfaceVisible) {
      console.log('Chat interface not visible, incrementing notification count');
      dispatch(incrementNotificationCount());
    } else {
      console.log('Chat interface is visible, no notification needed');
    }
    
    console.log('Current notification count:', notificationCount);
    
    // Since we receive an array of messages, process and add each one to the chat
    messages.forEach(rawMessage => {
      // Process the raw message through the same service used for chat history
      const processedMessage = ChatHistoryService.processSingleMessage(rawMessage);
      console.log('Adding processed message:', processedMessage);
      dispatch(addMessage(processedMessage));
    });


    console.log(messages)
    sendEventToMain('msgFromDonnaDesktop', messages);
    dispatch(setIsTyping(false));
  }
  
  useEffect(() => {
    webSocketManager.connect()
    webSocketManager.on('donna-message', handleDonnaMessage)

    return () => {
      webSocketManager.disconnect()
    }
  },[dispatch])

  // Test function to demonstrate sending events to main window
  const testSendEventToMain = async () => {
    const testPayload = {
      message: "Hello from Widget Window!",
      timestamp: new Date().toISOString(),
      type: "test"
    };
    
    const result = await sendEventToMain('testResponse', testPayload);
    console.log('[Widget] Test event result:', result);
  };

  return (
    <>
      {/* Test Controls for Notification Badge */}
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        zIndex: 9999,
        backgroundColor: themeColors.modalBackground,
        padding: '10px',
        borderRadius: '8px',
        color: themeColors.primaryText,
        fontSize: '12px',
        border: `1px solid ${themeColors.borderColor}`
      }}>
        <div>Notification Count: {notificationCount}</div>
        <button 
          onClick={() => dispatch(incrementNotificationCount())}
          style={{
            margin: '5px',
            padding: '5px 10px',
            backgroundColor: themeColors.primaryBlue,
            color: themeColors.primaryText,
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = themeColors.hoverBackground}
          onMouseLeave={(e) => e.target.style.backgroundColor = themeColors.primaryBlue}
        >
          Add Notification
        </button>
        <button 
          onClick={() => dispatch(clearNotificationCount())}
          style={{
            margin: '5px',
            padding: '5px 10px',
            backgroundColor: themeColors.mutedText,
            color: themeColors.primaryText,
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = themeColors.hoverBackground}
          onMouseLeave={(e) => e.target.style.backgroundColor = themeColors.mutedText}
        >
          Clear
        </button>
      </div>

      {/* Test button for IPC pipeline */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 9999,
        backgroundColor: themeColors.modalBackground,
        padding: '10px',
        borderRadius: '8px',
        color: themeColors.primaryText,
        fontSize: '12px',
        border: `1px solid ${themeColors.borderColor}`
      }}>
        <button 
          onClick={testSendEventToMain}
          style={{
            padding: '5px 10px',
            backgroundColor: themeColors.primaryBlue,
            color: themeColors.primaryText,
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = themeColors.hoverBackground}
          onMouseLeave={(e) => e.target.style.backgroundColor = themeColors.primaryBlue}
        >
          Test IPC to Main
        </button>
      </div>

      {localVisibility.floatingWidget && (
        <div style={{
          opacity: (floatingWidgetVisible && allWidgetsVisible) ? 1 : 0,
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: (floatingWidgetVisible && allWidgetsVisible) ? 'scale(1)' : 'scale(0.95)',
          transitionProperty: 'opacity, transform',
          pointerEvents: (floatingWidgetVisible && allWidgetsVisible) ? 'auto' : 'none'
        }}>
          <FloatingWidget />
        </div>
      )}
      
      {localVisibility.actionBar && (
        <div style={{
          opacity: (actionBarVisible && allWidgetsVisible) ? 1 : 0,
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: (actionBarVisible && allWidgetsVisible) ? 'translateY(0)' : 'translateY(-10px)',
          transitionProperty: 'opacity, transform',
          pointerEvents: (actionBarVisible && allWidgetsVisible) ? 'auto' : 'none'
        }}>
          <ActionBar />
        </div>
      )}
      
      {localVisibility.chatInterface && (
        <div style={{
          opacity: (chatInterfaceVisible && allWidgetsVisible) ? 1 : 0,
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: (chatInterfaceVisible && allWidgetsVisible) ? 'scale(1)' : 'scale(0.98)',
          transitionProperty: 'opacity, transform',
          pointerEvents: (chatInterfaceVisible && allWidgetsVisible) ? 'auto' : 'none'
        }}>
          <ChatInterface />
        </div>
      )}
    </>
  );
};

export default MainPage
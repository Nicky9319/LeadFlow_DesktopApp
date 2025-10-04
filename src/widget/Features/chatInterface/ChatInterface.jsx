import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HoverComponent from '../common/components/HoverComponent';
import { themeColors } from '../common/utils/colors';
import { setChatInterfaceVisible } from '../../store/slices/uiVisibilitySlice';
import { 
  addMessage, 
  setIsExpanded, 
  setPosition, 
  setIsTyping,
  setMessages
} from '../../store/slices/chatStateSlice';
import { clearNotificationCount } from '../../store/slices/floatingWidgetSlice';

// Import the chat history service
import ChatHistoryService from './utils/chatHistoryService';
// Import WebSocket manager
import webSocketManager from '../../services/WebSocketManager';


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

const ChatInterface = () => {
  const dispatch = useDispatch();
  
  // Get state from Redux
  const { messages, isExpanded, position, isTyping } = useSelector(state => state.chatState);
  
  // Local state for UI interactions
  const [inputValue, setInputValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  // Function to load chat history from JSON file
  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true);
      
      // Use the chat history service to load data
      const processedMessages = await ChatHistoryService.loadChatHistory();
      
      // Dispatch the processed messages to Redux
      dispatch(setMessages(processedMessages));
      
      console.log('Chat history reloaded successfully');
    } catch (error) {
      console.error('❌ Error loading chat history:', error);
      // Fallback to default message
      dispatch(setMessages([{
        id: 'error-message',
        text: "Hello! How can I help you today?",
        sender: 'assistant',
        timestamp: new Date().toISOString()
      }]));
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Reset notification count when chat interface mounts
  useEffect(() => {
    console.log('Chat interface mounted, clearing notification count');
    dispatch(clearNotificationCount());
  }, []); // Empty dependency array - only run once on mount

  // Clear notification count when chat interface becomes visible
  const { chatInterfaceVisible, allWidgetsVisible } = useSelector(state => state.uiVisibility);
  const isChatInterfaceVisible = chatInterfaceVisible && allWidgetsVisible;
  const notificationCount = useSelector((state) => state.floatingWidget.notificationCount);
  
  useEffect(() => {
    if (isChatInterfaceVisible) {
      // Reset notification count when chat interface becomes visible
      console.log('Chat interface visible, clearing notification count');
      console.log('Notification count before clearing:', notificationCount);
      dispatch(clearNotificationCount());
    }
  }, [isChatInterfaceVisible, dispatch, notificationCount]);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = Math.min(Math.max(scrollHeight, 28), 120); // Min 28px, Max 120px
      textareaRef.current.style.height = newHeight + 'px';
    }
  }, [inputValue]);

  // Drag functionality
  const handleMouseDown = (e) => {
    if (e.target.closest('textarea')) {
      return; // Don't start dragging if clicking on textarea
    }
    
    setIsDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    // Calculate widget dimensions using the same values as the component
    const chatWidth = isExpanded ? 700 : 350;
    const sidebarWidth = 40;
    const totalWidth = chatWidth + sidebarWidth;
    const widgetHeight = isExpanded ? 650 : 500;
    
    // Keep widget within viewport bounds with consistent behavior
    const maxX = window.innerWidth - totalWidth;
    const maxY = window.innerHeight - widgetHeight;
    
    // Calculate new position based on mouse position and drag offset
    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;
    
    // Clamp position to viewport bounds - this ensures consistent behavior for all edges
    const clampedX = Math.max(0, Math.min(newX, maxX));
    const clampedY = Math.max(0, Math.min(newY, maxY));
    
    // Only update position if it's within bounds or if we're at the edge
    // This prevents snapping back when the mouse goes outside the window
    if (newX >= 0 && newX <= maxX && newY >= 0 && newY <= maxY) {
      dispatch(setPosition({
        x: newX,
        y: newY
      }));
    } else {
      // If we're at the edge, stay at the clamped position
      dispatch(setPosition({
        x: clampedX,
        y: clampedY
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: Date.now(),
        text: inputValue.trim(),
        sender: 'user',
        timestamp: new Date().toISOString()
      };

      sendEventToMain('msgFromDonnaDesktop', [newMessage]);
      dispatch(addMessage(newMessage));
      setInputValue('');
      
      // Emit new-user-message event via WebSocket
      webSocketManager.emit('new-user-message', inputValue.trim());

      
      // Set isTyping to true
      dispatch(setIsTyping(true));
    }
  };

  const handleClose = () => {
    dispatch(setChatInterfaceVisible(false));
  };

  const handleExpand = () => {
    dispatch(setIsExpanded(!isExpanded));
  };

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid timestamp received:', timestamp);
        return '--:--'; // Return a placeholder instead of "Invalid Date"
      }
      
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } catch (error) {
      console.error('Error formatting timestamp:', error, timestamp);
      return '--:--'; // Return a placeholder on any error
    }
  };

  const sidebarWidth = 40;
  const chatWidth = isExpanded ? 700 : 350;
  const chatHeight = isExpanded ? '650px' : '500px'; // Reduced height
  const messagesHeight = isExpanded ? '550px' : '400px'; // Reduced messages area
  const totalWidth = chatWidth + sidebarWidth;

  return (
    <HoverComponent>
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          top: position.y || '120px',
          left: position.x || `calc(50vw - ${totalWidth / 2}px)`,
          background: themeColors.primaryBackground,
          border: `1px solid ${themeColors.borderColor}`,
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          zIndex: 10003,
          maxHeight: chatHeight,
          width: `${totalWidth}px`,
          overflow: 'hidden',
          animation: 'slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          cursor: isDragging ? 'grabbing' : 'default'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Messages Area with Sidebar */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          height: messagesHeight
        }}>
          {/* Vertical Sidebar */}
          <div style={{
            width: sidebarWidth,
            background: themeColors.primaryBackground,
            borderRight: `1px solid ${themeColors.borderColor}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '8px 0',
            gap: '0px'
          }}>
            {/* Close Button */}
            <button
              onClick={handleClose}
                             style={{
                 width: '24px',
                 height: '24px',
                 borderRadius: '6px',
                 border: 'none',
                 background: themeColors.secondaryBackground,
                 color: themeColors.primaryText,
                 cursor: 'pointer',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 transition: 'all 0.2s',
                 fontSize: '10px',
                 marginBottom: '4px'
               }}
               onMouseEnter={(e) => {
                 e.target.style.background = themeColors.errorRed;
                 e.target.style.transform = 'scale(1.1)';
               }}
               onMouseLeave={(e) => {
                 e.target.style.background = themeColors.secondaryBackground;
                 e.target.style.transform = 'scale(1)';
               }}
              title="Close"
            >
              ×
            </button>

            {/* Expand Button */}
            <button
              onClick={handleExpand}
                             style={{
                 width: '24px',
                 height: '24px',
                 borderRadius: '6px',
                 border: 'none',
                 background: themeColors.secondaryBackground,
                 color: themeColors.primaryText,
                 cursor: 'pointer',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 transition: 'all 0.2s',
                 fontSize: '10px'
               }}
               onMouseEnter={(e) => {
                 e.target.style.background = themeColors.primaryBlue;
                 e.target.style.transform = 'scale(1.1)';
               }}
               onMouseLeave={(e) => {
                 e.target.style.background = themeColors.secondaryBackground;
                 e.target.style.transform = 'scale(1)';
               }}
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? '−' : '+'}
            </button>

            {/* Reload History Button */}
            <button
              onClick={loadChatHistory}
              disabled={isLoadingHistory}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                border: 'none',
                background: isLoadingHistory ? themeColors.mutedText : themeColors.secondaryBackground,
                color: themeColors.primaryText,
                cursor: isLoadingHistory ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                fontSize: '10px',
                marginTop: '4px'
              }}
              onMouseEnter={(e) => {
                if (!isLoadingHistory) {
                  e.target.style.background = themeColors.primaryBlue;
                  e.target.style.transform = 'scale(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoadingHistory) {
                  e.target.style.background = themeColors.secondaryBackground;
                  e.target.style.transform = 'scale(1)';
                }
              }}
              title={isLoadingHistory ? 'Loading...' : 'Reload History'}
            >
              {isLoadingHistory ? '⟳' : '↻'}
            </button>

          </div>

          {/* Messages Container */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: themeColors.primaryBackground
          }}>
            {/* Messages Area */}
            <div
              className="messages-container"
              style={{
                height: messagesHeight,
                overflowY: 'auto',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                scrollbarWidth: 'thin',
                scrollbarColor: `${themeColors.borderColor} ${themeColors.primaryBackground}`,
                background: themeColors.primaryBackground
              }}
            >
                             <style>
                 {`
                   @keyframes spin {
                     0% { transform: rotate(0deg); }
                     100% { transform: rotate(360deg); }
                   }
                   
                   .messages-container::-webkit-scrollbar {
                     width: 6px;
                   }
                   .messages-container::-webkit-scrollbar-track {
                     background: ${themeColors.primaryBackground};
                     border-radius: 3px;
                   }
                   .messages-container::-webkit-scrollbar-thumb {
                     background: ${themeColors.borderColor};
                     border-radius: 3px;
                     transition: background 0.2s;
                   }
                   .messages-container::-webkit-scrollbar-thumb:hover {
                     background: ${themeColors.tertiaryBackground};
                   }
                   
                   .custom-textarea::-webkit-scrollbar {
                     width: 4px;
                   }
                   .custom-textarea::-webkit-scrollbar-track {
                     background: ${themeColors.primaryBackground};
                     border-radius: 2px;
                   }
                   .custom-textarea::-webkit-scrollbar-thumb {
                     background: ${themeColors.borderColor};
                     border-radius: 2px;
                     transition: background 0.2s;
                   }
                   .custom-textarea::-webkit-scrollbar-thumb:hover {
                     background: ${themeColors.tertiaryBackground};
                   }
                   .custom-textarea::-webkit-scrollbar-corner {
                     background: ${themeColors.primaryBackground};
                   }
                 `}
               </style>

              {/* Loading indicator */}
              {isLoadingHistory && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  padding: '20px',
                  color: themeColors.mutedText,
                  fontSize: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: `2px solid ${themeColors.borderColor}`,
                      borderTop: `2px solid ${themeColors.primaryBlue}`,
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Loading chat history...
                  </div>
                </div>
              )}

              {/* Messages */}
              {!isLoadingHistory && messages.map((message) => (
                <div 
                  key={message.id}
                  style={{ 
                    display: 'flex', 
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start', 
                    animation: 'messageSlideIn 0.3s ease-out' 
                  }}
                >
                                     <div style={{
                     maxWidth: '80%',
                     padding: '8px 12px',
                     borderRadius: '12px',
                     background: message.sender === 'user' ? themeColors.primaryBlue : themeColors.secondaryBackground,
                     color: themeColors.primaryText,
                     fontSize: '14px',
                     lineHeight: '1.4',
                     wordWrap: 'break-word'
                   }}>
                     {message.text}
                     <div style={{
                       fontSize: '11px',
                       opacity: 0.7,
                       marginTop: '4px',
                       textAlign: message.sender === 'user' ? 'right' : 'left'
                     }}>
                       {formatTime(message.timestamp)}
                     </div>
                   </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'flex-start', 
                  animation: 'messageSlideIn 0.3s ease-out' 
                }}>
                                     <div style={{
                     maxWidth: '80%',
                     padding: '8px 12px',
                     borderRadius: '12px',
                     background: themeColors.secondaryBackground,
                     color: themeColors.primaryText,
                     fontSize: '14px',
                     lineHeight: '1.4'
                   }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                       <div style={{ fontSize: '11px', opacity: 0.7 }}>Assistant is typing</div>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        <div style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: themeColors.primaryText,
                          opacity: 0.7,
                          animation: 'typing 1.4s infinite'
                        }} />
                        <div style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: themeColors.primaryText,
                          opacity: 0.7,
                          animation: 'typing 1.4s infinite 0.2s'
                        }} />
                        <div style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: themeColors.primaryText,
                          opacity: 0.7,
                          animation: 'typing 1.4s infinite 0.4s'
                        }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

                 {/* Input Area */}
         <div style={{
           padding: '8px 12px',
           borderTop: `1px solid ${themeColors.borderColor}`,
           background: themeColors.primaryBackground
         }}>
           <textarea
             ref={textareaRef}
             value={inputValue}
             onChange={handleInputChange}
             onKeyPress={handleKeyPress}
             placeholder="Type your message... (Press Enter to send)"
             style={{
               width: '100%',
               minHeight: '28px',
               maxHeight: '120px',
               padding: '6px 10px',
               border: `1px solid ${inputValue.trim() ? themeColors.primaryBlue : themeColors.borderColor}`,
               borderRadius: '14px',
               fontSize: '13px',
               resize: 'none',
               outline: 'none',
               fontFamily: 'inherit',
               background: themeColors.secondaryBackground,
               color: themeColors.primaryText,
               transition: 'all 0.2s ease',
               lineHeight: '1.3',
               scrollbarWidth: 'thin',
               scrollbarColor: `${themeColors.borderColor} ${themeColors.secondaryBackground}`
             }}
             className="custom-textarea"
           />
         </div>
      </div>
    </HoverComponent>
  );
};

export default ChatInterface;
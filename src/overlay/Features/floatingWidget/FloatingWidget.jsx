import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import HoverComponent from '../common/components/HoverComponent';
import { themeColors } from '../common/utils/colors';
import { 
  toggleAllWidgets, 
  clearMessageCount
} from '../../store/slices/uiVisibilitySlice';
import { setPosition } from '../../store/slices/floatingWidgetSlice';

const FloatingWidget = () => {
  const messageCount = useSelector((state) => state.uiVisibility.messageCount);
  const position = useSelector((state) => state.floatingWidget.position);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const [screenshotAnimation, setScreenshotAnimation] = useState('idle'); // 'idle', 'processing', 'success'
  const dispatch = useDispatch();

  // Debug: Log when component mounts
  useEffect(() => {
    console.log('LeadFlow FloatingWidget mounted');
  }, []);

  // Screenshot event listener
  useEffect(() => {
    const onScreenshotEvent = (event, data) => {
      console.log('FloatingWidget received screenshot event:', data);
      try {
        if (!data) return;
        const { eventName, payload } = data;
        
        if (eventName === 'screenshot-processing') {
          console.log('FloatingWidget: Screenshot processing - starting animation');
          setScreenshotAnimation('processing');
                } else if (eventName === 'screenshot-taken' && payload && payload.success) {
          console.log('FloatingWidget: Global screenshot taken successfully');
          // Just reset the animation state without showing success animation
          setScreenshotAnimation(null);
        } else if (eventName === 'screenshot-error') {
          console.log('FloatingWidget: Screenshot error - reset animation');
          setScreenshotAnimation('idle');
        }
      } catch (err) {
        console.error('FloatingWidget: Error handling screenshot event:', err);
      }
    };

    // Setup IPC listeners for screenshot events
    if (window && window.electronAPI && window.electronAPI.onEventFromMain) {
      console.log('FloatingWidget: Setting up screenshot event listener via electronAPI');
      window.electronAPI.onEventFromMain(onScreenshotEvent);
    } else if (window && window.widgetAPI && window.widgetAPI.onEventFromMain) {
      console.log('FloatingWidget: Setting up screenshot event listener via widgetAPI');
      window.widgetAPI.onEventFromMain(onScreenshotEvent);
    }

    // Cleanup
    return () => {
      if (window && window.electronAPI && window.electronAPI.removeAllListeners) {
        try {
          window.electronAPI.removeAllListeners('eventFromMain');
        } catch (e) {
          console.warn('FloatingWidget: Error cleaning up electronAPI listeners:', e);
        }
      }
      if (window && window.widgetAPI && window.widgetAPI.removeAllListeners) {
        try {
          window.widgetAPI.removeAllListeners('eventFromMain');
        } catch (e) {
          console.warn('FloatingWidget: Error cleaning up widgetAPI listeners:', e);
        }
      }
    };
  }, []);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Shift+Space to trigger widget click
      if (e.ctrlKey && e.shiftKey && e.code === 'Space') {
        e.preventDefault();
        // Add a brief flash effect for keyboard shortcut
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 200);
        handleWidgetClick(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleWidgetClick = (e) => {
    // Prevent click if we just finished dragging
    if (hasDragged) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    // Add click animation
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);
    
    // Widget click functionality can be added here if needed
    console.log('Floating widget clicked');
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Drag functionality
  const handleMouseDown = (e) => {
    // Only start dragging if clicking on the widget itself, not on buttons or other elements
    if (e.target.closest('button') || e.target.closest('svg')) {
      return;
    }
    
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    // Set hasDragged to true when mouse moves during drag
    setHasDragged(true);
    
    // Calculate widget dimensions
    const widgetWidth = 50;
    const widgetHeight = 50;
    
    // Keep widget within viewport bounds
    const maxX = window.innerWidth - widgetWidth;
    const maxY = window.innerHeight - widgetHeight;
    
    // Calculate new position based on mouse position and drag offset
    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;
    
    // Clamp position to viewport bounds
    const clampedX = Math.max(0, Math.min(newX, maxX));
    const clampedY = Math.max(0, Math.min(newY, maxY));
    
    // Only update position if it's within bounds
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
    // Reset hasDragged after a short delay to allow click to be processed
    setTimeout(() => {
      setHasDragged(false);
    }, 10);
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

  return (
    <>
      {/* Widget always visible at a fixed position */}
      <div style={{
        position: 'absolute',
        left: position.x || 1200,
        top: position.y || 20,
        width: '50px',
        height: '50px',
        pointerEvents: 'auto',
        cursor: isDragging ? 'grabbing' : 'pointer',
        zIndex: 2147483647 // Maximum possible z-index
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Black outer cover wrapped in HoverComponent */}
          <HoverComponent onClick={handleWidgetClick}>
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: screenshotAnimation === 'processing' ? '#EF4444' + '30' : 
                               screenshotAnimation === 'success' ? '#10B981' + '30' : 
                               isClicked ? themeColors.primaryBlue + '20' : themeColors.primaryBackground,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: screenshotAnimation === 'processing' 
                  ? '0 4px 20px rgba(239, 68, 68, 0.6), 0 0 40px rgba(239, 68, 68, 0.4)' 
                  : screenshotAnimation === 'success' 
                    ? '0 4px 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.4)' 
                    : isClicked 
                      ? '0 2px 8px rgba(0, 0, 0, 0.4), 0 0 20px rgba(59, 130, 246, 0.4)' 
                      : isHovered 
                        ? '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(59, 130, 246, 0.3)' 
                        : '0 2px 10px rgba(0, 0, 0, 0.3)',
                border: `1px solid ${screenshotAnimation === 'processing' ? 'rgba(239, 68, 68, 0.7)' : 
                                    screenshotAnimation === 'success' ? 'rgba(16, 185, 129, 0.7)' : 
                                    isClicked ? 'rgba(59, 130, 246, 0.7)' : 
                                    isHovered ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.15)'}`,
                outline: `1px solid ${screenshotAnimation === 'processing' ? 'rgba(239, 68, 68, 0.5)' : 
                                     screenshotAnimation === 'success' ? 'rgba(16, 185, 129, 0.5)' : 
                                     isClicked ? 'rgba(59, 130, 246, 0.5)' : 
                                     isHovered ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                outlineOffset: '1px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: screenshotAnimation === 'processing' ? 'scale(1.2)' : 
                          screenshotAnimation === 'success' ? 'scale(1.15)' : 
                          isClicked ? 'scale(0.9)' : 
                          isHovered ? 'scale(1.1)' : 'scale(1)',
                pointerEvents: 'auto',
                animation: screenshotAnimation === 'processing' ? 'pulse 0.8s ease-in-out infinite' : 
                          screenshotAnimation === 'success' ? 'bounce 0.6s ease-in-out' : 'none'
              }}
            >
              {/* Blue inner circle */}
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: screenshotAnimation === 'processing' ? '#EF4444' : 
                                 screenshotAnimation === 'success' ? '#10B981' : 
                                 themeColors.primaryBlue,
                  borderRadius: '50%',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: screenshotAnimation === 'processing'
                    ? '0 0 35px #EF4444CC, 0 0 60px #EF444499, 0 0 85px #EF444466'
                    : screenshotAnimation === 'success'
                      ? '0 0 35px #10B981CC, 0 0 60px #10B98199, 0 0 85px #10B98166'
                      : isClicked
                        ? `0 0 35px ${themeColors.primaryBlue}CC, 0 0 60px ${themeColors.primaryBlue}99, 0 0 85px ${themeColors.primaryBlue}66`
                        : isHovered 
                          ? `0 0 25px ${themeColors.primaryBlue}99, 0 0 50px ${themeColors.primaryBlue}66, 0 0 75px ${themeColors.primaryBlue}33`
                          : `0 0 15px ${themeColors.primaryBlue}66, 0 0 30px ${themeColors.primaryBlue}33, 0 0 45px ${themeColors.primaryBlue}1A`,
                  filter: 'blur(1px)',
                  pointerEvents: 'none',
                  position: 'relative',
                  animation: screenshotAnimation === 'processing' ? 'pulse 0.5s ease-in-out infinite' : 
                            screenshotAnimation === 'success' ? 'heartbeatColor 0.8s ease-in-out 3' : 
                            'heartbeatColor 2s ease-in-out infinite'
                }}
              >
                {/* Additional glow layer for enhanced heartbeat effect */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    left: '-2px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: screenshotAnimation === 'processing' 
                      ? 'radial-gradient(circle, #EF444420 0%, #EF444408 70%, transparent 100%)'
                      : `radial-gradient(circle, ${themeColors.primaryBlue}25 0%, ${themeColors.primaryBlue}08 70%, transparent 100%)`,
                    filter: 'blur(2px)',
                    animation: screenshotAnimation === 'processing' ? 'pulse 0.8s ease-in-out infinite' : 
                              'heartbeat 2s ease-in-out infinite',
                    animationDelay: screenshotAnimation === 'processing' ? '0s' : '0.5s',
                    pointerEvents: 'none',
                    zIndex: 0
                  }}
                />
              </div>
            </div>
          </HoverComponent>
        </div>
      </div>

      {/* Hover text only visible when hovering over the widget */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          left: position.x || 1200,
          top: (position.y || 20) + 60,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 2147483646, // Just below the widget
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          LeadFlow Widget
          <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>
            Ctrl+Shift+Space
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingWidget;


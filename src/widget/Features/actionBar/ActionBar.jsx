import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import HoverComponent from '../common/components/HoverComponent';
import { themeColors } from '../common/utils/colors';
import { setChatInterfaceVisible } from '../../store/slices/uiVisibilitySlice';

const ActionBar = () => {
  const dispatch = useDispatch();
  const chatInterfaceVisible = useSelector((state) => state.uiVisibility.chatInterfaceVisible);
  const floatingWidgetPosition = useSelector((state) => state.floatingWidget.position);
  
  const position = floatingWidgetPosition || { x: 1200, y: 20 };
  const isNearRightEdge = position.x > window.innerWidth - 200;
  const barWidth = 140; // Much smaller width
  const safeLeft = isNearRightEdge ?
    Math.max(10, position.x - barWidth - 20) :
    Math.min(window.innerWidth - barWidth - 10, position.x + 60);

  const handleShowMessages = () => {
    if (!chatInterfaceVisible) {
      dispatch(setChatInterfaceVisible(true));
      // Chat interface opened from action bar
    }
  };

  return (
    <HoverComponent>
      <div style={{
        position: 'fixed',
        left: safeLeft,
        top: position.y + 15,
        transform: 'translateX(0)',
        opacity: 1,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 10002,
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'auto',
        width: 'fit-content',
        height: 'fit-content'
      }}>
        {/* Arrow pointing to widget */}
        <div style={{
          width: 0,
          height: 0,
          borderTop: '5px solid transparent',
          borderBottom: '5px solid transparent',
          borderRight: isNearRightEdge ? 'none' : '5px solid rgba(0, 0, 0, 0.9)',
          borderLeft: isNearRightEdge ? '5px solid rgba(0, 0, 0, 0.9)' : 'none',
          marginRight: isNearRightEdge ? '0' : '-1px',
          marginLeft: isNearRightEdge ? '-1px' : '0',
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
        }} />

        {/* Compact bar background */}
        <div style={{
          background: themeColors.primaryBackground,
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.4)',
          border: `1px solid ${themeColors.borderColor}`,
          minWidth: '120px',
          maxWidth: '140px'
        }}>
          {/* Show Messages Button */}
          <button 
            onClick={handleShowMessages}
            disabled={chatInterfaceVisible}
            style={{
              background: chatInterfaceVisible ? themeColors.tertiaryBackground : themeColors.primaryBlue,
              border: 'none',
              borderRadius: '16px',
              padding: '6px 12px',
              color: themeColors.primaryText,
              fontSize: '11px',
              fontWeight: '600',
              cursor: chatInterfaceVisible ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: chatInterfaceVisible 
                ? 'none' 
                : '0 2px 8px rgba(0, 122, 255, 0.3)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: chatInterfaceVisible ? 0.6 : 1,
              width: '100%',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              if (!chatInterfaceVisible) {
                e.target.style.background = '#0056CC'; // Darker blue for better hover effect
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 122, 255, 0.4)';
                e.target.style.border = '1px solid rgba(255, 255, 255, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!chatInterfaceVisible) {
                e.target.style.background = themeColors.primaryBlue;
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 2px 8px rgba(0, 122, 255, 0.3)';
                e.target.style.border = '1px solid transparent';
              }
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {chatInterfaceVisible ? 'Open' : 'Messages'}
          </button>
        </div>
      </div>
    </HoverComponent>
  );
};

export default ActionBar;

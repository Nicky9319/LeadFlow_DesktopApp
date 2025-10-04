import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import HoverComponent from '../common/components/HoverComponent';
import { themeColors } from '../common/utils/colors';
import { setChatInterfaceVisible } from '../../store/slices/uiVisibilitySlice';
import { setBuckets } from '../../store/slices/bucketsSlice';
import { getAllBuckets } from '../../../services/bucketsServices';

const ActionBar = () => {
  const dispatch = useDispatch();
  const chatInterfaceVisible = useSelector((state) => state.uiVisibility.chatInterfaceVisible);
  const floatingWidgetPosition = useSelector((state) => state.floatingWidget.position);
  const buckets = useSelector((state) => state.buckets.buckets);
  
  const [selectedOption, setSelectedOption] = useState('Select Option');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const position = floatingWidgetPosition || { x: 1200, y: 20 };
  const isNearRightEdge = position.x > window.innerWidth - 300;
  const barWidth = 200;
  const safeLeft = isNearRightEdge ?
    Math.max(10, position.x - barWidth - 20) :
    Math.min(window.innerWidth - barWidth - 10, position.x + 60);

  const dropdownOptions = buckets.map(bucket => bucket.name);
  
  // Debug logging
  console.log('ActionBar current buckets:', buckets, 'dropdownOptions:', dropdownOptions);

  useEffect(() => {
    const loadBuckets = async () => {
      try {
        const fetchedBuckets = await getAllBuckets();
        console.log('ActionBar loaded buckets:', fetchedBuckets);
        dispatch(setBuckets(fetchedBuckets));
      } catch (error) {
        console.error('Error loading buckets in ActionBar:', error);
      }
    };
    loadBuckets();
    
    // listen for updates from main window - payload comes as { eventName, payload }
    const onBucketsUpdated = (event, data) => {
      console.log('ActionBar received IPC event:', event, data);
      try {
        if (!data) {
          console.warn('ActionBar: No data in IPC event');
          return;
        }
        const { eventName, payload } = data;
        console.log('ActionBar: Parsed eventName:', eventName, 'payload:', payload);
        if (eventName === 'buckets-updated' && payload && Array.isArray(payload)) {
          console.log('ActionBar: Updating buckets with:', payload);
          dispatch(setBuckets(payload));
        } else {
          console.log('ActionBar: Ignoring event:', eventName);
        }
      } catch (err) {
        console.error('Error applying buckets-updated payload:', err);
      }
    };
    
    // Try both electronAPI and widgetAPI
    if (window && window.electronAPI && window.electronAPI.onEventFromMain) {
      console.log('ActionBar: Setting up IPC listener via electronAPI');
      window.electronAPI.onEventFromMain(onBucketsUpdated);
    } else if (window && window.widgetAPI && window.widgetAPI.onEventFromMain) {
      console.log('ActionBar: Setting up IPC listener via widgetAPI');
      window.widgetAPI.onEventFromMain(onBucketsUpdated);
    } else {
      console.warn('ActionBar: No IPC API available. electronAPI:', !!window.electronAPI, 'widgetAPI:', !!window.widgetAPI);
    }
    
    // Cleanup function
    return () => {
      if (window && window.electronAPI && window.electronAPI.removeAllListeners) {
        try { 
          console.log('ActionBar: Cleaning up electronAPI IPC listeners');
          window.electronAPI.removeAllListeners('eventFromMain'); 
        } catch (e) {
          console.warn('ActionBar: Error cleaning up electronAPI listeners:', e);
        }
      }
      if (window && window.widgetAPI && window.widgetAPI.removeAllListeners) {
        try { 
          console.log('ActionBar: Cleaning up widgetAPI IPC listeners');
          window.widgetAPI.removeAllListeners('eventFromMain'); 
        } catch (e) {
          console.warn('ActionBar: Error cleaning up widgetAPI listeners:', e);
        }
      }
    };
  }, [dispatch]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const handleActionButton = () => {
    console.log(`Action button clicked with option: ${selectedOption}`);
    // Add your action logic here based on selected option
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

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

        {/* Action bar background */}
        <div style={{
          background: themeColors.primaryBackground,
          backdropFilter: 'blur(10px)',
          borderRadius: '8px',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.4)',
          border: `1px solid ${themeColors.borderColor}`,
          minWidth: '180px',
          position: 'relative'
        }}>
          {/* Dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative', flex: 1 }}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                background: themeColors.surfaceBackground,
                border: `1px solid ${themeColors.borderColor}`,
                borderRadius: '6px',
                padding: '8px 12px',
                color: themeColors.primaryText,
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                transition: 'all 0.2s ease',
                minWidth: '120px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = themeColors.hoverBackground;
                e.target.style.borderColor = themeColors.primaryBlue;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = themeColors.surfaceBackground;
                e.target.style.borderColor = themeColors.borderColor;
              }}
            >
              <span>{selectedOption}</span>
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                style={{
                  transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }}
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: themeColors.surfaceBackground,
                border: `1px solid ${themeColors.borderColor}`,
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                zIndex: 10003,
                marginTop: '4px',
                overflow: 'hidden'
              }}>
                {dropdownOptions.map((option, index) => {
                  const bucket = buckets.find(b => b.name === option);
                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(option)}
                      title={bucket ? `Bucket ID: ${bucket.id}` : ''}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: '8px 12px',
                        color: themeColors.primaryText,
                        fontSize: '12px',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                        transition: 'background 0.2s ease',
                        borderBottom: index < dropdownOptions.length - 1 ? `1px solid ${themeColors.borderColor}` : 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = themeColors.hoverBackground;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleActionButton}
            style={{
              background: themeColors.primaryBlue,
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              color: themeColors.primaryText,
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#0056CC';
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 122, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = themeColors.primaryBlue;
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Add
          </button>
        </div>
      </div>
    </HoverComponent>
  );
};

export default ActionBar;

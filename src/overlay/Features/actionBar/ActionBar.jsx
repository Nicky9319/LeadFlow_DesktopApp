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
  const [screenshotStatus, setScreenshotStatus] = useState('ready'); // 'ready', 'processing', 'success'
  const dropdownRef = useRef(null);
  const [globalShortcutFeedback, setGlobalShortcutFeedback] = useState(false);
  
  const position = floatingWidgetPosition || { x: 1200, y: 20 };
  const isNearRightEdge = position.x > window.innerWidth - 300;
  const barWidth = 200;
  const safeLeft = isNearRightEdge ?
    Math.max(10, position.x - barWidth - 20) :
    Math.min(window.innerWidth - barWidth - 10, position.x + 60);

  const dropdownOptions = buckets.map(bucket => bucket.name);
  
  // Debug logging
  console.log('ActionBar current buckets:', buckets, 'dropdownOptions:', dropdownOptions);

  // Event handler function (moved outside useEffect for testability)
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
      } else if (eventName === 'screenshot-processing' && payload) {
        console.log('ActionBar: Global screenshot processing - updating UI state');
        setScreenshotStatus('processing');
        setGlobalShortcutFeedback(true);
        console.log('ActionBar: UI state updated to processing');
      } else if (eventName === 'screenshot-taken' && payload && payload.success) {
        console.log('ActionBar: Global screenshot taken successfully - updating UI state');
        console.log('ActionBar: Received image data for processing:', {
          hasImageData: !!payload.imageData,
          resolution: payload.resolution,
          filePath: payload.filePath
        });
        
        // Process the image data in the overlay
        if (payload.imageData) {
          processScreenshotInOverlay(payload.imageData, payload.resolution, payload.filePath);
        }
        
        setScreenshotStatus('success');
        setGlobalShortcutFeedback(true);
        console.log('ActionBar: UI state updated to success');
        // Show success feedback for 2.5 seconds, then reset (same as button click)
        setTimeout(() => {
          console.log('ActionBar: Resetting UI state to ready after success');
          setScreenshotStatus('ready');
          setGlobalShortcutFeedback(false);
        }, 2500);
      } else if (eventName === 'screenshot-taken' && payload && payload.success) {
        console.log('ActionBar: Screenshot taken successfully - processing image data');
        console.log('ActionBar: Received image data for processing:', {
          hasImageData: !!payload.imageData,
          resolution: payload.resolution,
          filePath: payload.filePath
        });
        
        // Set status to success for button clicks, but keep ready for global shortcuts
        setScreenshotStatus('success');
        
        // Process the image data in the overlay
        if (payload.imageData) {
          processScreenshotInOverlay(payload.imageData, payload.resolution, payload.filePath);
        }
        
        // Reset to ready after 2 seconds
        setTimeout(() => {
          setScreenshotStatus('ready');
        }, 2000);
      } else if (eventName === 'screenshot-error' && payload && !payload.success) {
        console.log('ActionBar: Global screenshot failed:', payload.error);
        setScreenshotStatus('ready');
        setGlobalShortcutFeedback(false);
      } else if (eventName === 'validate-screenshot-request' && payload) {
        console.log('ActionBar: Screenshot validation request received from:', payload.source);
        handleScreenshotValidation(payload.source);
      } else {
        console.log('ActionBar: Ignoring event:', eventName);
      }
    } catch (err) {
      console.error('Error applying IPC event payload:', err);
    }
  };

  // Function to process screenshot image data in the overlay
  const processScreenshotInOverlay = (imageData, resolution, filePath) => {
    console.log('ActionBar: Processing screenshot in overlay', {
      imageSize: imageData ? imageData.length : 'No image data',
      resolution,
      filePath
    });
    
    try {
      // Create an image element to work with the screenshot
      const img = new Image();
      img.onload = () => {
        console.log('ActionBar: Image loaded successfully for processing', {
          width: img.width,
          height: img.height
        });
        
        // Here you can add your image processing logic
        // For example:
        // - Create a canvas to draw the image
        // - Apply filters or overlays
        // - Extract specific regions
        // - Perform OCR or object detection
        // - Add annotations or highlights
        
        // Example: Create a canvas for processing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
        // Example processing: Add a semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 122, 255, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // You can now use the processed canvas data
        const processedImageData = canvas.toDataURL('image/png');
        console.log('ActionBar: Image processing completed');
        
        // Store processed image or trigger further actions
        // For example, you could dispatch an action to store the processed image
        // or send it back to the main process for saving
        
      };
      img.onerror = (error) => {
        console.error('ActionBar: Failed to load image for processing:', error);
      };
      img.src = imageData;
      
    } catch (error) {
      console.error('ActionBar: Error processing screenshot image:', error);
    }
  };

  // Function to handle screenshot validation requests
  const handleScreenshotValidation = async (source) => {
    console.log('ActionBar: Validating screenshot request from:', source);
    console.log('ActionBar: Current validation state:', {
      selectedOption,
      bucketsLength: buckets ? buckets.length : 'null/undefined',
      buckets: buckets,
      dropdownOptions: dropdownOptions
    });
    
    // Check if a valid option is selected
    if (!selectedOption || selectedOption === 'Select Option') {
      console.log('ActionBar: No valid option selected, attempting auto-selection');
      
      // Wait a moment and try to fetch fresh buckets if needed
      let availableBuckets = buckets;
      if (!availableBuckets || availableBuckets.length === 0) {
        console.log('ActionBar: Buckets not loaded, attempting to fetch fresh buckets');
        try {
          const freshBuckets = await getAllBuckets();
          console.log('ActionBar: Fresh buckets fetched:', freshBuckets);
          if (freshBuckets && freshBuckets.length > 0) {
            dispatch(setBuckets(freshBuckets));
            availableBuckets = freshBuckets;
          }
        } catch (error) {
          console.error('ActionBar: Failed to fetch fresh buckets:', error);
        }
      }
      
      // Auto-select first bucket if available
      if (availableBuckets && availableBuckets.length > 0) {
        const firstBucket = availableBuckets[0].name;
        setSelectedOption(firstBucket);
        console.log('ActionBar: Auto-selected option:', firstBucket);
        
        // Show brief feedback that option was auto-selected
        setGlobalShortcutFeedback(true);
        setTimeout(() => setGlobalShortcutFeedback(false), 1500);
        
        // Proceed with screenshot after a brief delay to show the selection
        setTimeout(async () => {
          console.log('ActionBar: Proceeding with screenshot after auto-selection');
          await proceedWithValidatedScreenshot(source);
        }, 500);
      } else {
        console.log('ActionBar: No buckets available even after fresh fetch, cannot take screenshot');
        console.log('ActionBar: Final bucket state:', availableBuckets);
        // Show error feedback
        alert('Please wait for buckets to load before taking a screenshot.');
        return;
      }
    } else {
      console.log('ActionBar: Valid option already selected, proceeding with screenshot');
      await proceedWithValidatedScreenshot(source);
    }
  };

  // Function to proceed with screenshot after validation
  const proceedWithValidatedScreenshot = async (source) => {
    try {
      let screenshotAPI = null;
      if (window && window.electronAPI && window.electronAPI.proceedWithScreenshot) {
        screenshotAPI = window.electronAPI;
      } else if (window && window.widgetAPI && window.widgetAPI.proceedWithScreenshot) {
        screenshotAPI = window.widgetAPI;
      }
      
      if (screenshotAPI) {
        console.log('ActionBar: Calling proceedWithScreenshot for source:', source);
        const result = await screenshotAPI.proceedWithScreenshot(source);
        console.log('ActionBar: Screenshot validation result:', result);
      } else {
        console.error('ActionBar: Screenshot API not available for validation');
      }
    } catch (error) {
      console.error('ActionBar: Error proceeding with validated screenshot:', error);
    }
  };

  // Debug function to test screenshot events (exposed to window for console testing)
  window.testScreenshotEvent = (eventName, payload) => {
    console.log('Testing screenshot event:', eventName, payload);
    const mockEvent = {};
    const mockData = { eventName, payload };
    onBucketsUpdated(mockEvent, mockData);
  };

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
    
    // Setup IPC listeners with retry logic
    const setupIpcListeners = () => {
      console.log('ActionBar: Attempting to setup IPC listeners');
      console.log('ActionBar: Available APIs:', {
        electronAPI: !!window.electronAPI,
        electronAPIOnEventFromMain: !!(window.electronAPI && window.electronAPI.onEventFromMain),
        widgetAPI: !!window.widgetAPI,
        widgetAPIOnEventFromMain: !!(window.widgetAPI && window.widgetAPI.onEventFromMain)
      });

      if (window && window.electronAPI && window.electronAPI.onEventFromMain) {
        console.log('ActionBar: Setting up IPC listener via electronAPI');
        try {
          window.electronAPI.onEventFromMain(onBucketsUpdated);
          console.log('ActionBar: electronAPI listener setup successful');
        } catch (error) {
          console.error('ActionBar: Error setting up electronAPI listener:', error);
        }
      } else if (window && window.widgetAPI && window.widgetAPI.onEventFromMain) {
        console.log('ActionBar: Setting up IPC listener via widgetAPI');
        try {
          window.widgetAPI.onEventFromMain(onBucketsUpdated);
          console.log('ActionBar: widgetAPI listener setup successful');
        } catch (error) {
          console.error('ActionBar: Error setting up widgetAPI listener:', error);
        }
      } else {
        console.warn('ActionBar: No IPC API available. electronAPI:', !!window.electronAPI, 'widgetAPI:', !!window.widgetAPI);
        // Retry after a short delay
        setTimeout(setupIpcListeners, 100);
      }
    };

    // Initial setup
    setupIpcListeners();
    
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

  // Set first bucket as default when buckets are loaded
  useEffect(() => {
    if (buckets && buckets.length > 0 && selectedOption === 'Select Option') {
      setSelectedOption(buckets[0].name);
      console.log('ActionBar: Set default selection to:', buckets[0].name);
    }
  }, [buckets, selectedOption]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

    // Capture screenshot and save locally
  const handleActionButton = async () => {
    console.log(`ActionBar: Action button clicked with option: ${selectedOption}`);
    console.log('ActionBar: Button click state:', {
      selectedOption,
      bucketsLength: buckets ? buckets.length : 'null/undefined',  
      buckets: buckets
    });
    
    // Check if screenshot process is already active
    if (screenshotStatus === 'processing') {
      console.log('ActionBar: Screenshot already in progress, ignoring button click');
      alert('Screenshot is already in progress. Please wait for it to complete.');
      return;
    }
    
    // Check if a valid option is selected
    if (!selectedOption || selectedOption === 'Select Option') {
      console.log('ActionBar: No valid option selected from button, auto-selecting first available option');
      
      // Auto-select first bucket if available
      if (buckets && buckets.length > 0) {
        const firstBucket = buckets[0].name;
        setSelectedOption(firstBucket);
        console.log('ActionBar: Auto-selected option from button click:', firstBucket);
        
        // Continue with screenshot after auto-selection
        setTimeout(() => {
          handleActionButton(); // Recursive call after auto-selection
        }, 100);
        return;
      } else {
        console.log('ActionBar: No buckets available for button click, cannot take screenshot');
        console.log('ActionBar: Button click final bucket state:', buckets);
        alert('Please wait for buckets to load before taking a screenshot.');
        return;
      }
    }
    
    // Set status to processing (red)
    setScreenshotStatus('processing');
    
    // Try both electronAPI and widgetAPI for screenshot functionality
    let screenshotAPI = null;
    if (window && window.electronAPI && window.electronAPI.captureAndSaveScreenshot) {
      screenshotAPI = window.electronAPI;
      console.log('Using electronAPI for screenshot');
    } else if (window && window.widgetAPI && window.widgetAPI.captureAndSaveScreenshot) {
      screenshotAPI = window.widgetAPI;
      console.log('Using widgetAPI for screenshot');
    }
    
    if (screenshotAPI) {
      try {
        const result = await screenshotAPI.captureAndSaveScreenshot();
        console.log('Screenshot captured and saved successfully.', result);
        
        // Process the image data directly from the IPC response
        if (result.success && result.imageData) {
          console.log('ActionBar: Processing image data from button click');
          processScreenshotInOverlay(result.imageData, result.resolution, result.filePath);
        }
        
        // Set status to success (green)
        setScreenshotStatus('success');
        
        // After 2.5 seconds, reset to ready (grey)
        setTimeout(() => {
          setScreenshotStatus('ready');
        }, 2500);
        
      } catch (err) {
        console.error('Failed to capture or save screenshot:', err);
        
        // On error, reset to ready after a short delay
        setTimeout(() => {
          setScreenshotStatus('ready');
        }, 1000);
      }
    } else {
      console.error('Screenshot functionality is not available. electronAPI:', !!window.electronAPI, 'widgetAPI:', !!window.widgetAPI);
      alert('Screenshot functionality is not available.');
      
      // Reset status to ready
      setScreenshotStatus('ready');
    }
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
      {/* Add CSS animation for pulsing effect and slide-in animation */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          @keyframes slideInOut {
            0% {
              transform: translateY(-20px);
              opacity: 0;
            }
            10%, 90% {
              transform: translateY(0);
              opacity: 1;
            }
            100% {
              transform: translateY(-20px);
              opacity: 0;
            }
          }
          .global-shortcut-feedback {
            animation: slideInOut 2s ease-in-out;
          }
        `}
      </style>
      
      {/* Global Shortcut Feedback Notification */}
      {globalShortcutFeedback }
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

          {/* Action Button with Status Indicator */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Status Circle */}
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: screenshotStatus === 'ready' ? '#6B7280' : 
                         screenshotStatus === 'processing' ? '#EF4444' : '#10B981',
              marginBottom: '4px',
              transition: 'background-color 0.3s ease',
              boxShadow: screenshotStatus === 'processing' ? '0 0 8px rgba(239, 68, 68, 0.6)' : 
                         screenshotStatus === 'success' ? '0 0 8px rgba(16, 185, 129, 0.6)' : 'none',
              animation: screenshotStatus === 'processing' ? 'pulse 1s infinite' : 'none'
            }} />

            <button
              onClick={handleActionButton}
              disabled={screenshotStatus === 'processing' || !selectedOption || selectedOption === 'Select Option'}
              style={{
                background: (screenshotStatus === 'processing' || !selectedOption || selectedOption === 'Select Option') ? '#6B7280' : themeColors.primaryBlue,
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                color: themeColors.primaryText,
                fontSize: '12px',
                fontWeight: '600',
                cursor: (screenshotStatus === 'processing' || !selectedOption || selectedOption === 'Select Option') ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                opacity: (screenshotStatus === 'processing' || !selectedOption || selectedOption === 'Select Option') ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (screenshotStatus !== 'processing' && selectedOption && selectedOption !== 'Select Option') {
                  e.target.style.background = '#0056CC';
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 122, 255, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (screenshotStatus !== 'processing' && selectedOption && selectedOption !== 'Select Option') {
                  e.target.style.background = themeColors.primaryBlue;
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {screenshotStatus === 'processing' ? 'Taking...' : 'Add'}
            </button>
          </div>
        </div>
      </div>


    </HoverComponent>
  );
};

export default ActionBar;

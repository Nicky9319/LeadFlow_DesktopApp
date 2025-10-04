import React, { useState, useEffect } from 'react';
import LeadCard from './LeadCard';

const LeadsContainer = ({ leads = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditingCounter, setIsEditingCounter] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [swipeSensitivity, setSwipeSensitivity] = useState(150);
  const [showSensitivityControl, setShowSensitivityControl] = useState(false);
  const [isEditingSensitivity, setIsEditingSensitivity] = useState(false);
  const [editSensitivityValue, setEditSensitivityValue] = useState('');

  // Reset to first lead when leads change
  useEffect(() => {
    setCurrentIndex(0);
  }, [leads]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentIndex, leads.length]);

  const handlePrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : leads.length - 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev < leads.length - 1 ? prev + 1 : 0);
  };

  const handleCounterClick = () => {
    setIsEditingCounter(true);
    setEditValue(currentIndex + 1);
  };

  const handleCounterEdit = () => {
    const index = parseInt(editValue) - 1; // Convert to 0-based index
    if (index >= 0 && index < leads.length) {
      setCurrentIndex(index);
    }
    setIsEditingCounter(false);
    setEditValue('');
  };

  const handleCounterKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCounterEdit();
    } else if (e.key === 'Escape') {
      setIsEditingCounter(false);
      setEditValue('');
    }
  };

  const handleCounterBlur = () => {
    handleCounterEdit();
  };

  // Sensitivity editing functions
  const handleSensitivityClick = () => {
    setIsEditingSensitivity(true);
    setEditSensitivityValue(swipeSensitivity.toString());
  };

  const handleSensitivityEdit = () => {
    const value = parseInt(editSensitivityValue);
    if (value >= 50 && value <= 300) {
      setSwipeSensitivity(value);
    }
    setIsEditingSensitivity(false);
    setEditSensitivityValue('');
  };

  const handleSensitivityKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSensitivityEdit();
    } else if (e.key === 'Escape') {
      setIsEditingSensitivity(false);
      setEditSensitivityValue('');
    }
  };

  const handleSensitivityBlur = () => {
    handleSensitivityEdit();
  };

  // Touchpad swipe functionality - now uses dynamic sensitivity
  const minSwipeDistance = swipeSensitivity;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };

  // Mouse wheel horizontal scroll for touchpad
  const handleWheel = (e) => {
    // Check if it's a horizontal scroll (touchpad two-finger swipe)
    // Uses dynamic sensitivity based on user setting
    const wheelThreshold = Math.max(20, swipeSensitivity / 3); // Scale wheel sensitivity
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > wheelThreshold) {
      e.preventDefault();
      if (e.deltaX > 0) {
        handleNext();
      } else if (e.deltaX < 0) {
        handlePrevious();
      }
    }
  };

  if (leads.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#1C1C1E] rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[#8E8E93]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-[#FFFFFF] mb-2">No Leads Found</h3>
          <p className="text-[#8E8E93]">Add some leads to get started with the card view.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leads-container">
      {/* Header with Counter and Navigation */}
      <div className="flex items-center justify-between mb-6">
        {/* Counter */}
        <div className="flex items-center space-x-4">
          {isEditingCounter ? (
            <div className="flex items-center space-x-1">
              <span className="text-sm text-[#E5E5E7]">Lead</span>
              <input
                type="number"
                min="1"
                max={leads.length}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyPress={handleCounterKeyPress}
                onBlur={handleCounterBlur}
                autoFocus
                className="w-12 px-1 py-0.5 text-sm bg-[#1C1C1E] border border-[#007AFF] rounded text-[#FFFFFF] focus:outline-none focus:ring-1 focus:ring-[#007AFF]"
              />
              <span className="text-sm text-[#E5E5E7]">of {leads.length}</span>
            </div>
          ) : (
            <div 
              className="text-sm text-[#E5E5E7] cursor-pointer hover:text-[#FFFFFF] transition-colors"
              onClick={handleCounterClick}
              title="Click to edit"
            >
              Lead {currentIndex + 1} of {leads.length}
            </div>
          )}
        </div>

        {/* Navigation Buttons and Settings */}
        <div className="flex items-center space-x-2">
          {/* Sensitivity Control Toggle */}
          <button
            onClick={() => setShowSensitivityControl(!showSensitivityControl)}
            className="p-2 text-[#E5E5E7] hover:text-[#FFFFFF] hover:bg-[#2D2D2F] rounded-full transition-colors"
            title="Swipe Sensitivity Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          <button
            onClick={handlePrevious}
            disabled={leads.length <= 1}
            className="p-2 text-[#E5E5E7] hover:text-[#FFFFFF] hover:bg-[#2D2D2F] rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous Lead"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={handleNext}
            disabled={leads.length <= 1}
            className="p-2 text-[#E5E5E7] hover:text-[#FFFFFF] hover:bg-[#2D2D2F] rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next Lead"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sensitivity Control Panel */}
      {showSensitivityControl && (
        <div className="mb-4 p-4 bg-[#111111] border border-[#1C1C1E] rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-[#E5E5E7]">Swipe Sensitivity:</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-[#8E8E93]">Low</span>
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={swipeSensitivity}
                  onChange={(e) => setSwipeSensitivity(parseInt(e.target.value))}
                  className="w-32 h-2 bg-[#1C1C1E] rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #007AFF 0%, #007AFF ${((swipeSensitivity - 50) / 250) * 100}%, #1C1C1E ${((swipeSensitivity - 50) / 250) * 100}%, #1C1C1E 100%)`
                  }}
                />
                <span className="text-xs text-[#8E8E93]">High</span>
              </div>
              {isEditingSensitivity ? (
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    min="50"
                    max="300"
                    value={editSensitivityValue}
                    onChange={(e) => setEditSensitivityValue(e.target.value)}
                    onKeyPress={handleSensitivityKeyPress}
                    onBlur={handleSensitivityBlur}
                    autoFocus
                    className="w-16 px-2 py-1 text-xs bg-[#1C1C1E] border border-[#007AFF] rounded text-[#FFFFFF] focus:outline-none focus:ring-1 focus:ring-[#007AFF]"
                  />
                  <span className="text-xs text-[#8E8E93]">px</span>
                </div>
              ) : (
                <span 
                  className="text-xs text-[#007AFF] font-mono bg-[#1C1C1E] px-2 py-1 rounded cursor-pointer hover:bg-[#2D2D2F] transition-colors"
                  onClick={handleSensitivityClick}
                  title="Click to edit"
                >
                  {swipeSensitivity}px
                </span>
              )}
            </div>
            <button
              onClick={() => setShowSensitivityControl(false)}
              className="p-1 text-[#8E8E93] hover:text-[#FFFFFF] transition-colors"
              title="Close Settings"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-2 text-xs text-[#8E8E93]">
            Adjust how far you need to swipe to navigate between leads. Higher values require longer swipes.
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-[#1C1C1E] rounded-full h-2">
          <div 
            className="bg-[#007AFF] h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${((currentIndex + 1) / leads.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Card Container */}
      <div 
        className="relative min-h-96"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onWheel={handleWheel}
      >
        <LeadCard 
          lead={leads[currentIndex]} 
          isActive={true}
        />
      </div>

      {/* Navigation Info */}
      <div className="mt-6 text-center">
        <p className="text-xs text-[#8E8E93]">
          Use ← → arrow keys, swipe left/right on touchpad, or click navigation buttons to move between leads
        </p>
      </div>
    </div>
  );
};

export default LeadsContainer;

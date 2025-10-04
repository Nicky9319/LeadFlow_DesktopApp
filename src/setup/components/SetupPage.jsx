import React, { useState, useEffect, useRef } from 'react';

const SetupPage = () => {
  const [currentStep, setCurrentStep] = useState('checking'); // checking, installing, configuring, finalizing, complete
  const [wslInstalled, setWslInstalled] = useState(false);
  const [needsRestart, setNeedsRestart] = useState(false);
  const [configComplete, setConfigComplete] = useState(false);
  const [finalizingComplete, setFinalizingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Prevent duplicate execution
  const configurationInProgress = useRef(false);
  const finalizingInProgress = useRef(false);
  const initialSetupCalled = useRef(false);

  // Color palette from ColorPallete.txt
  const colors = {
    primaryBg: '#000000',
    secondaryBg: '#111111',
    surfaceBg: '#1C1C1E',
    tertiaryBg: '#2D2D2F',
    primaryText: '#FFFFFF',
    secondaryText: '#E5E5E7',
    mutedText: '#8E8E93',
    primaryBlue: '#007AFF',
    successGreen: '#00D09C',
    warningOrange: '#FF9500',
    errorRed: '#FF3B30',
    hoverBg: 'rgba(28, 28, 30, 0.6)'
  };

  // Check WSL installation on component mount
  useEffect(() => {
    if (!initialSetupCalled.current) {
      initialSetupCalled.current = true;
      checkInitialSetup();
    }
  }, []);

  const checkInitialSetup = async () => {
    if (configurationInProgress.current) {
      console.log('Configuration already in progress, skipping...');
      return;
    }
    
    setIsLoading(true);
    setCurrentStep('checking');
    
    try {
      // Check if WSL is already installed
      const wslCheck = await window.electronAPI.checkWSL();
      
      if (wslCheck) {
        setWslInstalled(true);
        // If WSL is installed, move to configuration step
        setCurrentStep('configuring');
        await handleConfigureWSL();
      } else {
        // WSL not installed, show installation step
        setCurrentStep('installing');
      }
    } catch (error) {
      console.error('Error checking initial setup:', error);
      setError('Failed to check system setup');
      setCurrentStep('installing');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstallWSL = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await window.electronAPI.installWSL();
      setWslInstalled(true);
      setNeedsRestart(true);
    } catch (error) {
      console.error('Error installing WSL:', error);
      setError('Failed to install WSL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestartSystem = async () => {
    try {
      await window.electronAPI.restartSystem();
    } catch (error) {
      console.error('Error restarting system:', error);
      setError('Failed to restart system. Please restart manually.');
    }
  };

  const handleConfigureWSL = async () => {
    if (configurationInProgress.current) {
      console.log('WSL configuration already in progress, skipping...');
      return;
    }
    
    configurationInProgress.current = true;
    setIsLoading(true);
    setError('');
    setCurrentStep('configuring');
    
    try {
      console.log('Starting WSL configuration...');
      const result = await window.electronAPI.checkWslConfigDone();
      
      if (result) {
        setConfigComplete(true);
        setCurrentStep('finalizing');
        await handleFinalizingAgent();
        console.log('WSL configuration completed successfully');
      } else {
        setError('WSL configuration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error configuring WSL:', error);
      setError('Failed to configure WSL. Please try again.');
    } finally {
      setIsLoading(false);
      configurationInProgress.current = false;
    }
  };

  const handleFinalizingAgent = async () => {
    if (finalizingInProgress.current) {
      console.log('Agent finalizing already in progress, skipping...');
      return;
    }
    
    finalizingInProgress.current = true;
    setIsLoading(true);
    setError('');
    setCurrentStep('finalizing');
    
    try {
      console.log('Starting agent finalization...');
      const result = await window.electronAPI.finalizingAgent();
      
      if (result) {
        setFinalizingComplete(true);
        setCurrentStep('complete');
        console.log('Agent finalization completed successfully');
      } else {
        setError('Agent finalization failed. Please try again.');
      }
    } catch (error) {
      console.error('Error finalizing agent:', error);
      setError('Failed to finalize agent. Please try again.');
    } finally {
      setIsLoading(false);
      finalizingInProgress.current = false;
    }
  };

  const handleContinue = async () => {
    try {
      await window.electronAPI.setupContinue();
    } catch (error) {
      console.error('Error continuing setup:', error);
      setError('Failed to continue. Please try again.');
    }
  };

  const renderCheckingStep = () => (
    <div className="text-center space-y-6">
      <div className="flex items-center justify-center space-x-3">
        <div 
          className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent"
          style={{ borderColor: colors.primaryBlue, borderTopColor: 'transparent' }}
        />
        <p style={{ color: colors.secondaryText }} className="text-lg">
          Checking all installations...
        </p>
      </div>
      <p style={{ color: colors.mutedText }} className="text-sm">
        Please wait while we verify your system setup
      </p>
    </div>
  );

  const renderInstallationStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 style={{ color: colors.primaryText }} className="text-2xl font-bold">
          WSL Installation Required
        </h2>
        <p style={{ color: colors.secondaryText }} className="text-lg">
          Windows Subsystem for Linux (WSL) needs to be installed to continue.
        </p>
      </div>

      {!needsRestart ? (
        <div 
          className="rounded-lg p-6 border"
          style={{ 
            backgroundColor: colors.surfaceBg, 
            borderColor: colors.tertiaryBg 
          }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <svg 
              className="w-6 h-6" 
              style={{ color: colors.warningOrange }}
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p style={{ color: colors.primaryText }} className="font-semibold">
              Installation Required
            </p>
          </div>
          <p style={{ color: colors.secondaryText }} className="mb-4">
            WSL is not installed on your system. Click the button below to install it.
          </p>
          
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div 
                className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent"
                style={{ borderColor: colors.successGreen, borderTopColor: 'transparent' }}
              />
              <span style={{ color: colors.secondaryText }}>Installing WSL...</span>
            </div>
          ) : (
            <button
              onClick={handleInstallWSL}
              className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:opacity-80"
              style={{ 
                backgroundColor: colors.successGreen, 
                color: colors.primaryText 
              }}
            >
              Install WSL
            </button>
          )}
        </div>
      ) : (
        <div 
          className="rounded-lg p-6 border"
          style={{ 
            backgroundColor: colors.surfaceBg, 
            borderColor: colors.primaryBlue 
          }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <svg 
              className="w-6 h-6" 
              style={{ color: colors.successGreen }}
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <p style={{ color: colors.primaryText }} className="font-semibold">
              Installation Complete!
            </p>
          </div>
          <p style={{ color: colors.secondaryText }} className="mb-4">
            WSL has been installed successfully. A system restart is required to complete the setup.
          </p>
          
          <button
            onClick={handleRestartSystem}
            className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:opacity-80"
            style={{ 
              backgroundColor: colors.errorRed, 
              color: colors.primaryText 
            }}
          >
            Restart Computer
          </button>
        </div>
      )}
    </div>
  );

  const renderConfigurationStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 style={{ color: colors.primaryText }} className="text-2xl font-bold">
          Configuring WSL
        </h2>
        <p style={{ color: colors.secondaryText }} className="text-lg">
          Setting up the WSL distribution and configuring the environment...
        </p>
      </div>

      <div 
        className="rounded-lg p-6 border"
        style={{ 
          backgroundColor: colors.surfaceBg, 
          borderColor: colors.tertiaryBg 
        }}
      >
        {isLoading ? (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div 
                className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent"
                style={{ borderColor: colors.primaryBlue, borderTopColor: 'transparent' }}
              />
              <p style={{ color: colors.secondaryText }} className="text-lg">
                Configuring WSL distribution...
              </p>
            </div>
            <p style={{ color: colors.mutedText }} className="text-sm">
              This may take a few minutes. Please wait...
            </p>
          </div>
        ) : configComplete ? (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <svg 
                className="w-8 h-8" 
                style={{ color: colors.successGreen }}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <p style={{ color: colors.primaryText }} className="text-lg font-semibold">
                Configuration Complete!
              </p>
            </div>
            <p style={{ color: colors.secondaryText }}>
              WSL has been successfully configured and is ready to use.
            </p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p style={{ color: colors.secondaryText }}>
              Click the button below to configure WSL.
            </p>
            <button
              onClick={handleConfigureWSL}
              className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:opacity-80"
              style={{ 
                backgroundColor: colors.primaryBlue, 
                color: colors.primaryText 
              }}
            >
              Configure WSL
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderFinalizingStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 style={{ color: colors.primaryText }} className="text-2xl font-bold">
          Finalizing Agent
        </h2>
        <p style={{ color: colors.secondaryText }} className="text-lg">
          Setting up the agent environment and completing final configurations...
        </p>
      </div>

      <div 
        className="rounded-lg p-6 border"
        style={{ 
          backgroundColor: colors.surfaceBg, 
          borderColor: colors.tertiaryBg 
        }}
      >
        {isLoading ? (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div 
                className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent"
                style={{ borderColor: colors.primaryBlue, borderTopColor: 'transparent' }}
              />
              <p style={{ color: colors.secondaryText }} className="text-lg">
                Finalizing agent setup...
              </p>
            </div>
            <p style={{ color: colors.mutedText }} className="text-sm">
              This may take a few moments. Please wait...
            </p>
          </div>
        ) : finalizingComplete ? (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <svg 
                className="w-8 h-8" 
                style={{ color: colors.successGreen }}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <p style={{ color: colors.primaryText }} className="text-lg font-semibold">
                Agent Finalization Complete!
              </p>
            </div>
            <p style={{ color: colors.secondaryText }}>
              The agent has been successfully finalized and is ready to use.
            </p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p style={{ color: colors.secondaryText }}>
              Click the button below to finalize the agent setup.
            </p>
            <button
              onClick={handleFinalizingAgent}
              className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:opacity-80"
              style={{ 
                backgroundColor: colors.primaryBlue, 
                color: colors.primaryText 
              }}
            >
              Finalize Agent
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <svg 
            className="w-12 h-12" 
            style={{ color: colors.successGreen }}
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <h2 style={{ color: colors.primaryText }} className="text-3xl font-bold">
            Setup Complete!
          </h2>
        </div>
        <p style={{ color: colors.secondaryText }} className="text-lg">
          Your system is now ready. Click continue to proceed to the main application.
        </p>
      </div>

      <div className="text-center">
        <button
          onClick={handleContinue}
          className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:opacity-80 transform hover:scale-105"
          style={{ 
            backgroundColor: colors.successGreen, 
            color: colors.primaryText 
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );

  const getCurrentStepContent = () => {
    switch (currentStep) {
      case 'checking':
        return renderCheckingStep();
      case 'installing':
        return renderInstallationStep();
      case 'configuring':
        return renderConfigurationStep();
      case 'finalizing':
        return renderFinalizingStep();
      case 'complete':
        return renderCompleteStep();
      default:
        return renderCheckingStep();
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: colors.primaryBg }}
    >
      <div 
        className="rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
        style={{ backgroundColor: colors.secondaryBg }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            style={{ 
              background: `linear-gradient(to right, ${colors.primaryBlue}, ${colors.successGreen})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            DonnaAI Setup
          </h1>
          <p style={{ color: colors.mutedText }} className="text-lg">
            Setting up your development environment
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {['checking', 'installing', 'configuring', 'finalizing', 'complete'].map((step, index) => {
              const isActive = currentStep === step;
              const isCompleted = 
                (step === 'checking' && currentStep !== 'checking') ||
                (step === 'installing' && wslInstalled) ||
                (step === 'configuring' && configComplete) ||
                (step === 'finalizing' && finalizingComplete) ||
                (step === 'complete' && finalizingComplete);
              
              return (
                <div key={step} className="flex items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      isActive ? 'ring-2 ring-offset-2' : ''
                    }`}
                    style={{ 
                      backgroundColor: isCompleted ? colors.successGreen : 
                                     isActive ? colors.primaryBlue : colors.tertiaryBg,
                      color: colors.primaryText,
                      ringColor: isActive ? colors.primaryBlue : 'transparent',
                      ringOffsetColor: colors.secondaryBg
                    }}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  {index < 4 && (
                    <div 
                      className="w-12 h-1 mx-2"
                      style={{ 
                        backgroundColor: isCompleted ? colors.successGreen : colors.tertiaryBg 
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {getCurrentStepContent()}
          
          {/* Error Display */}
          {error && (
            <div 
              className="rounded-lg p-4 border"
              style={{ 
                backgroundColor: `${colors.errorRed}20`, 
                borderColor: colors.errorRed 
              }}
            >
              <div className="flex items-center space-x-2">
                <svg 
                  className="w-5 h-5" 
                  style={{ color: colors.errorRed }}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p style={{ color: colors.errorRed }} className="font-medium">
                  {error}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
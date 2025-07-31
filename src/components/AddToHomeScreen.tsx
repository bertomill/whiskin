'use client';

import { useState, useEffect } from 'react';

// Interface for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// This component shows an "Add to Home Screen" button when the app can be installed as a PWA
// It detects if the user is on mobile and if the browser supports PWA installation
export default function AddToHomeScreen() {
  // State to track if the app can be installed
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  // State to track if we should show the install button
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  // State to track installation success
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    // This event is fired when the browser determines the app can be installed
    const handleBeforeInstallPrompt = (event: Event) => {
      console.log('PWA install prompt available');
      // Prevent the default browser install prompt
      event.preventDefault();
      // Store the event so we can trigger it later when user clicks our button
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      // Show our custom install button
      setShowInstallPrompt(true);
    };

    // Listen for successful app installation
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if app is already installed by looking for standalone display mode
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Cleanup event listeners when component unmounts
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Function to handle the install button click
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      // Show the browser's install prompt
      await deferredPrompt.prompt();
      
      // Wait for the user's response to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsInstalled(true);
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Clear the deferred prompt since it can only be used once
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Error showing install prompt:', error);
      setShowInstallPrompt(false);
    }
  };

  // Function to handle the "Later" button click
  const handleLaterClick = () => {
    setShowInstallPrompt(false);
    // Store in localStorage to not show again for this session
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show anything if the app is already installed or can't be installed
  if (isInstalled || !showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-auto">
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-lg p-4 mx-auto max-w-sm">
        <div className="flex items-center space-x-3">
          {/* App icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Install Whiskin</p>
            <p className="text-xs text-white/80">Add to your home screen for quick access</p>
          </div>
          
          {/* Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={handleLaterClick}
              className="text-white/80 hover:text-white text-xs font-medium px-2 py-1"
            >
              Later
            </button>
            <button
              onClick={handleInstallClick}
              className="bg-white text-red-600 hover:bg-white/90 text-xs font-medium px-3 py-1 rounded-md transition-colors"
            >
              Install
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
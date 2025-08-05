'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import PhoneNumberModal from './PhoneNumberModal';

// Meal interface (should match the one in GenerateView)
interface Meal {
  id: string;
  name: string;
  protein: string[];
  vegFruit: string[];
  otherIngredients: string[];
  carb: string[];
  image?: string;
}

// Interface defining the props for the ActionButtons component
interface ActionButtonsProps {
  onGetRandomMeal: () => void; // Callback function to trigger random meal fetching
  isLoading: boolean; // Boolean to indicate if a request is currently in progress
  hasCurrentMeal?: boolean; // Whether there's a current meal to text
  currentMeal?: Meal | null; // Current meal data for SMS
}

// ActionButtons component that renders a sticky button for getting random meals
export default function ActionButtons({ onGetRandomMeal, isLoading, hasCurrentMeal, currentMeal }: ActionButtonsProps) {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleTextMeThis = () => {
    if (!session) {
      // Redirect to sign in if not authenticated
      signIn();
      return;
    }
    
    // Open phone number modal
    setIsModalOpen(true);
  };

  const handleSendSMS = async (phoneNumber: string) => {
    if (!currentMeal) return;

    setIsSending(true);
    setFeedbackMessage(null);
    
    try {
      console.log('Sending SMS with meal data:', currentMeal);
      
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          meal: currentMeal
        })
      });

      const data = await response.json();
      console.log('SMS API response:', data);

      if (response.ok) {
        setIsModalOpen(false);
        setFeedbackMessage({
          type: 'success',
          text: `✅ Meal sent to ${phoneNumber}! Check your messages.`
        });
        // Clear success message after 5 seconds
        setTimeout(() => setFeedbackMessage(null), 5000);
      } else {
        setFeedbackMessage({
          type: 'error',
          text: `❌ Failed to send: ${data.error}`
        });
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      setFeedbackMessage({
        type: 'error',
        text: '❌ Network error occurred. Please try again.'
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Feedback Message */}
      {feedbackMessage && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] px-4 py-3 rounded-lg shadow-lg max-w-sm mx-auto ${
          feedbackMessage.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <p className="text-sm font-medium text-center">{feedbackMessage.text}</p>
        </div>
      )}

      {/* Sticky container positioned at bottom with centered content and z-index for overlay */}
      <div className="sticky bottom-4 flex flex-col gap-3 max-w-md mx-auto z-50 mt-6 md:mt-8">
        {/* Text me this button - only show when there's a current meal */}
        {hasCurrentMeal && (
          <button 
            onClick={handleTextMeThis}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white button-text py-3 px-6 md:px-8 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/30 border border-blue-400/30 disabled:transform-none shadow-sm text-sm md:text-base w-full md:w-auto"
          >
            📱 Text me this
          </button>
        )}
        
        {/* Get random meal button */}
        <button 
          onClick={onGetRandomMeal} // Trigger the random meal fetch when clicked
          disabled={isLoading} // Disable button during loading state
          // Comprehensive styling with hover effects, disabled states, and responsive design
          className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white button-text py-3 px-6 md:px-8 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-500/30 border border-amber-400/30 disabled:transform-none shadow-sm text-sm md:text-base w-full md:w-auto"
        >
          {/* Conditional rendering based on loading state */}
          {isLoading ? (
            <>
              {/* Loading spinner SVG icon */}
              <svg className="loading-spinner inline w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                {/* Spinner background circle */}
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                {/* Spinner animated path */}
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </>
          ) : (
            // Default button text when not loading
            'Get Random Meal'
          )}
        </button>
      </div>

      {/* Phone Number Modal */}
      <PhoneNumberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSendSMS}
        isLoading={isSending}
      />
    </>
  );
} 

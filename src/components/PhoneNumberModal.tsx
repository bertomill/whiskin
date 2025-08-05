'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface PhoneNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phoneNumber: string) => void;
  isLoading?: boolean;
}

export default function PhoneNumberModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false 
}: PhoneNumberModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const { isDarkMode } = useTheme();

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setError('');
  };

  const validateAndSubmit = () => {
    const numbers = phoneNumber.replace(/\D/g, '');
    
    if (numbers.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    const formattedNumber = `+1${numbers}`;
    onSubmit(formattedNumber);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      validateAndSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={cn(
        "max-w-md w-full rounded-xl p-6 border shadow-xl",
        isDarkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      )}>
        <div className="text-center mb-6">
          <h2 className={cn(
            "text-xl font-semibold mb-2",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            📱 Text Me This Meal
          </h2>
          <p className={cn(
            "text-sm",
            isDarkMode ? "text-gray-300" : "text-gray-600"
          )}>
            Enter your phone number to receive this meal recipe via text message
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className={cn(
              "block text-sm font-medium mb-2",
              isDarkMode ? "text-gray-200" : "text-gray-700"
            )}>
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="(555) 123-4567"
              value={phoneNumber}
              onChange={handlePhoneChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className={cn(
                "w-full px-4 py-3 rounded-lg border transition-colors text-lg",
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                error ? "border-red-500" : "",
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              )}
            />
            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={isLoading}
              className={cn(
                "flex-1 py-3 px-4 rounded-lg border transition-colors font-medium",
                isDarkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50",
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              )}
            >
              Cancel
            </button>
            <button
              onClick={validateAndSubmit}
              disabled={isLoading || !phoneNumber}
              className={cn(
                "flex-1 py-3 px-4 rounded-lg font-medium transition-colors",
                "bg-blue-500 hover:bg-blue-600 text-white",
                "disabled:bg-blue-300 disabled:cursor-not-allowed",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              )}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </div>
              ) : (
                'Send Text'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
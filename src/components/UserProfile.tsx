'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export default function UserProfile() {
  const { data: session } = useSession();
  const { isDarkMode } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  // Show sign-in button if not authenticated
  if (!session?.user) {
    return (
      <Link
        href="/auth/signin"
        className={cn(
          "px-4 py-2 rounded-lg border transition-colors text-sm font-medium",
          isDarkMode
            ? "bg-white/10 hover:bg-white/20 text-white border-white/20"
            : "bg-slate-800/80 hover:bg-slate-800/90 text-white border-slate-700"
        )}
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={cn(
          "flex items-center space-x-2 transition-colors",
          isDarkMode
            ? "text-white hover:text-gray-200"
            : "text-slate-800 hover:text-slate-600"
        )}
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || 'User'}
            className={cn(
              "w-8 h-8 rounded-full border-2",
              isDarkMode ? "border-white/20" : "border-slate-800/20"
            )}
          />
        ) : (
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
          </div>
        )}
        <span className="hidden md:block text-sm font-medium">
          {session.user.name || session.user.email}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className={cn(
          "absolute right-0 mt-2 w-48 backdrop-blur-md rounded-lg shadow-lg border z-50",
          isDarkMode
            ? "bg-white/95 border-white/20"
            : "bg-white/95 border-slate-200"
        )}>
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
              <p className="font-medium">{session.user.name}</p>
              <p className="text-gray-500">{session.user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 
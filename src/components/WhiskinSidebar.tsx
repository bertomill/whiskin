'use client';

import React from 'react';
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from '@/components/ui/sidebar';
import { IconDice, IconList, IconRefresh, IconChefHat, IconUser, IconMoon, IconSun } from '@tabler/icons-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useTheme } from '@/contexts/ThemeContext';

// Define the interface for the props that WhiskinSidebar expects
interface WhiskinSidebarProps {
  children: React.ReactNode;
  activeTab: 'generate' | 'all-meals';
  onTabChange: (tab: 'generate' | 'all-meals') => void;
  onRefreshMeals: () => void;
}

export default function WhiskinSidebar({
  children,
  activeTab,
  onTabChange,
  onRefreshMeals,
}: WhiskinSidebarProps) {
  const { data: session } = useSession();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  // Define the navigation links for the sidebar
  const sidebarLinks = [
    {
      label: 'Generate Meal',
      href: '#generate',
      icon: (
        <IconDice className={cn(
          "h-5 w-5 shrink-0",
          isDarkMode ? "text-stone-300" : "text-gray-600"
        )} />
      ),
    },
    {
      label: 'All Meals',
      href: '#all-meals',
      icon: (
        <IconList className={cn(
          "h-5 w-5 shrink-0",
          isDarkMode ? "text-stone-300" : "text-gray-600"
        )} />
      ),
    },
  ];
  
  // Function to handle tab changes
  const handleTabChange = (tab: 'generate' | 'all-meals') => {
    onTabChange(tab);
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar>
        <SidebarBody className={cn(
          "justify-between gap-10 border-r",
          isDarkMode 
            ? "bg-slate-900 border-stone-700" 
            : "bg-white border-gray-200"
        )}>
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {/* Logo Section - now part of navigation */}
            <div className="px-2 py-4">
              <SidebarLink
                link={{
                  label: 'Whiskin',
                  href: '#logo',
                  icon: (
                    <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <img 
                        src="/icons/whisk-icon.png" 
                        alt="Whiskin logo" 
                        className="h-5 w-5"
                      />
                    </div>
                  ),
                }}
                className={cn(
                  "rounded-lg transition-colors",
                  activeTab === 'generate'
                    ? 'bg-amber-100 text-amber-900 border border-amber-200'
                    : isDarkMode
                      ? 'text-stone-300 hover:bg-stone-800'
                      : 'text-gray-600 hover:bg-gray-100'
                )}
              />
            </div>

            {/* Navigation Links */}
            <div className="mt-8 flex flex-col gap-2 px-2">
              {sidebarLinks.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  onClick={(e) => {
                    e.preventDefault();
                    // Determine which tab to switch to based on the link
                    if (link.href === '#generate') {
                      handleTabChange('generate');
                    } else if (link.href === '#all-meals') {
                      handleTabChange('all-meals');
                    }
                  }}
                  className={cn(
                    "rounded-lg transition-colors",
                    (link.href === '#generate' && activeTab === 'generate') ||
                    (link.href === '#all-meals' && activeTab === 'all-meals')
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : isDarkMode
                        ? 'text-stone-300 hover:bg-stone-800'
                        : 'text-gray-600 hover:bg-gray-100'
                  )}
                />
              ))}
            </div>
          </div>

          {/* Footer with Refresh, Theme Toggle, and Sign In buttons */}
          <div className="px-2 pb-4 space-y-2">
            {/* Refresh Button */}
            <SidebarLink
              link={{
                label: 'Refresh Meals',
                href: '#refresh',
                icon: (
                  <IconRefresh className={cn(
                    "h-5 w-5 shrink-0",
                    isDarkMode ? "text-stone-300" : "text-gray-600"
                  )} />
                ),
              }}
              onClick={(e) => {
                e.preventDefault();
                onRefreshMeals();
              }}
              className={cn(
                "rounded-lg transition-colors",
                isDarkMode
                  ? "text-stone-300 hover:bg-stone-800"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            />
            
            {/* Dark Mode Toggle Button */}
            <SidebarLink
              link={{
                label: isDarkMode ? 'Light Mode' : 'Dark Mode',
                href: '#theme-toggle',
                icon: isDarkMode ? (
                  <IconSun className={cn(
                    "h-5 w-5 shrink-0",
                    isDarkMode ? "text-stone-300" : "text-gray-600"
                  )} />
                ) : (
                  <IconMoon className={cn(
                    "h-5 w-5 shrink-0",
                    isDarkMode ? "text-stone-300" : "text-gray-600"
                  )} />
                ),
              }}
              onClick={(e) => {
                e.preventDefault();
                toggleDarkMode();
              }}
              className={cn(
                "rounded-lg transition-colors",
                isDarkMode
                  ? "text-stone-300 hover:bg-stone-800"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            />
            
            {/* Sign In/User Profile Button */}
            <SidebarLink
              link={{
                label: session ? 'Profile' : 'Sign In',
                href: session ? '#profile' : '/auth/signin',
                icon: (
                  <IconUser className={cn(
                    "h-5 w-5 shrink-0",
                    isDarkMode ? "text-stone-300" : "text-gray-600"
                  )} />
                ),
              }}
              className={cn(
                "rounded-lg transition-colors",
                isDarkMode
                  ? "text-stone-300 hover:bg-stone-800"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content Area - spans full remaining width */}
      <main className="flex-1 w-full min-w-0">
        {children}
      </main>
    </div>
  );
}



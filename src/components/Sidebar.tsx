"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ChefHat, List, Info, RotateCcw, Download } from "lucide-react";
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { cn } from "@/lib/utils";

// Interface for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Interface defining the props for the Sidebar component
interface SidebarProps {
  activeTab: "generate" | "all-meals" | "about";
  onTabChange: (tab: "generate" | "all-meals" | "about") => void;
  onRefreshMeals: () => void;
  children: React.ReactNode;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  onRefreshMeals,
  children,
}: SidebarProps) {
  // State to control mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle tab change and close mobile menu
  const handleTabChange = (tab: "generate" | "all-meals" | "about") => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  // Configuration for menu items with their icons and labels
  const menuItems = [
    {
      id: "generate" as const,
      label: "Generate Meal",
      icon: ChefHat,
    },
    {
      id: "all-meals" as const,
      label: "All Meals",
      icon: List,
    },
    {
      id: "about" as const,
      label: "About",
      icon: Info,
    },
  ];

  // Get session data for authentication
  const { data: session } = useSession();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // PWA Installation states
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  // PWA Installation logic
  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      console.log('PWA install prompt available');
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsInstalled(true);
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Error showing install prompt:', error);
      setShowInstallPrompt(false);
    }
  };

  // Reusable sidebar content component for both desktop and mobile
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo/Brand section */}
      <div className={cn("px-6 py-6", isMobile && "mt-8")}>
        <h1 className="text-2xl font-bold text-stone-800">Whiskin</h1>
        <p className="text-sm text-stone-600 mt-1">Cook something great</p>
      </div>

      {/* User Profile/Sign In section */}
      <div className="px-4 mb-4">
        {!session?.user ? (
          <Link
            href="/auth/signin"
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-sm"
          >
            Sign In
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-stone-600 hover:text-stone-800 hover:bg-white/60 transition-colors"
            >
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-6 h-6 rounded-full border border-stone-200"
                />
              ) : (
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                </div>
              )}
              <span className="flex-1 text-left truncate">
                {session.user.name || session.user.email}
              </span>
              <X className={`h-3 w-3 transition-transform ${isUserDropdownOpen ? 'rotate-45' : 'rotate-0'}`} />
            </button>

            {isUserDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-stone-200 z-50">
                <div className="py-1">
                  <div className="px-3 py-2 text-xs text-stone-500 border-b border-stone-200">
                    <p className="font-medium text-stone-700">{session.user.name}</p>
                    <p className="truncate">{session.user.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-sm text-stone-600 hover:text-stone-800 hover:bg-stone-50 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => (isMobile ? handleTabChange(item.id) : onTabChange(item.id))}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-800 hover:bg-white/60"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}

        {/* Visual divider between navigation and actions */}
        <div className="border-t border-stone-200 my-4" />

        {/* Refresh meals action button */}
        <button
          onClick={onRefreshMeals}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-stone-600 hover:text-stone-800 hover:bg-white/60 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Refresh Meals
        </button>

        {/* Install PWA button - only show if app can be installed */}
        {showInstallPrompt && !isInstalled && (
          <button
            onClick={handleInstallClick}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4" />
            Install Whiskin
          </button>
        )}
      </nav>

      {/* Footer section with branding message */}
      <div className="px-6 py-4 border-t border-stone-200">
        <p className="text-xs text-stone-500">
          Made with ❤️ for healthy eating
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - hidden on mobile, fixed position */}
      <aside className="hidden md:flex fixed left-0 top-0 z-30 h-screen w-64 flex-col border-r border-stone-200 bg-white">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Toggle Button - only visible on mobile */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={cn(
          "md:hidden fixed top-4 left-4 z-[110] inline-flex items-center justify-center",
          "h-10 w-10 rounded-md border border-stone-200 bg-white shadow-lg",
          "text-sm font-medium text-stone-700 transition-colors",
          "hover:bg-stone-100 hover:text-stone-900",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50"
        )}
        aria-label="Toggle navigation menu"
      >
        {/* Toggle between hamburger and close icons */}
        {isMobileMenuOpen ? (
          <X className="h-4 w-4" />
        ) : (
          <Menu className="h-4 w-4" />
        )}
      </button>

      {/* Mobile Sidebar Overlay - only shown when mobile menu is open */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[100]">
          {/* Semi-transparent backdrop that closes menu when clicked */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Mobile Sidebar Panel */}
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-stone-200 bg-white shadow-xl">
            <SidebarContent isMobile />
          </aside>
        </div>
      )}

      {/* Main Content Area - offset by sidebar width on desktop */}
      <main className="md:ml-64 min-h-screen">
        {children}
      </main>
    </>
  );
}
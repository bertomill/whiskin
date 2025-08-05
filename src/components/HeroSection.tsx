import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

/**
 * HeroSection component - displays the main hero section with app icon, title, and subtitle
 * Adapts styling based on the current theme (dark/light mode)
 */
export default function HeroSection() {
  // Get the current theme state from context
  const { isDarkMode } = useTheme();
  
  return (
    <div className="text-center mb-6 md:mb-8 fade-in">
      {/* App icon container with circular background */}
      <div className={cn(
        "inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full mb-3 md:mb-4 border",
        isDarkMode
          ? "bg-white/10 border-white/20"
          : "bg-white/10 border-white/20"
      )}>
        {/* Whisk icon image */}
        <img 
          src="/icons/whisk-icon.png" 
          alt="Whisk icon" 
          className="w-8 h-8 md:w-10 md:h-10"
        />
      </div>
      
      {/* Main app title */}
      <h1 className={cn(
        "text-2xl md:text-3xl lg:text-5xl hero-title mb-2",
        isDarkMode ? "!text-white" : "!text-stone-800"
      )}>
        Whiskin
      </h1>
      
      {/* App subtitle/tagline */}
      <p className={cn(
        "text-base md:text-lg hero-subtitle max-w-2xl mx-auto",
        isDarkMode ? "!text-gray-200" : "!text-stone-600"
      )}>
        Cook up something great
      </p>
    </div>
  );
} 
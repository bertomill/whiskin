import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export default function HeroSection() {
  const { isDarkMode } = useTheme();
  return (
    <div className="text-center mb-6 fade-in">
      <div className={cn(
        "inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 border",
        isDarkMode
          ? "bg-white/10 border-white/20"
          : "bg-white/10 border-white/20"
      )}>
        <img 
          src="/icons/whisk-icon.png" 
          alt="Whisk icon" 
          className="w-10 h-10"
        />
      </div>
      <h1 className={cn(
        "text-3xl md:text-5xl hero-title mb-2",
        isDarkMode ? "!text-white" : "!text-stone-800"
      )}>
        Whiskin
      </h1>
      <p className={cn(
        "text-lg hero-subtitle max-w-2xl mx-auto",
        isDarkMode ? "!text-gray-200" : "!text-stone-600"
      )}>
        Cook up something great
      </p>
    </div>
  );
} 
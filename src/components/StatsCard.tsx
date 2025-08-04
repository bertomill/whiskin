import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  mealCount: number;
  isLoading: boolean;
}

export default function StatsCard({ mealCount, isLoading }: StatsCardProps) {
  const { isDarkMode } = useTheme();
  return (
    <div className="max-w-md mx-auto mb-4">
      <div className={cn(
        "backdrop-blur-lg rounded-2xl p-4 text-center border shadow-sm",
        isDarkMode
          ? "bg-stone-800/80 border-stone-700/50"
          : "bg-white/80 border-stone-200/50"
      )}>
        <div className={cn(
          "text-xl stats-number mb-1",
          isDarkMode ? "!text-white" : "!text-stone-800"
        )}>
          {isLoading ? 'Loading...' : mealCount}
        </div>
        <div className={cn(
          "text-sm font-medium tracking-wide",
          isDarkMode ? "!text-white" : "!text-stone-600"
        )}>meals available</div>
      </div>
    </div>
  );
} 
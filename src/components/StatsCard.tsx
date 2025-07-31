interface StatsCardProps {
  mealCount: number;
  isLoading: boolean;
}

export default function StatsCard({ mealCount, isLoading }: StatsCardProps) {
  return (
    <div className="max-w-md mx-auto mb-4">
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-4 text-center border border-gray-700/50">
        <div className="text-xl stats-number text-white mb-1">
          {isLoading ? 'Loading...' : mealCount}
        </div>
        <div className="text-sm text-gray-300 font-medium tracking-wide">meals available</div>
      </div>
    </div>
  );
} 
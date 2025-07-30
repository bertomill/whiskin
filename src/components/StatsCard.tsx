interface StatsCardProps {
  mealCount: number;
  isLoading: boolean;
}

export default function StatsCard({ mealCount, isLoading }: StatsCardProps) {
  return (
    <div className="max-w-md mx-auto mb-8">
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 text-center border border-gray-700/50">
        <div className="text-2xl stats-number text-white mb-2">
          {isLoading ? 'Loading...' : mealCount}
        </div>
        <div className="text-gray-300 font-medium tracking-wide">meals available</div>
      </div>
    </div>
  );
} 
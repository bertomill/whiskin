interface ActionButtonsProps {
  onGetRandomMeal: () => void;
  isLoading: boolean;
}

export default function ActionButtons({ onGetRandomMeal, isLoading }: ActionButtonsProps) {
  return (
    <div className="flex justify-center max-w-md mx-auto">
      <button 
        onClick={onGetRandomMeal}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white button-text py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 border border-blue-500/30 disabled:transform-none"
      >
        {isLoading ? (
          <>
            <svg className="loading-spinner inline w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </>
        ) : (
          'Get Random Meal'
        )}
      </button>
    </div>
  );
} 
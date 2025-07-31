'use client';

interface TabNavigationProps {
  activeTab: 'generate' | 'all-meals';
  onTabChange: (tab: 'generate' | 'all-meals') => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 z-50">
      <div className="flex items-center justify-around px-4 py-2">
        {/* Generate Tab */}
        <button
          onClick={() => onTabChange('generate')}
          className={`flex flex-col items-center justify-center py-3 px-4 rounded-lg transition-all duration-200 ${
            activeTab === 'generate'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <svg 
            className={`w-6 h-6 mb-1 ${activeTab === 'generate' ? 'text-blue-600' : 'text-gray-500'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
          <span className="text-xs font-medium">Generate</span>
        </button>

        {/* All Meals Tab */}
        <button
          onClick={() => onTabChange('all-meals')}
          className={`flex flex-col items-center justify-center py-3 px-4 rounded-lg transition-all duration-200 ${
            activeTab === 'all-meals'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <svg 
            className={`w-6 h-6 mb-1 ${activeTab === 'all-meals' ? 'text-blue-600' : 'text-gray-500'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          <span className="text-xs font-medium">All Meals</span>
        </button>
      </div>
    </div>
  );
} 
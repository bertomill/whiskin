export default function HeroSection() {
  return (
    <div className="text-center mb-12 fade-in">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6 border border-white/20">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      </div>
      <h1 className="text-4xl md:text-6xl hero-title text-white mb-4">
        MealBoost
      </h1>
      <p className="text-xl hero-subtitle text-gray-300 max-w-2xl mx-auto">
        Discover your next delicious meal from your Notion collection
      </p>
    </div>
  );
} 
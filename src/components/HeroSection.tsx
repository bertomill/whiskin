export default function HeroSection() {
  return (
    <div className="text-center mb-6 fade-in">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4 border border-white/20">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 180 180">
          {/* Whisk handle */}
          <rect x="75" y="60" width="8" height="80" rx="4" fill="currentColor" opacity="0.9"/>
          
          {/* Whisk wires with motion effect */}
          <path d="M75 60 Q85 50 95 60 Q105 70 115 60" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M75 65 Q85 55 95 65 Q105 75 115 65" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M75 70 Q85 60 95 70 Q105 80 115 70" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M75 75 Q85 65 95 75 Q105 85 115 75" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
          
          {/* Motion lines around whisk */}
          <path d="M70 50 Q80 45 90 50" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7"/>
          <path d="M100 50 Q110 45 120 50" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7"/>
          
          {/* Small food particles being whisked */}
          <circle cx="85" cy="85" r="2" fill="currentColor" opacity="0.8"/>
          <circle cx="95" cy="90" r="1.5" fill="currentColor" opacity="0.8"/>
          <circle cx="105" cy="85" r="1.5" fill="currentColor" opacity="0.8"/>
        </svg>
      </div>
      <h1 className="text-3xl md:text-5xl hero-title text-white mb-2">
        Whiskin
      </h1>
      <p className="text-lg hero-subtitle text-gray-300 max-w-2xl mx-auto">
        Cook up something great
      </p>
    </div>
  );
} 
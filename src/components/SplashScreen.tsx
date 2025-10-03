import { useEffect, useState } from "react";
import { Sparkles, Moon, Sun, Star } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 1000);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-cosmic-purple via-background to-cosmic-purple transition-opacity duration-1000 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center justify-center space-y-8 animate-fade-in">
        {/* Orbiting astrology symbols */}
        <div className="relative w-64 h-64">
          {/* Center sparkle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-16 h-16 text-celestial-gold animate-pulse-glow" />
          </div>

          {/* Orbiting Sun */}
          <div className="absolute inset-0 animate-[spin_8s_linear_infinite]">
            <Sun className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 text-accent drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
          </div>

          {/* Orbiting Moon */}
          <div className="absolute inset-0 animate-[spin_6s_linear_infinite_reverse]">
            <Moon className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
          </div>

          {/* Orbiting Stars */}
          <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
            <Star className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-secondary drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
          </div>
          <div className="absolute inset-0 animate-[spin_10s_linear_infinite_reverse]">
            <Star className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 text-celestial-gold drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
          </div>
        </div>

        {/* Brand text */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-5xl font-bold text-gradient-cosmic drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
            Built By Prothon
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-celestial-gold to-transparent" />
            <Sparkles className="w-5 h-5 text-celestial-gold animate-pulse" />
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-celestial-gold to-transparent" />
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-celestial-gold rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                opacity: Math.random() * 0.5 + 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

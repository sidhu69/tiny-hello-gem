import { Button } from "@/components/ui/button";
import { Stars, Sparkles, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Starfield background */}
      <div className="fixed inset-0 star-field opacity-40 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16 animate-in fade-in-50 duration-1000 min-h-[80vh] flex flex-col justify-center">
          <div className="inline-block animate-float mx-auto">
            <div className="relative">
              <Stars className="w-24 h-24 mx-auto text-primary" />
              <Sparkles className="w-10 h-10 absolute -top-2 -right-2 text-accent animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-gradient-cosmic">
            Cosmic Astrology AI
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Unlock the secrets of your celestial blueprint. Get personalized insights through 
            AI-powered astrology conversations tailored to your birth chart.
          </p>

          <div className="flex flex-wrap gap-4 justify-center text-sm md:text-base">
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary/20 border border-primary/30">
              <Sun className="w-5 h-5 text-primary" />
              Vedic & Western Systems
            </div>
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-secondary/20 border border-secondary/30">
              <Moon className="w-5 h-5 text-secondary" />
              Planetary Positions
            </div>
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-accent/20 border border-accent/30">
              <Sparkles className="w-5 h-5 text-accent" />
              AI Chat Assistant
            </div>
          </div>

          <div className="pt-8">
            <Button
              onClick={() => navigate("/form")}
              size="lg"
              className="text-xl px-12 py-6 h-auto animate-pulse-glow"
            >
              Start Your Journey
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

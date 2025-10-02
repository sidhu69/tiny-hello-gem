import { useState } from "react";
import { AstrologyForm } from "@/components/AstrologyForm";
import { AstrologyReport } from "@/components/AstrologyReport";
import { Sparkles, Stars } from "lucide-react";

const Index = () => {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Starfield background */}
      <div className="fixed inset-0 star-field opacity-40 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16 animate-in fade-in-50 duration-1000">
          <div className="inline-block animate-float">
            <div className="relative">
              <Stars className="w-20 h-20 mx-auto text-primary" />
              <Sparkles className="w-8 h-8 absolute -top-2 -right-2 text-accent animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gradient-cosmic">
            Cosmic Astrology AI
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Unlock the secrets of your celestial blueprint. Discover profound insights about your personality, 
            relationships, career, and health through ancient astrological wisdom powered by AI.
          </p>

          <div className="flex flex-wrap gap-4 justify-center text-sm md:text-base">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Vedic & Western Systems
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              Planetary Positions
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              AI-Powered Insights
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <AstrologyForm onResults={setReportData} onLoading={setIsLoading} />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center space-y-4 animate-in fade-in-50">
            <div className="inline-block animate-spin">
              <Stars className="w-16 h-16 text-primary" />
            </div>
            <p className="text-xl text-muted-foreground">
              Consulting the stars and calculating your cosmic blueprint...
            </p>
          </div>
        )}

        {/* Report Section */}
        {!isLoading && reportData && (
          <div className="max-w-6xl mx-auto">
            <AstrologyReport data={reportData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

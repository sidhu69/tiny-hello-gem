import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AstrologyForm } from "@/components/AstrologyForm";
import { Stars, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Form = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleResults = (data: any) => {
    // Store astrology data in sessionStorage and navigate to chat
    sessionStorage.setItem("astrologyData", JSON.stringify(data));
    navigate("/chat");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Starfield background */}
      <div className="fixed inset-0 star-field opacity-40 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        {/* Header */}
        <div className="text-center space-y-6 mb-12 animate-in fade-in-50 duration-1000">
          <div className="inline-block animate-float">
            <div className="relative">
              <Stars className="w-16 h-16 mx-auto text-primary" />
              <Sparkles className="w-6 h-6 absolute -top-1 -right-1 text-accent animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gradient-cosmic">
            Your Birth Details
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Enter your birth information to calculate your cosmic blueprint
          </p>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <AstrologyForm onResults={handleResults} onLoading={setIsLoading} />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center space-y-4 mt-12 animate-in fade-in-50">
            <div className="inline-block animate-spin">
              <Stars className="w-16 h-16 text-primary" />
            </div>
            <p className="text-xl text-muted-foreground">
              Consulting the stars and calculating your cosmic blueprint...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;

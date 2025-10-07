import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AstrologyReport } from "@/components/AstrologyReport";

const Chart = () => {
  const navigate = useNavigate();
  const [astrologyData, setAstrologyData] = useState<any>(null);
  const [language, setLanguage] = useState("english");

  useEffect(() => {
    const data = sessionStorage.getItem("astrologyData");
    const lang = sessionStorage.getItem("language");
    
    if (!data) {
      navigate("/form");
      return;
    }
    
    setAstrologyData(JSON.parse(data));
    setLanguage(lang || "english");
  }, [navigate]);

  if (!astrologyData) return null;

  const isHinglish = language === "hinglish";

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Starfield background */}
      <div className="fixed inset-0 star-field opacity-40 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with navigation */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {isHinglish ? "Dashboard" : "Back to Dashboard"}
          </Button>
          
          <Button
            onClick={() => navigate("/chat")}
            className="gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            {isHinglish ? "Chat Karo" : "Open Chat"}
          </Button>
        </div>

        {/* Chart Display */}
        <AstrologyReport data={astrologyData} language={language} />
      </div>
    </div>
  );
};

export default Chart;

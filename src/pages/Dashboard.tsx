import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, LineChart, Stars, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("english");
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem("astrologyData");
    const lang = sessionStorage.getItem("language");
    
    if (!data) {
      navigate("/form");
      return;
    }
    
    setHasData(true);
    setLanguage(lang || "english");
  }, [navigate]);

  if (!hasData) return null;

  const isHinglish = language === "hinglish";

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
            onClick={() => navigate("/form")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {isHinglish ? "Peeche Jao" : "Back to Form"}
          </Button>
        </div>

        {/* Header */}
        <div className="text-center space-y-6 mb-16 animate-in fade-in-50 duration-1000">
          <div className="inline-block animate-float">
            <Stars className="w-20 h-20 mx-auto text-primary" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gradient-cosmic">
            {isHinglish ? "Apka Kundli Taiyar Hai!" : "Your Chart is Ready!"}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            {isHinglish 
              ? "Ab aap chat kar sakte ho ya apna detailed kundli dekh sakte ho"
              : "Chat with your AI astrologer or view your detailed birth chart"}
          </p>
        </div>

        {/* Options */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <Card 
            className="p-8 bg-card/50 backdrop-blur-lg border-border/50 hover:border-primary/50 transition-all cursor-pointer group"
            onClick={() => navigate("/chat")}
          >
            <div className="text-center space-y-6">
              <div className="inline-block p-6 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-all">
                <MessageCircle className="w-16 h-16 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-gradient-cosmic">
                {isHinglish ? "Chat Karo" : "Start Chat"}
              </h2>
              <p className="text-lg text-muted-foreground">
                {isHinglish 
                  ? "Apne jyotishi se baat karo aur jawaab paao" 
                  : "Talk to your AI astrologer and get personalized guidance"}
              </p>
              <Button size="lg" className="w-full">
                {isHinglish ? "Chat Shuru Karo" : "Open Chat"}
              </Button>
            </div>
          </Card>

          <Card 
            className="p-8 bg-card/50 backdrop-blur-lg border-border/50 hover:border-primary/50 transition-all cursor-pointer group"
            onClick={() => navigate("/chart")}
          >
            <div className="text-center space-y-6">
              <div className="inline-block p-6 rounded-full bg-secondary/20 group-hover:bg-secondary/30 transition-all">
                <LineChart className="w-16 h-16 text-secondary" />
              </div>
              <h2 className="text-3xl font-bold text-gradient-gold">
                {isHinglish ? "Kundli Dekho" : "View Chart"}
              </h2>
              <p className="text-lg text-muted-foreground">
                {isHinglish 
                  ? "Apni poori janam kundli aur graho ki sthiti dekho" 
                  : "See your complete birth chart and planetary positions"}
              </p>
              <Button size="lg" variant="secondary" className="w-full">
                {isHinglish ? "Kundli Dikhao" : "View Chart"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

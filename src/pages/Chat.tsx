import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Stars, Send, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateAstrologyResponse } from "@/lib/browserAI";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [astrologyData, setAstrologyData] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load astrology data from sessionStorage
    const storedData = sessionStorage.getItem("astrologyData");
    if (!storedData) {
      toast({
        title: "No Data Found",
        description: "Please complete the birth details form first.",
        variant: "destructive",
      });
      navigate("/form");
      return;
    }
    
    const data = JSON.parse(storedData);
    setAstrologyData(data);
    
    // Initialize AI and show welcome message
    const initAI = async () => {
      try {
        setMessages([{
          role: "assistant",
          content: "🤖 Loading AI model... This takes ~30 seconds on first load (models are cached for future visits)"
        }]);
        
        const { initializeAI } = await import("@/lib/browserAI");
        await initializeAI();
        
        setMessages([{
          role: "assistant",
          content: `Welcome! I'm your personal AI astrologer running directly in your browser. I've analyzed your birth chart (${data.systemType === "vedic" ? "Vedic" : "Western"} system). Your ascendant is ${data.ascendant}. Ask me anything!`
        }]);
      } catch (error) {
        console.error("AI initialization error:", error);
        toast({
          title: "AI Loading Error",
          description: "Falling back to basic mode. Your browser may not support WebGPU.",
          variant: "destructive",
        });
        setMessages([{
          role: "assistant",
          content: `Hello! I have your birth chart loaded. Ask me about your personality, relationships, or career based on your ${data.systemType} chart.`
        }]);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initAI();
  }, [navigate, toast]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !astrologyData || isInitializing) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await generateAstrologyResponse(
        input,
        astrologyData,
        messages
      );

      const assistantMessage: Message = {
        role: "assistant",
        content: response,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "AI is still loading or encountered an error. Please wait and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!astrologyData) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Starfield background */}
      <div className="fixed inset-0 star-field opacity-40 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/form")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            New Reading
          </Button>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-2">
              <Stars className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-gradient-cosmic">
                Your Cosmic Guide
              </h1>
              <Sparkles className="w-6 h-6 text-accent animate-pulse" />
            </div>
            <p className="text-muted-foreground">
              Ask anything about your life and destiny
            </p>
          </div>
        </div>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col bg-card/50 backdrop-blur-lg border-border/50 overflow-hidden">
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin">
                        <Stars className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-muted-foreground">Consulting the cosmos...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isInitializing ? "AI is loading..." : "Ask about your personality, career, love life..."}
                className="flex-1 bg-input/50 border-border/50"
                disabled={isLoading || isInitializing}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || isInitializing || !input.trim()}
                size="icon"
              >
                {isInitializing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chat;

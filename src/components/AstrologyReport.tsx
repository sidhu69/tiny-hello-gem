import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sun, Moon, Heart, TrendingUp, Activity, Star } from "lucide-react";

interface AstrologyReportProps {
  data: any;
}

export const AstrologyReport = ({ data }: AstrologyReportProps) => {
  if (!data) return null;

  const { planets, ascendant, interpretations, systemType } = data;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-700">
      <Card className="p-8 bg-card/50 backdrop-blur-lg border-border/50 cosmic-glow">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gradient-cosmic">Your Cosmic Blueprint</h2>
          <p className="text-muted-foreground text-lg">
            {systemType === "vedic" ? "Vedic (Sidereal)" : "Western (Tropical)"} Astrology System
          </p>
          <div className="pt-4">
            <Badge variant="outline" className="text-lg px-6 py-2 bg-primary/20 border-primary">
              <Star className="w-4 h-4 mr-2" />
              Ascendant: {ascendant}
            </Badge>
          </div>
        </div>
      </Card>

      <Card className="p-8 bg-card/50 backdrop-blur-lg border-border/50">
        <h3 className="text-2xl font-bold mb-6 text-gradient-gold flex items-center gap-2">
          <Sun className="w-6 h-6" />
          Planetary Positions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(planets).map(([planet, data]: [string, any]) => (
            <Card key={planet} className="p-4 bg-background/50 border-border/30">
              <div className="space-y-2">
                <h4 className="font-semibold text-lg capitalize">{planet}</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Sign: <span className="text-foreground font-medium">{data.sign}</span></p>
                  <p>Degree: <span className="text-foreground font-medium">{data.degree}°</span></p>
                  <p>House: <span className="text-foreground font-medium">{data.house}</span></p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-8 bg-card/50 backdrop-blur-lg border-border/50">
        <h3 className="text-2xl font-bold mb-6 text-gradient-cosmic flex items-center gap-2">
          <Moon className="w-6 h-6" />
          Life Insights
        </h3>
        
        <Tabs defaultValue="personality" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-background/50">
            <TabsTrigger value="personality">
              <Star className="w-4 h-4 mr-2" />
              Personality
            </TabsTrigger>
            <TabsTrigger value="relationships">
              <Heart className="w-4 h-4 mr-2" />
              Love
            </TabsTrigger>
            <TabsTrigger value="career">
              <TrendingUp className="w-4 h-4 mr-2" />
              Career
            </TabsTrigger>
            <TabsTrigger value="health">
              <Activity className="w-4 h-4 mr-2" />
              Health
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personality" className="space-y-4">
            <div className="prose prose-invert max-w-none">
              <p className="text-foreground leading-relaxed">{interpretations.personality}</p>
            </div>
          </TabsContent>

          <TabsContent value="relationships" className="space-y-4">
            <div className="prose prose-invert max-w-none">
              <p className="text-foreground leading-relaxed">{interpretations.relationships}</p>
            </div>
          </TabsContent>

          <TabsContent value="career" className="space-y-4">
            <div className="prose prose-invert max-w-none">
              <p className="text-foreground leading-relaxed">{interpretations.career}</p>
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <div className="prose prose-invert max-w-none">
              <p className="text-foreground leading-relaxed">{interpretations.health}</p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

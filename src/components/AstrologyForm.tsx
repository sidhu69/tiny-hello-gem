import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TimeInput } from "./TimeInput";
import { calculateAccurateBirthChart, validateBirthDetails, type BirthDetails } from "@/lib/accurateChartCalculator";

interface AstrologyFormProps {
  onResults: (data: any) => void;
  onLoading: (loading: boolean) => void;
}

// Geocoding function to convert city name to coordinates
const getCityCoordinates = async (cityName: string): Promise<{ latitude: number; longitude: number } | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

export const AstrologyForm = ({ onResults, onLoading }: AstrologyFormProps) => {
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [systemType, setSystemType] = useState<"vedic" | "western">("vedic");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!birthDate || !birthTime || !birthPlace) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to generate your astrological report.",
        variant: "destructive",
      });
      return;
    }

    onLoading(true);

    try {
      // Step 1: Get coordinates for birth place
      toast({
        title: "Finding location...",
        description: `Looking up coordinates for ${birthPlace}`,
      });

      const coordinates = await getCityCoordinates(birthPlace);
      
      if (!coordinates) {
        throw new Error("Could not find coordinates for the specified birth place. Please try with a more specific location (e.g., 'New York, USA')");
      }

      // Step 2: Parse date and time
      const [year, month, day] = birthDate.split('-').map(Number);
      const [hours, minutes] = birthTime.split(':').map(Number);

      const birthDetails: BirthDetails = {
        year,
        month,
        day,
        hour: hours,
        minute: minutes,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      };

      // Step 3: Validate input
      const validationErrors = validateBirthDetails(birthDetails);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Step 4: Calculate accurate chart
      toast({
        title: "Calculating chart...",
        description: "Performing astronomical calculations",
      });

      const chartData = calculateAccurateBirthChart(birthDetails);

      // Add system type and birth place info
      const finalData = {
        ...chartData,
        systemType,
        birthPlace,
        birthDate,
        birthTime,
        coordinates,
      };

      console.log('✅ Calculated Chart:', finalData);
      console.log('📍 Ascendant:', finalData.ascendant);

      onResults(finalData);
      
      toast({
        title: "✨ Chart Generated",
        description: `Your ${finalData.ascendant} rising chart is ready!`,
      });

    } catch (error: any) {
      console.error("Error generating chart:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate chart. Please check your details and try again.",
        variant: "destructive",
      });
    } finally {
      onLoading(false);
    }
  };

  return (
    <Card className="p-8 bg-card/50 backdrop-blur-lg border-border/50 cosmic-glow">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="system" className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Astrology System
          </Label>
          <div className="flex gap-4">
            <Button
              type="button"
              variant={systemType === "vedic" ? "default" : "outline"}
              onClick={() => setSystemType("vedic")}
              className="flex-1"
            >
              Vedic (Sidereal)
            </Button>
            <Button
              type="button"
              variant={systemType === "western" ? "default" : "outline"}
              onClick={() => setSystemType("western")}
              className="flex-1"
            >
              Western (Tropical)
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate" className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Birth Date
          </Label>
          <Input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="bg-input/50 border-border/50"
            required
          />
        </div>

        <TimeInput value={birthTime} onChange={setBirthTime} />

        <div className="space-y-2">
          <Label htmlFor="birthPlace" className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            Birth Place
          </Label>
          <Input
            id="birthPlace"
            type="text"
            value={birthPlace}
            onChange={(e) => setBirthPlace(e.target.value)}
            placeholder="City, Country (e.g., Mumbai, India)"
            className="bg-input/50 border-border/50"
            required
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full text-lg font-semibold animate-pulse-glow"
        >
          Generate Cosmic Blueprint
        </Button>
      </form>
    </Card>
  );
};

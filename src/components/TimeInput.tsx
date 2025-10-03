import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface TimeInputProps {
  value: string;
  onChange: (time: string) => void;
}

export const TimeInput = ({ value, onChange }: TimeInputProps) => {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");

  const handleTimeChange = (newHour: string, newMinute: string, newPeriod: "AM" | "PM") => {
    if (newHour && newMinute) {
      let hour24 = parseInt(newHour);
      if (newPeriod === "PM" && hour24 !== 12) {
        hour24 += 12;
      } else if (newPeriod === "AM" && hour24 === 12) {
        hour24 = 0;
      }
      const timeString = `${hour24.toString().padStart(2, "0")}:${newMinute.padStart(2, "0")}`;
      onChange(timeString);
    }
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val) {
      const num = parseInt(val);
      if (num >= 1 && num <= 12) {
        setHour(val);
        handleTimeChange(val, minute, period);
      }
    } else {
      setHour("");
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val) {
      const num = parseInt(val);
      if (num >= 0 && num <= 59) {
        setMinute(val);
        handleTimeChange(hour, val, period);
      }
    } else {
      setMinute("");
    }
  };

  const handlePeriodChange = (newPeriod: "AM" | "PM") => {
    setPeriod(newPeriod);
    handleTimeChange(hour, minute, newPeriod);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="birthTime" className="text-lg flex items-center gap-2">
        <Clock className="w-5 h-5 text-secondary" />
        Birth Time
      </Label>
      <div className="flex gap-2 items-center">
        <Input
          type="text"
          placeholder="HH"
          value={hour}
          onChange={handleHourChange}
          className="bg-input/50 border-border/50 w-16 text-center text-lg"
          maxLength={2}
          required
        />
        <span className="text-2xl font-bold text-muted-foreground">:</span>
        <Input
          type="text"
          placeholder="MM"
          value={minute}
          onChange={handleMinuteChange}
          className="bg-input/50 border-border/50 w-16 text-center text-lg"
          maxLength={2}
          required
        />
        <div className="flex gap-1 ml-2">
          <Button
            type="button"
            variant={period === "AM" ? "default" : "outline"}
            onClick={() => handlePeriodChange("AM")}
            className="px-4 font-semibold"
          >
            AM
          </Button>
          <Button
            type="button"
            variant={period === "PM" ? "default" : "outline"}
            onClick={() => handlePeriodChange("PM")}
            className="px-4 font-semibold"
          >
            PM
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Select hours (1-12), minutes (00-59), and AM/PM
      </p>
    </div>
  );
};

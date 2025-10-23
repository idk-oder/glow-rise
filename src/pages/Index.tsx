import { useState, useEffect } from "react";
import GlowingBulb from "@/components/GlowingBulb";
import DigitalClock from "@/components/DigitalClock";
import AlarmTimePicker from "@/components/AlarmTimePicker";
import { Sunrise } from "lucide-react";

const Index = () => {
  const [alarmTime, setAlarmTime] = useState("06:30");
  const [brightness, setBrightness] = useState(0);

  useEffect(() => {
    const calculateBrightness = () => {
      const now = new Date();
      const [alarmHours, alarmMinutes] = alarmTime.split(":").map(Number);
      
      // Create alarm date for today
      const alarm = new Date();
      alarm.setHours(alarmHours, alarmMinutes, 0, 0);
      
      // If alarm is in the past, set it for tomorrow
      if (alarm < now) {
        alarm.setDate(alarm.getDate() + 1);
      }
      
      // Calculate time difference in minutes
      const diffMs = alarm.getTime() - now.getTime();
      const diffMinutes = diffMs / (1000 * 60);
      
      // Start glowing 30 minutes before alarm
      const glowStartMinutes = 30;
      
      if (diffMinutes <= 0) {
        // Alarm has passed or is now - full brightness
        return 100;
      } else if (diffMinutes > glowStartMinutes) {
        // Too early - minimal brightness
        return 5;
      } else {
        // Gradually increase brightness from 5% to 100%
        const progress = 1 - (diffMinutes / glowStartMinutes);
        return 5 + (progress * 95);
      }
    };

    // Calculate immediately
    setBrightness(calculateBrightness());

    // Update every second
    const interval = setInterval(() => {
      setBrightness(calculateBrightness());
    }, 1000);

    return () => clearInterval(interval);
  }, [alarmTime]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex flex-col items-center justify-center p-8 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-12">
        {/* Header */}
        <div className="text-center space-y-3 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sunrise className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-light text-foreground tracking-wide">Wake-Up Light</h1>
          </div>
          <p className="text-sm text-muted-foreground font-light tracking-wide">
            Glowing to wake you up gently
          </p>
        </div>

        {/* Current Time */}
        <DigitalClock />

        {/* Glowing Bulb */}
        <div className="my-8">
          <GlowingBulb brightness={brightness} />
        </div>

        {/* Brightness Indicator */}
        <div className="w-full max-w-md space-y-3">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Brightness</span>
            <span className="font-mono text-primary">{Math.round(brightness)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-secondary via-primary to-accent rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${brightness}%` }}
            />
          </div>
        </div>

        {/* Alarm Time Picker */}
        <AlarmTimePicker alarmTime={alarmTime} onAlarmChange={setAlarmTime} />

        {/* Info Text */}
        <div className="text-center text-xs text-muted-foreground/80 max-w-md animate-fade-in">
          <p>The light will gradually brighten 30 minutes before your alarm time</p>
        </div>
      </div>
    </div>
  );
};

export default Index;

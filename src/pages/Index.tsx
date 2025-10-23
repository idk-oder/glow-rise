import { useState, useEffect } from "react";
import GlowingBulb from "@/components/GlowingBulb";
import DigitalClock from "@/components/DigitalClock";
import AlarmTimePicker from "@/components/AlarmTimePicker";
import { Sunrise, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import bedroomScene from "@/assets/bedroom-scene.jpg";

const Index = () => {
  const [alarmTime, setAlarmTime] = useState("06:30");
  const [brightness, setBrightness] = useState(0);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);
  const [isSnoozed, setIsSnoozed] = useState(false);

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
      
      // Calculate time difference in seconds
      const diffMs = alarm.getTime() - now.getTime();
      const diffSeconds = diffMs / 1000;
      
      // Start glowing 30 seconds before alarm
      const glowStartSeconds = 30;
      
      if (diffSeconds <= 0) {
        // Alarm has passed or is now - full brightness and ring alarm
        setIsAlarmRinging(true);
        return 100;
      } else if (diffSeconds > glowStartSeconds) {
        // Too early - minimal brightness
        setIsAlarmRinging(false);
        return 5;
      } else {
        // Gradually increase brightness from 5% to 100%
        const progress = 1 - (diffSeconds / glowStartSeconds);
        setIsAlarmRinging(false);
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
  }, [alarmTime, isSnoozed]);

  const handleSnooze = () => {
    const now = new Date();
    const snoozeTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
    const hours = snoozeTime.getHours().toString().padStart(2, "0");
    const minutes = snoozeTime.getMinutes().toString().padStart(2, "0");
    setAlarmTime(`${hours}:${minutes}`);
    setIsAlarmRinging(false);
    setIsSnoozed(true);
    setBrightness(5);
  };

  const handleDismiss = () => {
    setIsAlarmRinging(false);
    setBrightness(5);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden relative">
      {/* Bedroom background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: `url(${bedroomScene})`,
          filter: `brightness(${0.3 + (brightness / 100) * 0.4})`,
        }}
      />
      
      {/* Dark overlay for night effect */}
      <div 
        className="absolute inset-0 bg-black transition-opacity duration-1000"
        style={{ opacity: 0.7 - (brightness / 100) * 0.5 }}
      />

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

        {/* Wall-mounted Glowing Bulb */}
        <div className="my-8 relative">
          {/* Wall mount effect */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-8 bg-muted/30 rounded-t-lg backdrop-blur-sm border border-border/20" />
          <GlowingBulb brightness={brightness} />
        </div>

        {/* Alarm Controls */}
        {isAlarmRinging && (
          <div className="animate-fade-in flex gap-4 my-4">
            <Button
              onClick={handleSnooze}
              variant="outline"
              size="lg"
              className="bg-card/90 backdrop-blur-sm border-primary/30 hover:bg-primary/20"
            >
              <Bell className="w-4 h-4 mr-2" />
              Snooze (5 min)
            </Button>
            <Button
              onClick={handleDismiss}
              variant="default"
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              Dismiss Alarm
            </Button>
          </div>
        )}

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
        <div className="text-center text-xs text-foreground/60 max-w-md animate-fade-in backdrop-blur-sm bg-card/20 px-4 py-2 rounded-lg">
          <p>The light will gradually brighten 30 seconds before your alarm time</p>
        </div>
      </div>
    </div>
  );
};

export default Index;

import { useState, useEffect } from "react";
import GlowingBulb from "@/components/GlowingBulb";
import DigitalClock from "@/components/DigitalClock";
import AlarmTimePicker from "@/components/AlarmTimePicker";
import AnimatedPerson from "@/components/AnimatedPerson";
import { Sunrise, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [alarmTime, setAlarmTime] = useState("06:30");
  const [brightness, setBrightness] = useState(0);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);
  const [isSnoozed, setIsSnoozed] = useState(false);
  const [isLightOn, setIsLightOn] = useState(false);

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
        setIsLightOn(true);
        return 100;
      } else if (diffSeconds > glowStartSeconds && !isLightOn) {
        // Too early - minimal brightness
        setIsAlarmRinging(false);
        return 5;
      } else if (isLightOn) {
        // Keep light on after alarm until stopped
        return 100;
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
  }, [alarmTime, isSnoozed, isLightOn]);

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

  const handleStop = () => {
    setIsAlarmRinging(false);
    setIsLightOn(false);
    setBrightness(5);
  };

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Bedroom scene - dark background */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `linear-gradient(to bottom, hsl(220 20% ${10 + brightness / 5}%), hsl(220 20% ${5 + brightness / 10}%))`,
        }}
      />
      
      {/* Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-muted/20 to-transparent" />
      
      {/* Bed frame */}
      <div className="absolute bottom-0 left-1/4 w-1/2 h-20 bg-muted/40 rounded-t-lg" />
      
      {/* Animated person in bed */}
      <AnimatedPerson brightness={brightness} />

      {/* Wall-mounted Glowing Bulb on the right side */}
      <div className="absolute top-32 right-24 z-20">
        {/* Wall mount fixture */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-10 bg-muted/40 rounded-t-lg border border-border/30" />
        {/* Wall bracket arm */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-8 bg-muted/50" />
        <GlowingBulb brightness={brightness} />
      </div>

      {/* Control panel overlay */}
      <div className="relative z-30 w-full max-w-2xl mx-auto pt-8 px-8 flex flex-col items-center gap-8">
        {/* Header */}
        <div className="text-center space-y-3 animate-fade-in bg-background/80 backdrop-blur-sm px-6 py-4 rounded-lg">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sunrise className="w-8 h-8 text-amber-400" />
            <h1 className="text-5xl font-bold tracking-wider bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(251,191,36,0.5)] animate-pulse">
              GLOW RISE
            </h1>
          </div>
          <p className="text-sm text-muted-foreground font-light tracking-wide">
            Glowing to wake you up gently
          </p>
        </div>

        {/* Current Time */}
        <DigitalClock />

        {/* Stop Button - Appears when alarm rings and stays until clicked */}
        {isLightOn && (
          <div className="animate-fade-in my-6">
            <Button
              onClick={handleStop}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black text-2xl px-16 py-8 h-auto rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.8)] hover:shadow-[0_0_70px_rgba(239,68,68,1)] transition-all duration-300 border-4 border-white animate-pulse uppercase tracking-wider"
            >
              ⏹ STOP ALARM
            </Button>
          </div>
        )}

        {/* Alarm Controls */}
        {isAlarmRinging && (
          <div className="animate-fade-in flex gap-4 my-4 bg-background/90 backdrop-blur-sm px-6 py-4 rounded-lg">
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
        <div className="w-full max-w-md space-y-3 bg-background/80 backdrop-blur-sm px-6 py-4 rounded-lg">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Brightness</span>
            <span className="font-mono text-primary">{Math.round(brightness)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-sunrise-yellow via-sunrise-orange to-sunrise-glow rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(251,191,36,0.5)]"
              style={{ width: `${brightness}%` }}
            />
          </div>
        </div>

        {/* Alarm Time Picker */}
        <div className="bg-background/80 backdrop-blur-sm px-6 py-4 rounded-lg">
          <AlarmTimePicker alarmTime={alarmTime} onAlarmChange={setAlarmTime} />
        </div>
      </div>
    </div>
  );
};

export default Index;

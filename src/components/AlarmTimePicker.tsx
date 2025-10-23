import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface AlarmTimePickerProps {
  alarmTime: string;
  onAlarmChange: (time: string) => void;
}

const AlarmTimePicker = ({ alarmTime, onAlarmChange }: AlarmTimePickerProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <Clock className="w-5 h-5 text-primary" />
        <span className="text-sm text-muted-foreground font-medium">Alarm Time</span>
      </div>
      
      {isEditing ? (
        <div className="flex gap-3 items-center">
          <input
            type="time"
            value={alarmTime}
            onChange={(e) => onAlarmChange(e.target.value)}
            className="px-4 py-3 text-2xl font-mono rounded-xl border-2 border-primary/20 bg-card focus:border-primary focus:outline-none transition-all"
            autoFocus
          />
          <Button
            onClick={() => setIsEditing(false)}
            variant="default"
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            Done
          </Button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="group px-8 py-4 text-4xl font-mono font-light rounded-2xl bg-card hover:bg-card/80 border-2 border-border hover:border-primary/40 transition-all shadow-soft hover:shadow-lg"
        >
          <span className="text-foreground group-hover:text-primary transition-colors">
            {alarmTime}
          </span>
        </button>
      )}
    </div>
  );
};

export default AlarmTimePicker;

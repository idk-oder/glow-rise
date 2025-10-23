import { useEffect, useState } from "react";

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  return (
    <div className="flex items-center justify-center gap-1 animate-fade-in">
      <div className="font-mono text-6xl font-light tracking-wider text-foreground/90">
        {hours}
        <span className="animate-glow-pulse text-primary/60">:</span>
        {minutes}
        <span className="text-3xl text-muted-foreground/60 ml-1">
          {seconds}
        </span>
      </div>
    </div>
  );
};

export default DigitalClock;

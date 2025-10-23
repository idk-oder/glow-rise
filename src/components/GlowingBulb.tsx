import { useEffect, useState } from "react";

interface GlowingBulbProps {
  brightness: number; // 0-100
}

const GlowingBulb = ({ brightness }: GlowingBulbProps) => {
  const [pulseOpacity, setPulseOpacity] = useState(0.6);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseOpacity((prev) => (prev === 0.6 ? 1 : 0.6));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Calculate glow intensity
  const glowIntensity = brightness / 100;
  const shadowSpread = 20 + (brightness / 100) * 80; // 20-100px
  const shadowBlur = 40 + (brightness / 100) * 100; // 40-140px
  
  // Dynamic color based on brightness
  const getBulbColor = () => {
    if (brightness < 30) return "hsl(0 0% 95%)"; // Off/very dim
    if (brightness < 60) return "hsl(40 100% 85%)"; // Dim warm
    if (brightness < 85) return "hsl(35 100% 70%)"; // Medium glow
    return "hsl(30 100% 60%)"; // Bright warm
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, hsl(30 100% 70% / ${glowIntensity * 0.2}), transparent)`,
          transform: `scale(${1 + glowIntensity * 0.5})`,
          opacity: pulseOpacity,
        }}
      />
      
      {/* Middle glow */}
      <div
        className="absolute rounded-full transition-all duration-1000 ease-out"
        style={{
          width: "200px",
          height: "200px",
          background: `radial-gradient(circle, hsl(35 100% 75% / ${glowIntensity * 0.4}), transparent 70%)`,
          opacity: pulseOpacity * 0.8,
        }}
      />

      {/* Main bulb */}
      <div
        className="relative z-10 rounded-full transition-all duration-1000 ease-out"
        style={{
          width: "160px",
          height: "160px",
          backgroundColor: getBulbColor(),
          boxShadow: `
            0 0 ${shadowBlur}px ${shadowSpread}px hsl(35 100% 65% / ${glowIntensity * 0.6}),
            inset 0 -20px 40px hsl(0 0% 100% / ${glowIntensity * 0.3}),
            inset 0 20px 40px hsl(30 100% 50% / ${glowIntensity * 0.2})
          `,
        }}
      >
        {/* Highlight effect */}
        <div
          className="absolute top-8 left-8 rounded-full transition-opacity duration-1000"
          style={{
            width: "60px",
            height: "60px",
            background: "radial-gradient(circle, hsl(0 0% 100% / 0.6), transparent)",
            opacity: glowIntensity * 0.7,
          }}
        />
      </div>

      {/* Filament simulation for higher brightness */}
      {brightness > 50 && (
        <div
          className="absolute z-20 transition-opacity duration-1000"
          style={{
            opacity: (brightness - 50) / 50,
          }}
        >
          <div className="relative">
            <div
              className="w-1 h-16 bg-gradient-to-b from-transparent via-primary to-transparent rounded-full"
              style={{
                boxShadow: `0 0 20px 4px hsl(30 100% 60% / ${glowIntensity})`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GlowingBulb;

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
  
  // Dynamic color based on brightness - cooler white tones for waking up
  const getBulbColor = () => {
    if (brightness < 30) return "hsl(0 0% 90%)"; // Off/very dim
    if (brightness < 60) return "hsl(200 20% 92%)"; // Dim cool white
    if (brightness < 85) return "hsl(200 30% 95%)"; // Medium bright white
    return "hsl(200 40% 98%)"; // Bright energizing white
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings - cool white */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, hsl(200 40% 90% / ${glowIntensity * 0.3}), transparent)`,
          transform: `scale(${1 + glowIntensity * 0.5})`,
          opacity: pulseOpacity,
        }}
      />
      
      {/* Middle glow - bright white */}
      <div
        className="absolute rounded-full transition-all duration-1000 ease-out"
        style={{
          width: "200px",
          height: "200px",
          background: `radial-gradient(circle, hsl(200 50% 95% / ${glowIntensity * 0.5}), transparent 70%)`,
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
            0 0 ${shadowBlur}px ${shadowSpread}px hsl(200 50% 90% / ${glowIntensity * 0.7}),
            inset 0 -20px 40px hsl(200 50% 100% / ${glowIntensity * 0.4}),
            inset 0 20px 40px hsl(200 40% 80% / ${glowIntensity * 0.2})
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
              className="w-1 h-16 bg-gradient-to-b from-transparent via-white to-transparent rounded-full"
              style={{
                boxShadow: `0 0 20px 4px hsl(200 50% 95% / ${glowIntensity})`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GlowingBulb;

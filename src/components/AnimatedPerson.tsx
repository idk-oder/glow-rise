interface AnimatedPersonProps {
  brightness: number; // 0-100
}

const AnimatedPerson = ({ brightness }: AnimatedPersonProps) => {
  // Eyes open gradually based on brightness
  const eyeOpenness = Math.min(brightness / 100, 1);
  
  return (
    <div className="absolute bottom-0 left-1/4 w-64 h-64 transition-all duration-1000">
      {/* Person in bed */}
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Pillow */}
        <ellipse cx="100" cy="120" rx="60" ry="30" fill="hsl(0 0% 85%)" />
        
        {/* Head */}
        <circle cx="100" cy="100" r="35" fill="hsl(30 40% 70%)" />
        
        {/* Hair */}
        <path
          d="M 70 85 Q 65 70, 75 65 Q 85 60, 100 62 Q 115 60, 125 65 Q 135 70, 130 85"
          fill="hsl(30 20% 30%)"
        />
        
        {/* Left Eye */}
        <g className="transition-all duration-1000">
          {/* Eye socket */}
          <ellipse 
            cx="88" 
            cy="95" 
            rx="8" 
            ry={eyeOpenness * 8} 
            fill="white"
          />
          {/* Pupil */}
          {eyeOpenness > 0.3 && (
            <circle 
              cx="88" 
              cy="95" 
              r={eyeOpenness * 4} 
              fill="hsl(30 20% 20%)"
            />
          )}
          {/* Eyelid (when closed) */}
          {eyeOpenness < 0.5 && (
            <ellipse 
              cx="88" 
              cy="95" 
              rx="8" 
              ry="1" 
              fill="hsl(30 40% 60%)"
            />
          )}
        </g>
        
        {/* Right Eye */}
        <g className="transition-all duration-1000">
          {/* Eye socket */}
          <ellipse 
            cx="112" 
            cy="95" 
            rx="8" 
            ry={eyeOpenness * 8} 
            fill="white"
          />
          {/* Pupil */}
          {eyeOpenness > 0.3 && (
            <circle 
              cx="112" 
              cy="95" 
              r={eyeOpenness * 4} 
              fill="hsl(30 20% 20%)"
            />
          )}
          {/* Eyelid (when closed) */}
          {eyeOpenness < 0.5 && (
            <ellipse 
              cx="112" 
              cy="95" 
              rx="8" 
              ry="1" 
              fill="hsl(30 40% 60%)"
            />
          )}
        </g>
        
        {/* Nose */}
        <path
          d="M 100 100 Q 102 105, 100 108"
          stroke="hsl(30 30% 50%)"
          strokeWidth="1.5"
          fill="none"
        />
        
        {/* Mouth - subtle smile when awake */}
        <path
          d={eyeOpenness > 0.7 
            ? "M 90 115 Q 100 118, 110 115"  // Smile
            : "M 90 115 L 110 115"  // Neutral
          }
          stroke="hsl(30 30% 50%)"
          strokeWidth="2"
          fill="none"
          className="transition-all duration-1000"
        />
        
        {/* Blanket */}
        <ellipse cx="100" cy="150" rx="70" ry="35" fill="hsl(210 30% 60%)" />
        <path
          d="M 30 150 Q 50 145, 70 148 Q 90 150, 110 148 Q 130 145, 150 148 Q 165 150, 170 155"
          stroke="hsl(210 30% 50%)"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default AnimatedPerson;

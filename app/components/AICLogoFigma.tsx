'use client';

interface AICLogoProps {
  variant?: "full" | "icon" | "wordmark";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function AICLogoFigma({ variant = "full", className = "", size = "md" }: AICLogoProps) {
  const sizes = {
    sm: { height: "32", width: "140" },
    md: { height: "48", width: "210" },
    lg: { height: "64", width: "280" },
    xl: { height: "80", width: "350" },
  };

  const iconSizes = {
    sm: "32",
    md: "48",
    lg: "64",
    xl: "80",
  };

  const { height, width } = sizes[size];
  const iconSize = iconSizes[size];

  // Icon Only - Shield with Human Silhouette
  if (variant === "icon") {
    return (
      <svg
        viewBox="0 0 100 100"
        height={iconSize}
        width={iconSize}
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shield Background */}
        <path
          d="M50 5L15 20V45C15 65 30 82 50 95C70 82 85 65 85 45V20L50 5Z"
          fill="#0a1628"
        />
        
        {/* Inner Shield Accent */}
        <path
          d="M50 12L22 24V45C22 62 35 76 50 87C65 76 78 62 78 45V24L50 12Z"
          fill="#1a3160"
        />
        
        {/* Human Silhouette - Head */}
        <circle cx="50" cy="35" r="8" fill="#c9920a" />
        
        {/* Human Silhouette - Body */}
        <path
          d="M50 45C42 45 36 50 36 56V68C36 70 37 72 39 72H61C63 72 64 70 64 68V56C64 50 58 45 50 45Z"
          fill="#c9920a"
        />
        
        {/* AI Circuit Pattern */}
        <circle cx="35" cy="50" r="2" fill="#c9920a" opacity="0.4" />
        <circle cx="65" cy="50" r="2" fill="#c9920a" opacity="0.4" />
        <line x1="37" y1="50" x2="42" y2="52" stroke="#c9920a" strokeWidth="1" opacity="0.4" />
        <line x1="63" y1="50" x2="58" y2="52" stroke="#c9920a" strokeWidth="1" opacity="0.4" />
      </svg>
    );
  }

  // Wordmark Only
  if (variant === "wordmark") {
    return (
      <svg
        viewBox="0 0 200 60"
        height={height}
        width={width}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="0"
          y="42"
          fill="#0a1628"
          fontSize="44"
          fontWeight="700"
          fontFamily="'Space Grotesk', sans-serif"
          letterSpacing="-1"
        >
          AIC
        </text>
        <text
          x="0"
          y="56"
          fill="#c9920a"
          fontSize="9"
          fontWeight="500"
          fontFamily="'Space Grotesk', sans-serif"
          letterSpacing="3"
        >
          AI INTEGRITY CERTIFICATION
        </text>
      </svg>
    );
  }

  // Full Logo - Icon + Text
  return (
    <svg
      viewBox="0 0 280 80"
      height={height}
      width={width}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield Icon */}
      <g transform="translate(0, 10)">
        {/* Shield Background */}
        <path
          d="M35 5L12 14V30C12 42 20 52 35 60C50 52 58 42 58 30V14L35 5Z"
          fill="#0a1628"
        />
        
        {/* Inner Shield */}
        <path
          d="M35 10L17 17V30C17 40 24 48 35 55C46 48 53 40 53 30V17L35 10Z"
          fill="#1a3160"
        />
        
        {/* Human Silhouette - Head */}
        <circle cx="35" cy="24" r="5" fill="#c9920a" />
        
        {/* Human Silhouette - Body */}
        <path
          d="M35 30C30 30 26 33 26 37V45C26 46 27 47 28 47H42C43 47 44 46 44 45V37C44 33 40 30 35 30Z"
          fill="#c9920a"
        />
        
        {/* AI Circuit Dots */}
        <circle cx="25" cy="35" r="1.5" fill="#c9920a" opacity="0.4" />
        <circle cx="45" cy="35" r="1.5" fill="#c9920a" opacity="0.4" />
        <line x1="26.5" y1="35" x2="30" y2="36" stroke="#c9920a" strokeWidth="0.8" opacity="0.4" />
        <line x1="43.5" y1="35" x2="40" y2="36" stroke="#c9920a" strokeWidth="0.8" opacity="0.4" />
      </g>
      
      {/* Text */}
      <g transform="translate(75, 0)">
        {/* AIC */}
        <text
          x="0"
          y="42"
          fill="#0a1628"
          fontSize="36"
          fontWeight="700"
          fontFamily="'Space Grotesk', sans-serif"
          letterSpacing="-0.5"
        >
          AIC
        </text>
        
        {/* Full Name */}
        <text
          x="0"
          y="58"
          fill="#6b7280"
          fontSize="9"
          fontWeight="500"
          fontFamily="'Space Grotesk', sans-serif"
          letterSpacing="2"
        >
          AI INTEGRITY CERTIFICATION
        </text>
        
        {/* Accent Line */}
        <line x1="0" y1="62" x2="180" y2="62" stroke="#c9920a" strokeWidth="1.5" opacity="0.3" />
      </g>
    </svg>
  );
}

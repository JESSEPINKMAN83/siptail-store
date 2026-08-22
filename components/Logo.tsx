interface LogoProps {
  variant?: "dark" | "white";
  className?: string;
}

export default function Logo({ variant = "dark", className = "" }: LogoProps) {
  const primary = variant === "white" ? "#FFFFFF" : "#1A1A1A";
  const accent = variant === "white" ? "#FFFFFF" : "#1B4332";

  return (
    <div className={`flex flex-col items-center gap-0.5 ${className}`}>
      {/* Mountain + trail SVG */}
      <svg viewBox="0 0 64 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-6 sm:w-12 sm:h-7">
        {/* Left peak */}
        <path d="M6 32 L22 8 L38 32" stroke={accent} strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
        {/* Right peak (taller) */}
        <path d="M26 32 L42 4 L58 32" stroke={accent} strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
        {/* Winding trail beneath */}
        <path d="M4 35 Q14 31 24 34 Q34 37 44 33 Q54 29 61 33"
          stroke={accent} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.7"/>
      </svg>
      {/* WALK */}
      <span style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontWeight: 700,
        fontSize: "1.5rem",
        lineHeight: 1,
        letterSpacing: "0.02em",
        color: primary,
      }}>WALK</span>
      {/* ESSENTIALS */}
      <span style={{
        fontFamily: "Inter, system-ui, sans-serif",
        fontWeight: 400,
        fontSize: "0.6rem",
        lineHeight: 1,
        letterSpacing: "0.35em",
        color: primary,
        textTransform: "uppercase" as const,
      }}>ESSENTIALS</span>
    </div>
  );
}

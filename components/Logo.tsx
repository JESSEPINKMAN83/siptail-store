interface LogoProps {
  variant?: "dark" | "white";
  layout?: "vertical" | "horizontal";
  className?: string;
}

const MountainIcon = ({ color, width, height }: { color: string; width: number; height: number }) => (
  <svg viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ width, height, flexShrink: 0 }}>
    {/* Left peak */}
    <path d="M5 44 L28 10 L51 44" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" fill="none"/>
    {/* Right peak (taller, overlapping) */}
    <path d="M32 44 L55 4 L78 44" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" fill="none"/>
    {/* Winding trail beneath */}
    <path d="M2 48 Q18 43 32 47 Q48 51 64 46 Q72 43 78 46"
      stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.65"/>
  </svg>
);

export function LogoVertical({ variant = "dark", className = "" }: { variant?: "dark"|"white"; className?: string }) {
  const textColor = variant === "white" ? "#FFFFFF" : "#1A1A1A";
  const iconColor = variant === "white" ? "#FFFFFF" : "#1B4332";
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <MountainIcon color={iconColor} width={44} height={28} />
      <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700, fontSize: "1.4rem", lineHeight: 1, letterSpacing: "0.02em", color: textColor }}>WALK</span>
      <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 400, fontSize: "0.55rem", lineHeight: 1, letterSpacing: "0.38em", color: textColor, textTransform: "uppercase" as const }}>ESSENTIALS</span>
    </div>
  );
}

export function LogoHorizontal({ variant = "dark", className = "" }: { variant?: "dark"|"white"; className?: string }) {
  const textColor = variant === "white" ? "#FFFFFF" : "#1A1A1A";
  const iconColor = variant === "white" ? "#FFFFFF" : "#1B4332";
  return (
    // rtl:flex-row-reverse: in Hebrew, icon moves to the right of the text block
    // so the logo reads [WALK ESSENTIALS text] [mountain icon] when dir=rtl
    <div className={`flex items-center gap-2.5 rtl:flex-row-reverse ${className}`}>
      <MountainIcon color={iconColor} width={36} height={24} />
      <div className="flex flex-col justify-center" style={{ lineHeight: 1 }}>
        <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700, fontSize: "1.25rem", letterSpacing: "0.02em", color: textColor, display: "block" }}>WALK</span>
        <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 400, fontSize: "0.5rem", letterSpacing: "0.38em", color: textColor, textTransform: "uppercase" as const, display: "block", marginTop: "2px" }}>ESSENTIALS</span>
      </div>
    </div>
  );
}

// Default export keeps backward compat
export default LogoVertical;

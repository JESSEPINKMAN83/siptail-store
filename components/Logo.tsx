const TEQPET_LOGO_URL = "https://static.wixstatic.com/media/70d502_e3e96278eb1444ef83de9003d1ad6795~mv2.jpg";

interface LogoProps {
  variant?: "dark" | "white";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LogoVertical({ variant = "dark", className = "", size = "md" }: LogoProps) {
  const dim = size === "sm" ? 36 : size === "lg" ? 56 : 44;
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={TEQPET_LOGO_URL} alt="TeqPet" width={dim} height={dim}
        style={{ objectFit: "contain", borderRadius: 4, flexShrink: 0 }} />
      <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 700,
        fontSize: "0.75rem", letterSpacing: "0.1em",
        color: variant === "white" ? "#FFFFFF" : "#1B2A4A",
        textTransform: "uppercase" as const }}>TeqPet</span>
    </div>
  );
}

export function LogoHorizontal({ variant = "dark", className = "", size = "md" }: LogoProps) {
  const dim = size === "sm" ? 32 : size === "lg" ? 48 : 38;
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={TEQPET_LOGO_URL} alt="TeqPet" width={dim} height={dim}
        style={{ objectFit: "contain", borderRadius: 4, flexShrink: 0 }} />
      <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 700,
        fontSize: "1.25rem", color: variant === "white" ? "#FFFFFF" : "#1B2A4A",
        letterSpacing: "0.02em" }}>TeqPet</span>
    </div>
  );
}

// Default export keeps backward compat
export default LogoVertical;

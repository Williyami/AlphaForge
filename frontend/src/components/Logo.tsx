import Image from "next/image";

interface LogoProps {
  variant?: "default" | "white" | "icon";
  size?: number;
  className?: string;
}

export function Logo({ variant = "default", size = 32, className = "" }: LogoProps) {
  const logoSrc = variant === "white" 
    ? "/logos/alphaforge-logo-white.svg" 
    : variant === "icon"
    ? "/logos/alphaforge-icon.svg"
    : "/logos/alphaforge-logo.svg";

  return (
    <Image
      src={logoSrc}
      alt="AlphaForge"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}

export function TextLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
        A
      </div>
      <span className="text-xl font-bold tracking-tight">AlphaForge</span>
    </div>
  );
}

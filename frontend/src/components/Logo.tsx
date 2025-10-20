import Image from "next/image";

interface LogoProps {
  variant?: "default" | "icon";
  size?: number;
  className?: string;
}

export function Logo({ variant = "default", size = 40, className = "" }: LogoProps) {
  const logoSrc = variant === "icon"
    ? "/logos/alphaforge-icon.png"
    : "/logos/alphaforge-logo.png";

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
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Use your actual logo */}
      <Image
        src="/logos/alphaforge-icon.png"
        alt="AlphaForge"
        width={40}
        height={40}
        className="rounded-lg"
        priority
      />
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight leading-none text-gray-900 dark:text-white">
          AlphaForge
        </span>
        <span className="text-xs text-gray-600 dark:text-gray-400 leading-none">
          Equity Research
        </span>
      </div>
    </div>
  );
}

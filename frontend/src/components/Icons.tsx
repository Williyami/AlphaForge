export function DCFIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="48" height="48" rx="8" fill="url(#dcf-gradient)" />
      <path d="M20 32 L28 24 L36 28 L44 20" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 40 L28 36 L36 38 L44 32" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <circle cx="44" cy="20" r="3" fill="white" />
      <circle cx="28" cy="24" r="2.5" fill="white" />
      <defs>
        <linearGradient id="dcf-gradient" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LBOIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="48" height="48" rx="8" fill="url(#lbo-gradient)" />
      <rect x="18" y="35" width="8" height="15" rx="2" fill="white" />
      <rect x="28" y="28" width="8" height="22" rx="2" fill="white" />
      <rect x="38" y="22" width="8" height="28" rx="2" fill="white" />
      <path d="M20 20 L32 14 L44 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="20" r="2.5" fill="white" />
      <circle cx="32" cy="14" r="2.5" fill="white" />
      <circle cx="44" cy="18" r="2.5" fill="white" />
      <defs>
        <linearGradient id="lbo-gradient" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CompsIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="48" height="48" rx="8" fill="url(#comps-gradient)" />
      <rect x="16" y="20" width="12" height="28" rx="2" fill="white" opacity="0.9" />
      <rect x="30" y="16" width="12" height="32" rx="2" fill="white" />
      <rect x="44" y="24" width="6" height="24" rx="2" fill="white" opacity="0.8" />
      <rect x="18" y="25" width="8" height="2" fill="#6366F1" />
      <rect x="18" y="30" width="8" height="2" fill="#6366F1" />
      <rect x="32" y="21" width="8" height="2" fill="#6366F1" />
      <rect x="32" y="26" width="8" height="2" fill="#6366F1" />
      <defs>
        <linearGradient id="comps-gradient" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#6366F1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function TeslaIcon({ className = "w-full h-40" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="250" fill="url(#tesla-bg)" />
      <g opacity="0.1">
        <path d="M50 200 Q125 100 200 150 T350 180" stroke="white" strokeWidth="40" strokeLinecap="round" />
      </g>
      <circle cx="320" cy="60" r="30" fill="white" opacity="0.2" />
      <circle cx="80" cy="180" r="40" fill="white" opacity="0.15" />
      <defs>
        <linearGradient id="tesla-bg" x1="0" y1="0" x2="400" y2="250" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E293B" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function NetflixIcon({ className = "w-full h-40" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="250" fill="url(#netflix-bg)" />
      <rect x="80" y="60" width="60" height="140" rx="8" fill="white" opacity="0.15" />
      <rect x="160" y="80" width="60" height="120" rx="8" fill="white" opacity="0.12" />
      <rect x="240" y="50" width="60" height="150" rx="8" fill="white" opacity="0.18" />
      <circle cx="350" cy="80" r="25" fill="white" opacity="0.1" />
      <defs>
        <linearGradient id="netflix-bg" x1="0" y1="0" x2="400" y2="250" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C3AED" />
          <stop offset="1" stopColor="#5B21B6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function PEIcon({ className = "w-full h-40" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="250" fill="url(#pe-bg)" />
      <circle cx="200" cy="125" r="80" stroke="white" strokeWidth="3" opacity="0.2" fill="none" />
      <circle cx="200" cy="125" r="50" stroke="white" strokeWidth="2" opacity="0.15" fill="none" />
      <path d="M160 125 L200 85 L240 125 L200 165 Z" fill="white" opacity="0.1" />
      <circle cx="80" cy="60" r="20" fill="white" opacity="0.08" />
      <circle cx="330" cy="190" r="25" fill="white" opacity="0.08" />
      <defs>
        <linearGradient id="pe-bg" x1="0" y1="0" x2="400" y2="250" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0EA5E9" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

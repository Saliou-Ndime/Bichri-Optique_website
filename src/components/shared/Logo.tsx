"use client";

import Link from "next/link";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
  className?: string;
};

export function Logo({ size = "md", variant = "full", className = "" }: LogoProps) {
  const sizes = {
    sm: { icon: 28, text: "text-lg" },
    md: { icon: 36, text: "text-xl" },
    lg: { icon: 48, text: "text-3xl" },
  };

  const s = sizes[size];

  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      {/* Logo icon - glasses shape */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bichriGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c1aff" />
            <stop offset="50%" stopColor="#a674ff" />
            <stop offset="100%" stopColor="#dcceff" />
          </linearGradient>
        </defs>
        {/* Left lens */}
        <ellipse cx="14" cy="26" rx="11" ry="10" stroke="url(#bichriGrad)" strokeWidth="3" fill="none" />
        {/* Right lens */}
        <ellipse cx="34" cy="26" rx="11" ry="10" stroke="url(#bichriGrad)" strokeWidth="3" fill="none" />
        {/* Bridge */}
        <path d="M25 24C25 22 23 22 24 22C25 22 23 22 23 24" stroke="url(#bichriGrad)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M25 26C24.5 23 23.5 23 23 26" stroke="url(#bichriGrad)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Left arm */}
        <path d="M3 22L5 24" stroke="url(#bichriGrad)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Right arm */}
        <path d="M45 22L43 24" stroke="url(#bichriGrad)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Shine effect */}
        <circle cx="10" cy="23" r="2" fill="#dcceff" opacity="0.5" />
        <circle cx="30" cy="23" r="2" fill="#dcceff" opacity="0.5" />
      </svg>

      {variant === "full" && (
        <div className="flex flex-col leading-none">
          <span className={`font-extrabold ${s.text} gradient-text tracking-tight`}>
            Bichri
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-bichri-500">
            Optique
          </span>
        </div>
      )}
    </Link>
  );
}

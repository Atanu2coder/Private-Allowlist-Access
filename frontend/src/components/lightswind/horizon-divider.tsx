import React from "react";

export function HorizonDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full flex justify-center items-center py-12 opacity-50 ${className}`}>
      <svg width="80%" height="24" viewBox="0 0 1200 24" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M0 12L400 12L600 2L800 12L1200 12" stroke="url(#paint0_linear)" strokeWidth="1" />
        <path d="M0 12L400 12L600 22L800 12L1200 12" stroke="url(#paint1_linear)" strokeWidth="1" />
        <circle cx="600" cy="12" r="2" fill="#00ff9d" className="animate-pulse" />
        <defs>
          <linearGradient id="paint0_linear" x1="0" y1="12" x2="1200" y2="12" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00ff9d" stopOpacity="0" />
            <stop offset="0.3" stopColor="#00ff9d" stopOpacity="0.5" />
            <stop offset="0.5" stopColor="#00ff9d" stopOpacity="1" />
            <stop offset="0.7" stopColor="#00ff9d" stopOpacity="0.5" />
            <stop offset="1" stopColor="#00ff9d" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="paint1_linear" x1="0" y1="12" x2="1200" y2="12" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00ff9d" stopOpacity="0" />
            <stop offset="0.3" stopColor="#00ff9d" stopOpacity="0.2" />
            <stop offset="0.5" stopColor="#00ff9d" stopOpacity="0.5" />
            <stop offset="0.7" stopColor="#00ff9d" stopOpacity="0.2" />
            <stop offset="1" stopColor="#00ff9d" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

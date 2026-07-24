import React from 'react';

interface SectionDividerProps {
  className?: string;
  flip?: boolean;
}

export default function SectionDivider({ className = '', flip = false }: SectionDividerProps) {
  return (
    <div className={`relative w-full h-24 overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={`absolute bottom-0 w-full h-full ${flip ? 'rotate-180' : ''}`}
      >
        <defs>
          <linearGradient id="divider-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
            <stop offset="50%" stopColor="rgba(99, 102, 241, 0.04)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
          </linearGradient>
        </defs>
        <path
          d="M0,60 C200,20 400,100 600,60 C800,20 1000,100 1200,60 L1200,120 L0,120 Z"
          fill="url(#divider-gradient)"
          className="animate-pulse-glow"
          style={{ animationDuration: '4s' }}
        />
        <path
          d="M0,85 C300,65 500,105 700,85 C900,65 1100,105 1200,85 L1200,120 L0,120 Z"
          fill="rgba(99, 102, 241, 0.02)"
        />
      </svg>
    </div>
  );
}

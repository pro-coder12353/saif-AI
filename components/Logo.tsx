
import React from 'react';

export const SaifLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 5L15 20V45C15 65 30 85 50 95C70 85 85 65 85 45V20L50 5Z" fill="url(#grad1)" stroke="#38BDF8" strokeWidth="2" />
    <path d="M50 25V75M25 50H75" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
    <circle cx="50" cy="50" r="10" fill="#38BDF8" className="animate-pulse" />
    <circle cx="50" cy="50" r="20" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 4" className="animate-[spin_4s_linear_infinite]" />
    <defs>
      <linearGradient id="grad1" x1="50" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0F172A" />
        <stop offset="1" stopColor="#1E293B" />
      </linearGradient>
    </defs>
  </svg>
);

import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'md', showTagline = false, light = false }) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <Link to="/" className="flex items-center gap-3 group select-none">
      <div className={`relative flex items-center justify-center ${iconSizes[size]} rounded-xl bg-gradient-to-br from-navy-800 via-royal-600 to-cyanBrand-500 p-0.5 shadow-soft-md group-hover:shadow-glow-cyan transition-all duration-300`}>
        <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center p-1.5">
          {/* Interconnected Knowledge Bridge Icon */}
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full text-cyanBrand-400 transform group-hover:scale-105 transition-transform duration-300">
            {/* Knowledge Nodes */}
            <circle cx="6" cy="16" r="3.5" fill="#06B6D4" />
            <circle cx="26" cy="16" r="3.5" fill="#2563EB" />
            <circle cx="16" cy="8" r="3" fill="#7C3AED" />
            <circle cx="16" cy="24" r="3" fill="#38BDF8" />

            {/* Connecting Bridge Arcs & Synapses */}
            <path d="M6 16C11 16 13 8 16 8C19 8 21 16 26 16" stroke="url(#bridgeGrad)" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M6 16C11 16 13 24 16 24C19 24 21 16 26 16" stroke="url(#bridgeGrad2)" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M16 8L16 24" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="2 2" />

            {/* Center Core Node */}
            <circle cx="16" cy="16" r="2.2" fill="#FFFFFF" />

            <defs>
              <linearGradient id="bridgeGrad" x1="6" y1="12" x2="26" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="#06B6D4" />
                <stop offset="0.5" stopColor="#7C3AED" />
                <stop offset="1" stopColor="#2563EB" />
              </linearGradient>
              <linearGradient id="bridgeGrad2" x1="6" y1="20" x2="26" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#06B6D4" />
                <stop offset="0.5" stopColor="#38BDF8" />
                <stop offset="1" stopColor="#2563EB" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <div className={`font-bold tracking-tight ${textSizes[size]} ${light ? 'text-white' : 'text-navy-950'}`}>
          KnowBridge <span className="bg-gradient-to-r from-royal-500 to-cyanBrand-500 bg-clip-text text-transparent font-extrabold">AI</span>
        </div>
        {showTagline && (
          <span className={`text-[10px] uppercase font-semibold tracking-wider ${light ? 'text-slate-400' : 'text-slate-500'}`}>
            Never Lose Knowledge. Never Lose Momentum.
          </span>
        )}
      </div>
    </Link>
  );
}

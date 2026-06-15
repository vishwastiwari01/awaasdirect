import React from 'react';

interface BrandLogoProps {
    className?: string;
    iconOnly?: boolean;
    dark?: boolean; // If true, adapt text colors for light background (useful if we need it elsewhere)
}

export function BrandLogo({ className = '', iconOnly = false, dark = false }: BrandLogoProps) {
    return (
        <div className={`flex items-center gap-2.5 hover:opacity-90 transition-opacity duration-300 ${className}`}>
            {/* Logo Icon */}
            <div className="relative flex items-center justify-center shrink-0 w-12 h-12">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    {/* Outer House Roof */}
                    <path
                        d="M5 28L24 7L43 28"
                        stroke="#10B981"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Inner Hidden 'M' */}
                    <path
                        d="M13 35V20L24 31L35 20V35"
                        stroke="#D4AF37"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* Brand Text */}
            {!iconOnly && (
                <div
                    className="font-bold tracking-tight leading-none mb-0.5"
                    style={{
                        fontFamily: 'var(--font-playfair, "Playfair Display", serif)',
                        fontSize: '32px',
                    }}
                >
                    <span className={dark ? "text-navy" : "text-surface"}>My</span>
                    <span className="text-gold">Awaas</span>
                </div>
            )}
        </div>
    );
}

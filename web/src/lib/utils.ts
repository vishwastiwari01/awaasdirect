import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
    if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)} Cr`;
    if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)} L`;
    return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatArea(sqft: number): string {
    return `${sqft.toLocaleString('en-IN')} sq.ft`;
}

export function timeAgo(date: string | Date): string {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

export function initials(name: string): string {
    return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

export const CITIES = ['Bangalore', 'Hyderabad', 'Mumbai', 'Delhi', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];

export const PROPERTY_TYPES = [
    { value: 'APARTMENT', label: 'Apartment', emoji: '🏢' },
    { value: 'VILLA', label: 'Villa', emoji: '🏡' },
    { value: 'INDEPENDENT_HOUSE', label: 'Independent House', emoji: '🏠' },
    { value: 'PLOT', label: 'Plot', emoji: '🏗️' },
    { value: 'COMMERCIAL', label: 'Commercial', emoji: '🏬' },
    { value: 'PG', label: 'PG / Hostel', emoji: '🛏️' },
];

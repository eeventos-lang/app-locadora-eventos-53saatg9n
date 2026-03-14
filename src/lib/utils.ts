import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Trophy, Shield, Medal } from 'lucide-react'

/**
 * Merges multiple class names into a single string
 * @param inputs - Array of class names
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Determines the loyalty tier based on accumulated points.
 */
export function getLoyaltyTier(points: number = 0) {
  if (points >= 1000) {
    return {
      name: 'Ouro',
      id: 'gold',
      icon: Trophy,
      colorClass: 'text-yellow-500',
      borderClass: 'border-yellow-500/30',
      bgClass: 'bg-yellow-500/10',
      nextThreshold: null,
    }
  } else if (points >= 500) {
    return {
      name: 'Prata',
      id: 'silver',
      icon: Shield,
      colorClass: 'text-slate-400',
      borderClass: 'border-slate-400/30',
      bgClass: 'bg-slate-400/10',
      nextThreshold: 1000,
    }
  } else {
    return {
      name: 'Bronze',
      id: 'bronze',
      icon: Medal,
      colorClass: 'text-amber-600',
      borderClass: 'border-amber-600/30',
      bgClass: 'bg-amber-600/10',
      nextThreshold: 500,
    }
  }
}

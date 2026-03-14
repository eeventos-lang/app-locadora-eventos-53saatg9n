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
      colorClass: 'text-amber-700',
      borderClass: 'border-amber-300',
      bgClass: 'bg-amber-100',
      nextThreshold: null,
    }
  } else if (points >= 500) {
    return {
      name: 'Prata',
      id: 'silver',
      icon: Shield,
      colorClass: 'text-slate-700',
      borderClass: 'border-slate-300',
      bgClass: 'bg-slate-200',
      nextThreshold: 1000,
    }
  } else {
    return {
      name: 'Bronze',
      id: 'bronze',
      icon: Medal,
      colorClass: 'text-orange-700',
      borderClass: 'border-orange-200',
      bgClass: 'bg-orange-900/10',
      nextThreshold: 500,
    }
  }
}

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export utility functions
export * from './utils/display-id'
export * from './utils/date'
export * from './utils/units'
export * from './utils/business'
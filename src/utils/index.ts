import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const isServer = () => typeof window === 'undefined'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

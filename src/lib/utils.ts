import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const capitalizeFirstLetter = ([first, ...rest]: string) => {
  if (!first) return
  return first.toLocaleUpperCase() + rest.join('').toLowerCase()
}
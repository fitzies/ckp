import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function maskNric(nric: string): string {
  if (nric.length !== 9) {
    throw new Error("Invalid NRIC length.");
  }

  // Mask the middle digits and preserve the first and last character
  const maskedNric = `${nric[0]}XXXX${nric.slice(5)}`;
  return maskedNric;
}

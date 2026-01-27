import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  if (!name) return "";
  
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "";
  
  const firstInitial = parts[0]?.[0]?.toUpperCase() || "";
  const lastInitial = parts.length > 1 ? parts[parts.length - 1]?.[0]?.toUpperCase() || "" : "";
  
  return firstInitial + lastInitial;
}
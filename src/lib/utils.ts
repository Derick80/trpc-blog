import { type ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
// used this to install./src/components/ui
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

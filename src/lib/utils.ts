import { publicRuntimeConfig } from "@/../next.config.js";
import User from "@/typings/User";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  const nameParts = name.trim().split(/\s+/);
  if (nameParts.length < 2) {
    // If there's only one part, return the first two characters or an empty string
    return nameParts[0]?.substring(0, 2).toUpperCase() || "";
  }
  // Return the first letter of the first part and the first letter of the last part
  return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }
  if (diffInSeconds < 3600) {
    return Math.floor(diffInSeconds / 60) + " minutes ago";
  }
  if (diffInSeconds < 86400) {
    return Math.floor(diffInSeconds / 3600) + " hours ago";
  }

  return date.toLocaleDateString("sv-SE");
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString.trim()); // Trim removes leading and trailing whitespaces

  if (isNaN(date.getTime())) {
    // Check if date is valid
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options); // Will output something like "20 Jan 2022"
}

export function createApiUrl(path: string, version: string = "V1") {
  const apiProp = `apiUrl${version}`;
  const isServer = typeof window === "undefined";
  const apiUrl = isServer ? process.env.API_URL : "/api";

  return `${apiUrl}${publicRuntimeConfig[apiProp]}${path}`;
}

export function getRouteLoginAfter(
  user: User,
  route: string = "/app",
  force: boolean = false
) {
  // TODO: If we want to onboarding to be a thing, we need to check if the user has completed it
  return "/";
}

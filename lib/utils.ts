import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function truncateText(text: string, maxTokens: number): string {
  const approxCharsPerToken = 4;
  const maxChars = maxTokens * approxCharsPerToken;

  if (text.length <= maxChars) return text;

  const halfMax = Math.floor(maxChars / 2);
  return (
    text.slice(0, halfMax) + "\n\n[...truncated...]\n\n" + text.slice(-halfMax)
  );
}

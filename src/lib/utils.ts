import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combine and normalize CSS class values into a single Tailwind-safe string.
 *
 * Accepts multiple class value arguments (strings, arrays, objects, etc.), filters out falsy values,
 * and returns a single space-separated class string with Tailwind utility conflicts resolved.
 *
 * @param inputs - Class values to merge (supports the same shapes as `clsx`)
 * @returns A normalized class string with Tailwind classes merged to keep the last conflicting utility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalize a YouTube URL to the canonical watch URL for a recognized video ID.
 *
 * Accepts common YouTube formats (including short `youtu.be`, `watch?v=`, `embed/`, and `v/`) and, when a valid 11-character video ID is found, returns `https://www.youtube.com/watch?v=<id>`. If no video ID is detected the original `url` is returned unchanged.
 *
 * @param url - A YouTube URL in any common format (or any string); if a video ID can be extracted it will be normalized.
 * @returns The canonical watch URL for the extracted video ID, or the original `url` if no ID is found.
 */
export function formatYoutubeUrl(url: string): string {
  // Regex to extract video ID from various YouTube URL formats
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(?:embed\/)?(?:v\/)?([\w-]{11})/;
  const match = url.match(youtubeRegex);

  if (match) {
    const videoId = match[1];
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  // Return original URL if no match is found
  return url;
}

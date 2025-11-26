const rawApiBase = import.meta.env.VITE_API_BASE || "/api";

// Ensure no trailing slash to avoid double slashes when building URLs
export const apiBaseUrl = rawApiBase.endsWith("/")
  ? rawApiBase.slice(0, -1)
  : rawApiBase;

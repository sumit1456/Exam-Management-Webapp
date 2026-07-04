import { getFileUrl } from "../api";

/**
 * Check if a string is a URL (starts with http:// or https://)
 */
const isUrl = (str) => {
  if (!str || typeof str !== "string") return false;
  return str.startsWith("http://") || str.startsWith("https://");
};

/**
 * Check if a string looks like an object key (not a URL)
 */
const isObjectKey = (str) => {
  if (!str || typeof str !== "string") return false;
  return !isUrl(str) && str.length > 0;
};

/**
 * Resolve a file URL from either a stored key or a full URL.
 * Returns null if input is null/undefined.
 */
export const resolveFileUrl = async (storedValue) => {
  if (!storedValue) return null;

  // If it's already a full URL, return as-is
  if (isUrl(storedValue)) {
    return storedValue;
  }

  // If it's an object key, fetch fresh presigned URL
  if (isObjectKey(storedValue)) {
    try {
      const freshUrl = await getFileUrl(storedValue);
      return freshUrl;
    } catch (error) {
      console.error("Failed to resolve file URL for key:", storedValue, error);
      return null;
    }
  }

  return null;
};

/**
 * Resolve multiple file URLs at once
 */
export const resolveFileUrls = async (keys) => {
  if (!keys || keys.length === 0) return {};

  const results = {};
  await Promise.all(
    keys.map(async ({ key, field }) => {
      if (key) {
        results[field] = await resolveFileUrl(key);
      }
    })
  );
  return results;
};

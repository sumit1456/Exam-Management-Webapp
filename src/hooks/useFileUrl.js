import { useState, useEffect } from "react";
import { getFileUrl } from "../api";

/**
 * Check if a string is a URL (starts with http:// or https://)
 */
const isUrl = (str) => {
  if (!str || typeof str !== "string") return false;
  return str.startsWith("http://") || str.startsWith("https://");
};

/**
 * React hook to resolve a file URL from either a stored key or a full URL.
 * Returns { url, isLoading, error }
 */
export const useFileUrl = (storedValue) => {
  const [url, setUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const resolve = async () => {
      if (!storedValue) {
        setUrl(null);
        return;
      }

      // If it's already a full URL, use it directly
      if (isUrl(storedValue)) {
        setUrl(storedValue);
        return;
      }

      // If it's an object key, fetch fresh presigned URL
      setIsLoading(true);
      setError(null);

      try {
        const freshUrl = await getFileUrl(storedValue);
        if (!cancelled) {
          setUrl(freshUrl);
        }
      } catch (err) {
        console.error("Failed to resolve file URL:", err);
        if (!cancelled) {
          setError(err);
          setUrl(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    resolve();

    return () => {
      cancelled = true;
    };
  }, [storedValue]);

  return { url, isLoading, error };
};

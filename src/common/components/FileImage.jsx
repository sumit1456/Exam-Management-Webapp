import React from 'react';
import { useFileUrl } from '../../hooks/useFileUrl';

/**
 * FileImage component that automatically resolves MinIO object keys to presigned URLs.
 * Props:
 * - src: The stored value (can be a full URL or an object key)
 * - alt: Alt text for the image
 * - fallback: Content to show while loading or if URL fails to resolve
 * - ...props: Any other img props (className, style, etc.)
 */
const FileImage = ({ src, alt, fallback, className, style, ...props }) => {
  const { url, isLoading, error } = useFileUrl(src);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className || ''}`} style={style}>
        {fallback || (
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        )}
      </div>
    );
  }

  if (error || !url) {
    return null;
  }

  return (
    <img
      src={url}
      alt={alt || ''}
      className={className}
      style={style}
      {...props}
    />
  );
};

export default FileImage;

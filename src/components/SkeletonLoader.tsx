import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  height?: string;
  width?: string;
}

/**
 * Lightweight skeleton loader with shimmer animation.
 * Shows smooth loading state while heavy components load.
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = 'w-full h-full',
  height,
  width,
}) => {
  const customStyle: React.CSSProperties = {};
  if (height) customStyle.height = height;
  if (width) customStyle.width = width;

  return (
    <div
      className={`${className} animate-pulse bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900`}
      style={customStyle}
      aria-label="Loading"
      role="status"
    />
  );
};

export default SkeletonLoader;

'use client';

import React, { useState, useEffect } from 'react';

interface DeferredComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
}

/**
 * Defers rendering of expensive child components until browser is idle.
 * Uses requestIdleCallback with setTimeout fallback for broad compatibility.
 * This allows critical content to paint first, then heavy effects load after.
 */
export const DeferredComponent: React.FC<DeferredComponentProps> = ({
  children,
  fallback = null,
  delay = 0,
}) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const load = () => setIsReady(true);

    // Use requestIdleCallback if available (modern browsers)
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = (window as any).requestIdleCallback(load, {
        timeout: Math.max(delay, 1000),
      });
      return () => (window as any).cancelIdleCallback(id);
    }

    // Fallback for Safari and older browsers
    const timer = setTimeout(load, Math.max(delay, 100));
    return () => clearTimeout(timer);
  }, [delay]);

  return isReady ? <>{children}</> : <>{fallback}</>;
};

export default DeferredComponent;

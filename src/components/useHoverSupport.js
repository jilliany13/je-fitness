import { useState, useEffect } from 'react';

export const useHoverSupport = () => {
  const [supportsHover, setSupportsHover] = useState(true);

  useEffect(() => {
    // Check if device supports hover
    const checkHoverSupport = () => {
      const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
      setSupportsHover(mediaQuery.matches);
    };

    // Check on mount
    checkHoverSupport();

    // Listen for changes
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    mediaQuery.addEventListener('change', checkHoverSupport);

    return () => {
      mediaQuery.removeEventListener('change', checkHoverSupport);
    };
  }, []);

  return supportsHover;
}; 
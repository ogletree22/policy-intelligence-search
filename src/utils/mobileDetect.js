import { useState, useEffect } from 'react';

export const isMobileDevice = () => {
  return window.innerWidth <= 768; // Standard tablet breakpoint
};

console.log('Is mobile:', isMobileDevice());

export const useMobileDetect = () => {
  const [isMobile, setIsMobile] = useState(isMobileDevice());

  useEffect(() => {
    const handleResize = () => {
      const isMobile = isMobileDevice();
      console.log('Window width:', window.innerWidth, 'Is mobile:', isMobile);
      setIsMobile(isMobile);
    };

    // Call once on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}; 
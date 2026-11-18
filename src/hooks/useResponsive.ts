import { useState, useEffect } from 'react';

interface Layout {
  padding: number;
  internalPadding: number;
  smallPadding: number;
  tinyPadding: number;
  spacingSmall: number;
  internalSpacing: number;
  spacingMedium: number;
  externalSpacing: number;
}

interface ResponsiveResult {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  layout: Layout;
}

const COMPACT_LAYOUT: Layout = {
  padding: 25,
  internalPadding: 15,
  smallPadding: 7,
  tinyPadding: 5,
  spacingSmall: 5,
  internalSpacing: 10,
  spacingMedium: 20,
  externalSpacing: 25,
};

const REGULAR_LAYOUT: Layout = {
  padding: 40,
  internalPadding: 30,
  smallPadding: 12,
  tinyPadding: 10,
  spacingSmall: 5,
  internalSpacing: 10,
  spacingMedium: 20,
  externalSpacing: 25,
};

export function useResponsive(): ResponsiveResult {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = width < 768;
  const isTablet = width >= 768 && width <= 1024;
  const isDesktop = width > 1024;

  return {
    isMobile,
    isTablet,
    isDesktop,
    layout: isMobile ? COMPACT_LAYOUT : REGULAR_LAYOUT,
  };
}

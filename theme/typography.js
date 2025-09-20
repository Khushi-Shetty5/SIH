// SIH/hospital/theme/typography.js

import { getResponsiveFontSize } from '../utils/responsive';

export const typography = {
  // Headings
  h1: getResponsiveFontSize(32),
  h2: getResponsiveFontSize(28),
  h3: getResponsiveFontSize(24),
  h4: getResponsiveFontSize(20),
  h5: getResponsiveFontSize(18), 
  h6: getResponsiveFontSize(16),

  // Body text
  body: getResponsiveFontSize(14),
  small: getResponsiveFontSize(13),
  caption: getResponsiveFontSize(12),

  // Line heights for readability
  lineHeight: {
    h1: getResponsiveFontSize(40),
    h2: getResponsiveFontSize(36),
    h3: getResponsiveFontSize(32),
    h4: getResponsiveFontSize(28),
    h5: getResponsiveFontSize(26),
    h6: getResponsiveFontSize(24),
    body: getResponsiveFontSize(20),
    small: getResponsiveFontSize(18),
    caption: getResponsiveFontSize(16),
  },
};

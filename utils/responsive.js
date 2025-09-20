// responsive.js
import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Base scale (adjust according to your base design width, usually 375 for iPhone X)
const BASE_WIDTH = 375;

/**
 * Get responsive value based on screen width
 * Supports multiple breakpoint values: mobile, tablet, desktop
 */
export const getResponsiveValue = (mobile, tablet = mobile, desktop = tablet) => {
  if (SCREEN_WIDTH >= 1024) {
    return desktop;
  } else if (SCREEN_WIDTH >= 768) {
    return tablet;
  }
  return mobile;
};

/**
 * Get responsive font size with pixel ratio consideration
 */
export const getResponsiveFontSize = (fontSize) => {
  const scaledSize = (SCREEN_WIDTH / BASE_WIDTH) * fontSize;
  return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
};

/**
 * Get responsive scale value
 */
export const getResponsiveScale = (value) => {
  return (SCREEN_WIDTH / BASE_WIDTH) * value;
};

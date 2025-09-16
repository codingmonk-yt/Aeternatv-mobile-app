import { Dimensions, PixelRatio } from 'react-native';
import { Fonts } from './fonts';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Screen size breakpoints
export const BREAKPOINTS = {
  small: 375,    // iPhone SE, small phones
  medium: 414,   // iPhone 11 Pro Max, medium phones
  large: 768,    // iPad mini, tablets
  xlarge: 1024,  // iPad Pro, large tablets
} as const;

// Get current screen size category
export const getScreenSize = (): 'small' | 'medium' | 'large' | 'xlarge' => {
  if (screenWidth <= BREAKPOINTS.small) return 'small';
  if (screenWidth <= BREAKPOINTS.medium) return 'medium';
  if (screenWidth <= BREAKPOINTS.large) return 'large';
  return 'xlarge';
};

// Responsive font size based on screen width
export const getResponsiveFontSize = (baseSize: number): number => {
  const screenSize = getScreenSize();
  const scaleFactor = screenWidth / 414; // Base width (iPhone 11 Pro Max)
  
  // Apply different scaling factors based on screen size
  let multiplier = 1;
  switch (screenSize) {
    case 'small':
      multiplier = 0.85; // Smaller text for small screens
      break;
    case 'medium':
      multiplier = 1;
      break;
    case 'large':
      multiplier = 1.1;
      break;
    case 'xlarge':
      multiplier = 1.2;
      break;
  }
  
  const scaledSize = baseSize * scaleFactor * multiplier;
  return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
};

// Responsive padding/margin based on screen width
export const getResponsivePadding = (basePadding: number): number => {
  const screenSize = getScreenSize();
  const scaleFactor = screenWidth / 414;
  
  let multiplier = 1;
  switch (screenSize) {
    case 'small':
      multiplier = 0.7; // Smaller padding for small screens
      break;
    case 'medium':
      multiplier = 1;
      break;
    case 'large':
      multiplier = 1.2;
      break;
    case 'xlarge':
      multiplier = 1.4;
      break;
  }
  
  const scaledPadding = basePadding * scaleFactor * multiplier;
  return Math.round(PixelRatio.roundToNearestPixel(scaledPadding));
};

// Responsive icon size
export const getResponsiveIconSize = (baseSize: number): number => {
  const screenSize = getScreenSize();
  
  let multiplier = 1;
  switch (screenSize) {
    case 'small':
      multiplier = 0.8; // Smaller icons for small screens
      break;
    case 'medium':
      multiplier = 1;
      break;
    case 'large':
      multiplier = 1.1;
      break;
    case 'xlarge':
      multiplier = 1.2;
      break;
  }
  
  return Math.round(baseSize * multiplier);
};

// Responsive card width for horizontal lists
export const getResponsiveCardWidth = (): number => {
  const screenSize = getScreenSize();
  
  let percentage = 0.28; // Default 28% of screen width
  switch (screenSize) {
    case 'small':
      percentage = 0.32; // Slightly wider cards on small screens
      break;
    case 'medium':
      percentage = 0.28;
      break;
    case 'large':
      percentage = 0.25;
      break;
    case 'xlarge':
      percentage = 0.22;
      break;
  }
  
  return screenWidth * percentage;
};

// Responsive spacing between elements
export const getResponsiveSpacing = (baseSpacing: number): number => {
  const screenSize = getScreenSize();
  
  let multiplier = 1;
  switch (screenSize) {
    case 'small':
      multiplier = 0.8; // Tighter spacing on small screens
      break;
    case 'medium':
      multiplier = 1;
      break;
    case 'large':
      multiplier = 1.2;
      break;
    case 'xlarge':
      multiplier = 1.4;
      break;
  }
  
  return Math.round(baseSpacing * multiplier);
};

// Responsive button height
export const getResponsiveButtonHeight = (baseHeight: number = 50): number => {
  const screenSize = getScreenSize();
  
  let multiplier = 1;
  switch (screenSize) {
    case 'small':
      multiplier = 0.9; // Slightly smaller buttons on small screens
      break;
    case 'medium':
      multiplier = 1;
      break;
    case 'large':
      multiplier = 1.1;
      break;
    case 'xlarge':
      multiplier = 1.2;
      break;
  }
  
  return Math.round(baseHeight * multiplier);
};

// Responsive border radius
export const getResponsiveBorderRadius = (baseRadius: number): number => {
  const screenSize = getScreenSize();
  
  let multiplier = 1;
  switch (screenSize) {
    case 'small':
      multiplier = 0.9; // Slightly smaller radius on small screens
      break;
    case 'medium':
      multiplier = 1;
      break;
    case 'large':
      multiplier = 1.1;
      break;
    case 'xlarge':
      multiplier = 1.2;
      break;
  }
  
  return Math.round(baseRadius * multiplier);
};

// Predefined responsive styles for common elements - All using Roboto
export const responsiveStyles = {
  // Text styles with Roboto font
  title: {
    fontSize: getResponsiveFontSize(28),
    fontFamily: Fonts.bold,
  },
  subtitle: {
    fontSize: getResponsiveFontSize(20),
    fontFamily: Fonts.bold,
  },
  body: {
    fontSize: getResponsiveFontSize(16),
    fontFamily: Fonts.regular,
  },
  caption: {
    fontSize: getResponsiveFontSize(14),
    fontFamily: Fonts.regular,
  },
  small: {
    fontSize: getResponsiveFontSize(12),
    fontFamily: Fonts.regular,
  },
  tiny: {
    fontSize: getResponsiveFontSize(10),
    fontFamily: Fonts.regular,
  },
  
  // Spacing
  padding: {
    horizontal: getResponsivePadding(20),
    vertical: getResponsivePadding(16),
  },
  margin: {
    small: getResponsiveSpacing(8),
    medium: getResponsiveSpacing(16),
    large: getResponsiveSpacing(24),
    xlarge: getResponsiveSpacing(32),
  },
  
  // Icons
  icon: {
    small: getResponsiveIconSize(16),
    medium: getResponsiveIconSize(20),
    large: getResponsiveIconSize(24),
  },
  
  // Cards
  cardWidth: getResponsiveCardWidth(),
  cardHeight: getResponsiveCardWidth() * 1.5,
  
  // Buttons
  buttonHeight: getResponsiveButtonHeight(),
  buttonRadius: getResponsiveBorderRadius(25),
};

export default {
  getScreenSize,
  getResponsiveFontSize,
  getResponsivePadding,
  getResponsiveIconSize,
  getResponsiveCardWidth,
  getResponsiveSpacing,
  getResponsiveButtonHeight,
  getResponsiveBorderRadius,
  responsiveStyles,
  BREAKPOINTS,
  screenWidth,
  screenHeight,
};

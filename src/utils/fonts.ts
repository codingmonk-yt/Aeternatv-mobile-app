// Font family constants for consistent usage across the app
export const Fonts = {
  // Roboto font family - Primary font for the entire app
  regular: 'Roboto_400Regular',
  medium: 'Roboto_500Medium',
  bold: 'Roboto_700Bold',
  black: 'Roboto_900Black',
} as const;

// Predefined font styles for common use cases - All using Roboto
export const FontStyles = {
  // Headers
  h1: {
    fontFamily: Fonts.bold,
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    lineHeight: 36,
  },
  h3: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    lineHeight: 32,
  },
  h4: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    lineHeight: 28,
  },
  
  // Body text
  body: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyBold: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    lineHeight: 24,
  },
  
  // Caption text
  caption: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  captionMedium: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  captionBold: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    lineHeight: 20,
  },
  
  // Small text
  small: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  smallMedium: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    lineHeight: 16,
  },
  smallBold: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    lineHeight: 16,
  },
  
  // Button text
  button: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    lineHeight: 24,
  },
  buttonLarge: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    lineHeight: 28,
  },
  
  // Display text (for large titles)
  display: {
    fontFamily: Fonts.bold,
    fontSize: 36,
    lineHeight: 44,
  },
  displayLarge: {
    fontFamily: Fonts.black,
    fontSize: 48,
    lineHeight: 56,
  },
} as const;

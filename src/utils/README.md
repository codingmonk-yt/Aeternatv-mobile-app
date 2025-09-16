# Responsive Design System

This document explains the responsive design system implemented for the Aeternatv mobile app to ensure optimal user experience across different screen sizes.

## Overview

The responsive design system automatically adjusts text sizes, padding, margins, icon sizes, and card dimensions based on the device's screen width. This ensures the app looks great on small phones (iPhone SE), medium phones (iPhone 11 Pro Max), tablets, and large screens.

## Screen Size Breakpoints

The system uses the following breakpoints:

- **Small**: ≤ 375px (iPhone SE, small phones)
- **Medium**: 376px - 414px (iPhone 11 Pro Max, medium phones)  
- **Large**: 415px - 768px (iPad mini, tablets)
- **XLarge**: > 768px (iPad Pro, large tablets)

## Responsive Utilities

### Font Sizes
- `getResponsiveFontSize(baseSize)` - Scales font sizes based on screen width
- `responsiveStyles.title` - Large title text (28px base)
- `responsiveStyles.subtitle` - Section titles (20px base)
- `responsiveStyles.body` - Body text (16px base)
- `responsiveStyles.caption` - Caption text (14px base)
- `responsiveStyles.small` - Small text (12px base)
- `responsiveStyles.tiny` - Tiny text (10px base)

### Spacing
- `getResponsivePadding(basePadding)` - Responsive padding/margins
- `getResponsiveSpacing(baseSpacing)` - Responsive spacing between elements
- `responsiveStyles.padding` - Standard padding values
- `responsiveStyles.margin` - Standard margin values

### Icons
- `getResponsiveIconSize(baseSize)` - Scales icon sizes appropriately
- `responsiveStyles.icon` - Predefined icon sizes (small, medium, large)

### Cards
- `getResponsiveCardWidth()` - Responsive card width for horizontal lists
- `responsiveStyles.cardWidth` - Standard card width
- `responsiveStyles.cardHeight` - Standard card height (1.5x width)

### Other Elements
- `getResponsiveButtonHeight()` - Responsive button heights
- `getResponsiveBorderRadius()` - Responsive border radius

## Implementation Examples

### Text Sizing
```typescript
// Before (fixed size)
fontSize: 20

// After (responsive)
fontSize: responsiveStyles.subtitle.fontSize
```

### Spacing
```typescript
// Before (fixed spacing)
paddingHorizontal: 20,
marginBottom: 16

// After (responsive)
paddingHorizontal: getResponsivePadding(20),
marginBottom: getResponsiveSpacing(16)
```

### Icons
```typescript
// Before (fixed size)
<ChevronLeft size={20} />

// After (responsive)
<ChevronLeft size={getResponsiveIconSize(20)} />
```

### Cards
```typescript
// Before (fixed percentage)
const itemWidth = width * 0.28;

// After (responsive)
const itemWidth = getResponsiveCardWidth();
```

## Scaling Factors

The system applies different scaling factors based on screen size:

### Small Screens (≤ 375px)
- Text: 0.85x (smaller for better fit)
- Padding: 0.7x (tighter spacing)
- Icons: 0.8x (smaller icons)
- Cards: 32% width (slightly wider)

### Medium Screens (376px - 414px)
- Text: 1.0x (base size)
- Padding: 1.0x (standard spacing)
- Icons: 1.0x (standard size)
- Cards: 28% width (standard)

### Large Screens (415px - 768px)
- Text: 1.1x (slightly larger)
- Padding: 1.2x (more spacious)
- Icons: 1.1x (slightly larger)
- Cards: 25% width (narrower)

### XLarge Screens (> 768px)
- Text: 1.2x (larger for tablets)
- Padding: 1.4x (very spacious)
- Icons: 1.2x (larger icons)
- Cards: 22% width (narrowest)

## Components Updated

The following components have been updated with responsive design:

1. **LiveTvInfoPage** - Channel details, EPG listings, program guide
2. **LiveTvCard** - Channel card titles and overlays
3. **LiveTvSection** - Section titles and spacing
4. **SectionComponent** - Movie sections and cards
5. **HeroCarousel** - Hero banner text and buttons
6. **MovieCard** - Movie card text and spacing
7. **HomePage** - Loading states and error messages

## Benefits

1. **Better UX on Small Screens**: Text and elements are appropriately sized for small phones
2. **Optimal Use of Space**: Padding and margins adjust to screen real estate
3. **Consistent Scaling**: All elements scale proportionally
4. **Future-Proof**: Easy to add new breakpoints or adjust scaling factors
5. **Maintainable**: Centralized responsive logic in one utility file

## Usage

Import the responsive utilities in your components:

```typescript
import { 
  responsiveStyles, 
  getResponsiveFontSize, 
  getResponsivePadding, 
  getResponsiveSpacing,
  getResponsiveIconSize,
  getResponsiveCardWidth 
} from '../utils/responsive';
```

Then use them in your styles:

```typescript
const styles = StyleSheet.create({
  title: {
    fontSize: responsiveStyles.title.fontSize,
    marginBottom: getResponsiveSpacing(16),
  },
  container: {
    paddingHorizontal: getResponsivePadding(20),
  },
});
```

This responsive design system ensures your app provides an optimal viewing experience across all device sizes while maintaining design consistency and code maintainability.



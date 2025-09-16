# Roboto Font Setup Guide

## 🎨 **Available Fonts**

### Roboto Font Family (Primary Font)
- `Roboto_400Regular` - Regular weight
- `Roboto_500Medium` - Medium weight
- `Roboto_700Bold` - Bold weight
- `Roboto_900Black` - Black weight

**Note**: The entire app uses Roboto font family for consistency and clean typography. Roboto is Google's signature font designed for optimal readability across devices.

## 🚀 **How to Use**

### Method 1: Using Font Constants
```typescript
import { Fonts } from '../src/utils/fonts';

const styles = StyleSheet.create({
  title: {
    fontFamily: Fonts.bold,
    fontSize: 24,
  },
  subtitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
  },
});
```

### Method 2: Using Responsive Styles (Recommended)
```typescript
import { responsiveStyles } from '../src/utils/responsive';

const styles = StyleSheet.create({
  title: {
    ...responsiveStyles.title, // Includes fontSize and fontFamily
  },
  body: {
    ...responsiveStyles.body, // Includes fontSize and fontFamily
  },
});
```

### Method 3: Using Predefined Font Styles
```typescript
import { FontStyles } from '../src/utils/fonts';

const styles = StyleSheet.create({
  header: {
    ...FontStyles.h1, // Complete style with fontFamily, fontSize, lineHeight
  },
  button: {
    ...FontStyles.button, // Complete button text style
  },
});
```

## 📱 **Responsive Font Sizes**

The responsive system automatically adjusts font sizes based on screen width:

- **Small screens (≤375px)**: 85% of base size
- **Medium screens (376-414px)**: 100% of base size  
- **Large screens (415-768px)**: 110% of base size
- **XLarge screens (>768px)**: 120% of base size

## 🎯 **Best Practices**

### 1. Use Responsive Styles
```typescript
// ✅ Good - Uses responsive system
const styles = StyleSheet.create({
  title: {
    ...responsiveStyles.title,
    color: '#FFFFFF',
  },
});

// ❌ Avoid - Hardcoded values
const styles = StyleSheet.create({
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
  },
});
```

### 2. Font Hierarchy
- **Display**: Use Roboto Black for large titles
- **Headers**: Use Roboto Bold for main headers
- **Subheaders**: Use Roboto Bold for subheaders
- **Body**: Use Roboto Regular/Medium for content
- **UI Elements**: Use Roboto Bold for buttons, labels, etc.

### 3. Font Weight Guidelines
- **Headers**: Bold (700) or Black (900)
- **Subheaders**: Bold (700)
- **Body Text**: Regular (400) or Medium (500)
- **Captions**: Regular (400)

## 🔧 **Migration from Old Font System**

### Before (Old System)
```typescript
const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Inter', // This wasn't working
  },
});
```

### After (New System)
```typescript
const styles = StyleSheet.create({
  title: {
    ...responsiveStyles.title, // Includes proper fontFamily and responsive fontSize
  },
});
```

## 📦 **Font Loading**

Fonts are automatically loaded in `app/_layout.tsx` using `useFonts` hook. The app shows a loading screen until fonts are ready.

## 🎨 **Font Combinations**

### Modern & Clean
- **Headers**: Roboto Bold/Black
- **Body**: Roboto Regular/Medium

### Professional
- **All Text**: Roboto (various weights)

### Creative
- **Headers**: Roboto Black
- **Body**: Roboto Medium

## 🚨 **Important Notes**

1. **Always use the font constants** - Don't hardcode font names
2. **Use responsive styles** - They include both fontFamily and fontSize
3. **Test on different screen sizes** - Fonts scale automatically
4. **Font loading** - App waits for fonts to load before showing content

## 📝 **Example Implementation**

```typescript
import { responsiveStyles } from '../src/utils/responsive';
import { Fonts } from '../src/utils/fonts';

const MyComponent = () => {
  return (
    <View>
      <Text style={styles.title}>Main Title</Text>
      <Text style={styles.subtitle}>Subtitle Text</Text>
      <Text style={styles.body}>Body content goes here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    ...responsiveStyles.title,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    ...responsiveStyles.subtitle,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  body: {
    ...responsiveStyles.body,
    color: '#CCCCCC',
    lineHeight: 24,
  },
});
```

# Font Migration Guide (DEPRECATED - Now Using Roboto)

## ⚠️ **This guide is outdated - App now uses Roboto font**

Please refer to `ROBOTO_MIGRATION.md` for the current font system.

## ✅ **What Was Done Previously**

1. **Removed Inter font** - Uninstalled `@expo-google-fonts/inter` package
2. **Updated font loading** - Only Poppins fonts were loaded in `_layout.tsx`
3. **Simplified font constants** - `Fonts.regular`, `Fonts.bold`, etc. (no more `Fonts.Inter.bold`)
4. **Updated responsive styles** - All used Poppins font family
5. **Fixed font errors** - Resolved the Inter font loading issues

**Current Status**: App now uses Roboto font everywhere. See `ROBOTO_MIGRATION.md` for current usage.

## 🚀 **How to Use Poppins Everywhere**

### Method 1: Using Responsive Styles (Recommended)
```typescript
import { responsiveStyles } from '../src/utils/responsive';

const styles = StyleSheet.create({
  title: {
    ...responsiveStyles.title, // Includes Poppins bold + responsive fontSize
    color: '#FFFFFF',
  },
  body: {
    ...responsiveStyles.body, // Includes Poppins regular + responsive fontSize
    color: '#CCCCCC',
  },
});
```

### Method 2: Using Font Constants
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

### Method 3: Using Predefined Styles
```typescript
import { FontStyles } from '../src/utils/fonts';

const styles = StyleSheet.create({
  header: {
    ...FontStyles.h1, // Complete style with Poppins bold
  },
  button: {
    ...FontStyles.button, // Complete button style with Poppins semiBold
  },
});
```

## 🔄 **Migration Steps for Existing Code**

### Step 1: Add Font Import
```typescript
import { Fonts } from '../src/utils/fonts';
```

### Step 2: Replace Old Font References
```typescript
// ❌ Old way
fontFamily: 'Inter',
fontFamily: 'Inter_700Bold',
Fonts.Inter.bold,

// ✅ New way
fontFamily: Fonts.regular,
fontFamily: Fonts.bold,
Fonts.bold,
```

### Step 3: Use Responsive Styles When Possible
```typescript
// ❌ Old way
const styles = StyleSheet.create({
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
  },
});

// ✅ New way
const styles = StyleSheet.create({
  title: {
    ...responsiveStyles.title, // Includes both fontFamily and fontSize
  },
});
```

## 📱 **Font Weights Available**

- `Fonts.regular` - Poppins 400 Regular
- `Fonts.medium` - Poppins 500 Medium
- `Fonts.semiBold` - Poppins 600 SemiBold
- `Fonts.bold` - Poppins 700 Bold
- `Fonts.extraBold` - Poppins 800 ExtraBold
- `Fonts.black` - Poppins 900 Black

## 🎯 **Best Practices**

1. **Use responsive styles** - They include both fontFamily and responsive fontSize
2. **Be consistent** - Use the same font weights for similar elements
3. **Import Fonts** - Always import `{ Fonts }` when using font constants
4. **Test on devices** - Verify fonts look good on different screen sizes

## 🚨 **Important Notes**

- **No more Inter font** - The app now uses only Poppins
- **Simplified constants** - `Fonts.bold` instead of `Fonts.Inter.bold`
- **Responsive by default** - All responsive styles include Poppins font family
- **Loading handled** - Fonts are loaded automatically in `_layout.tsx`

## 🔧 **Quick Fixes**

If you see font-related errors:

1. **Add Font import**: `import { Fonts } from '../src/utils/fonts';`
2. **Replace hardcoded fonts**: `'Inter'` → `Fonts.regular`
3. **Use responsive styles**: `...responsiveStyles.title` instead of manual font properties
4. **Check font names**: Use `Fonts.bold` not `Fonts.Inter.bold`

The app now has a clean, consistent Poppins font system that's easy to use and maintain!

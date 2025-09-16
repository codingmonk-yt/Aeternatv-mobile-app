#!/usr/bin/env node

/**
 * Script to update all font references to use Poppins
 * Run with: node scripts/update-fonts.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Font mapping from old to new
const fontMappings = {
  // Remove old Inter references
  "fontFamily: 'Inter'": "fontFamily: Fonts.regular",
  "fontFamily: 'Inter_400Regular'": "fontFamily: Fonts.regular",
  "fontFamily: 'Inter_500Medium'": "fontFamily: Fonts.medium",
  "fontFamily: 'Inter_600SemiBold'": "fontFamily: Fonts.semiBold",
  "fontFamily: 'Inter_700Bold'": "fontFamily: Fonts.bold",
  "fontFamily: 'Inter_800ExtraBold'": "fontFamily: Fonts.extraBold",
  "fontFamily: 'Inter_900Black'": "fontFamily: Fonts.black",
  
  // Update Poppins references to simplified format
  "fontFamily: 'Poppins_400Regular'": "fontFamily: Fonts.regular",
  "fontFamily: 'Poppins_500Medium'": "fontFamily: Fonts.medium",
  "fontFamily: 'Poppins_600SemiBold'": "fontFamily: Fonts.semiBold",
  "fontFamily: 'Poppins_700Bold'": "fontFamily: Fonts.bold",
  "fontFamily: 'Poppins_800ExtraBold'": "fontFamily: Fonts.extraBold",
  "fontFamily: 'Poppins_900Black'": "fontFamily: Fonts.black",
  
  // Update Fonts.Inter references
  "Fonts.Inter.regular": "Fonts.regular",
  "Fonts.Inter.medium": "Fonts.medium",
  "Fonts.Inter.semiBold": "Fonts.semiBold",
  "Fonts.Inter.bold": "Fonts.bold",
  "Fonts.Inter.extraBold": "Fonts.extraBold",
  "Fonts.Inter.black": "Fonts.black",
  
  // Update Fonts.Poppins references
  "Fonts.Poppins.regular": "Fonts.regular",
  "Fonts.Poppins.medium": "Fonts.medium",
  "Fonts.Poppins.semiBold": "Fonts.semiBold",
  "Fonts.Poppins.bold": "Fonts.bold",
  "Fonts.Poppins.extraBold": "Fonts.extraBold",
  "Fonts.Poppins.black": "Fonts.black",
};

// Find all TypeScript and JavaScript files
const files = glob.sync('**/*.{ts,tsx,js,jsx}', {
  ignore: ['node_modules/**', 'dist/**', 'build/**']
});

let totalFiles = 0;
let totalReplacements = 0;

console.log('🔄 Updating font references to use Poppins...\n');

files.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let fileReplacements = 0;
    
    // Apply all font mappings
    Object.entries(fontMappings).forEach(([oldPattern, newPattern]) => {
      const regex = new RegExp(oldPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, newPattern);
        fileReplacements += matches.length;
      }
    });
    
    if (fileReplacements > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${filePath}: ${fileReplacements} replacements`);
      totalFiles++;
      totalReplacements += fileReplacements;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n🎉 Font update complete!`);
console.log(`📁 Files updated: ${totalFiles}`);
console.log(`🔄 Total replacements: ${totalReplacements}`);
console.log(`\n💡 Don't forget to add Fonts import where needed:`);
console.log(`   import { Fonts } from '../src/utils/fonts';`);



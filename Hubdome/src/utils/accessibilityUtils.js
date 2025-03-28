// Add a utility function to check color contrast
// src/utils/accessibilityUtils.js

// Calculate contrast ratio between two colors
export const getContrastRatio = (foreground, background) => {
    // Convert hex to RGB
    const getRGB = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };
  
    // Calculate relative luminance
    const getLuminance = (rgb) => {
      const a = rgb.map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };
  
    const rgb1 = getRGB(foreground);
    const rgb2 = getRGB(background);
    const l1 = getLuminance(rgb1);
    const l2 = getLuminance(rgb2);
    
    // Calculate contrast ratio
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    
    return ratio;
  };
  
  // Determine if text will be readable against a background
  export const isReadable = (foreground, background, level = 'AA') => {
    const ratio = getContrastRatio(foreground, background);
    return (level === 'AA') ? ratio >= 4.5 : ratio >= 7;
  };
import { DefaultTheme } from "react-native-paper";

// Custom theme based on our brand identity document
export const theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: "#3498DB", // Vibrant Blue
    accent: "#FF7F50", // Energetic Coral
    background: "#1E1E2A", // Dark background
    surface: "#2A2A36", // Slightly lighter surface
    text: "#FFFFFF", // White text
    placeholder: "#BBBBBB", // Light gray for placeholders
    error: "#E74C3C", // Red for errors
    notification: "#FF7F50", // Energetic Coral for notifications
    secondary: "#2ECC71", // Fresh Mint for secondary elements
    success: "#2ECC71", // Fresh Mint for success states
    warning: "#F1C40F", // Warm Yellow for warnings
    // Additional brand colors
    darkNavy: "#2C3E50", // For depth and contrast
    purple: "#9B59B6", // Deep Purple for creative elements
    softGray: "#ECF0F1", // For light mode elements if needed
  },
  // Custom properties
  roundness: 8,
  animation: {
    scale: 1.0,
  },
  fonts: {
    ...DefaultTheme.fonts,
    // You can customize fonts here based on loaded fonts
  },
};

// Color palette for different hobby types
export const hobbyColors = {
  Photography: "#F97316", // Orange
  Hiking: "#3B82F6", // Blue
  Cooking: "#EF4444", // Red
  Gaming: "#8B5CF6", // Purple
  Music: "#EC4899", // Pink
  Art: "#14B8A6", // Teal
  Reading: "#22C55E", // Green
  Travel: "#F59E0B", // Amber
  Sports: "#3498DB", // Vibrant Blue
  Technology: "#6366F1", // Indigo
  default: "#3498DB", // Default to our primary color
};

// Map styles for dark theme
export const mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#1d2c4d",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8ec3b9",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1a3646",
      },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#4b6878",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#64779e",
      },
    ],
  },
  {
    featureType: "administrative.province",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#4b6878",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#304a7d",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#1f2835",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#98a5be",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#0e1626",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#4e6d70",
      },
    ],
  },
];

// Spacing scale for consistent UI
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typography scale
export const typography = {
  heading1: {
    fontSize: 28,
    fontWeight: "bold",
  },
  heading2: {
    fontSize: 24,
    fontWeight: "bold",
  },
  heading3: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 14,
  },
  small: {
    fontSize: 12,
  },
};

// Shadow styles for elevation
export const shadows = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

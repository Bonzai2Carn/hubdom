import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

// Define the context type
interface GestureContextType {
  enableSwipe: boolean;
  enableLongPress: boolean;
  enablePinch: boolean;
  enableRotate: boolean;
  toggleSwipe: () => void;
  toggleLongPress: () => void;
  togglePinch: () => void;
  toggleRotate: () => void;
  setGestureEnabled: (gesture: GestureType, enabled: boolean) => void;
}

// Define gesture types
type GestureType = 'swipe' | 'longPress' | 'pinch' | 'rotate';

// Create the context
const GestureContext = createContext<GestureContextType | undefined>(undefined);

// Create the provider component
export const GestureProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state for each gesture type
  const [enableSwipe, setEnableSwipe] = useState(true);
  const [enableLongPress, setEnableLongPress] = useState(true);
  const [enablePinch, setEnablePinch] = useState(true);
  const [enableRotate, setEnableRotate] = useState(true);

  // Toggle methods for each gesture
  const toggleSwipe = () => setEnableSwipe(prev => !prev);
  const toggleLongPress = () => setEnableLongPress(prev => !prev);
  const togglePinch = () => setEnablePinch(prev => !prev);
  const toggleRotate = () => setEnableRotate(prev => !prev);

  // Generic method to set gesture state
  const setGestureEnabled = (gesture: GestureType, enabled: boolean) => {
    switch (gesture) {
      case 'swipe':
        setEnableSwipe(enabled);
        break;
      case 'longPress':
        setEnableLongPress(enabled);
        break;
      case 'pinch':
        setEnablePinch(enabled);
        break;
      case 'rotate':
        setEnableRotate(enabled);
        break;
    }
  };

  return (
    <GestureContext.Provider
      value={{
        enableSwipe,
        enableLongPress,
        enablePinch,
        enableRotate,
        toggleSwipe,
        toggleLongPress,
        togglePinch,
        toggleRotate,
        setGestureEnabled,
      }}
    >
      <GestureHandlerRootView style={styles.container}>
        {children}
      </GestureHandlerRootView>
    </GestureContext.Provider>
  );
};

// Custom hook to use gesture context
export const useGestures = () => {
  const context = useContext(GestureContext);
  if (context === undefined) {
    throw new Error('useGestures must be used within a GestureProvider');
  }
  return context;
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// Export gesture type
export type { GestureType };
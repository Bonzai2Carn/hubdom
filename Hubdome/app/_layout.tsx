import React, { useEffect, useState } from 'react';
import { Slot, Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store
import store from '../src/redux/store';
import { useAppDispatch, useAppSelector } from '../src/redux/hooks';
import { fetchCurrentUser } from '../src/redux/actions/authActions';

// Theme
import { theme } from '../src/utils/theme';

// Components
import LoadingScreen from '../src/screens/common/LoadingScreen';

// Wrapper component to handle authentication and app state
const AppWrapper = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [appIsReady, setAppIsReady] = useState(false);

  // Check if this is the first launch (for onboarding)
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
        setIsFirstLaunch(hasCompletedOnboarding !== 'true');
      } catch (error) {
        console.error('Error checking first launch status:', error);
        setIsFirstLaunch(true);
      }
    };

    checkFirstLaunch();
  }, []);

  // Initialize app - fetch current user if token exists
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await dispatch(fetchCurrentUser());
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setAppIsReady(true);
      }
    };

    initializeApp();
  }, [dispatch]);

  // Show loading screen while checking auth state
  if (loading || isFirstLaunch === null || !appIsReady) {
    return <LoadingScreen />;
  }

  // Return the appropriate stack based on auth state and onboarding status
  if (!isAuthenticated) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
      </Stack>
    );
  } else if (isFirstLaunch) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
      </Stack>
    );
  } else {
    return <Slot />;
  }
};

// Root layout component
export default function RootLayout() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <AppWrapper />
        </SafeAreaProvider>
      </PaperProvider>
    </Provider>
  );
}
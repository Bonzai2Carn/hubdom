import React from 'react';
import { Redirect } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';

/**
 * This is the main entry point of the application
 * It redirects to the appropriate initial screen based on authentication status
 */
export default function Index() {
  const { isAuthenticated, hasCompletedOnboarding } = useAppSelector(
    (state) => state.auth
  );

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/(onboarding)" />;
  }

  return <Redirect href="/(tabs)/map" />;
}
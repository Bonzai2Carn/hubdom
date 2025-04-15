import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAppSelector } from '../../Hubdome/src/redux/hooks';

/**
 * This is the main entry point of the application
 * It redirects to the appropriate initial screen based on authentication status
 */
export default function Index() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Redirect authenticated users to the home screen (map)
  // Otherwise redirect to auth flow
  return isAuthenticated ? <Redirect href="./home/map" /> : <Redirect href="./auth/login" />;
}
import React from 'react';
import ProfileScreen from '../../src/screens/profile/ProfileScreen';
import { useRouter } from 'expo-router';
import { ScreenNavigationProp } from '../../src/screens/profile/ProfileScreen'; // adjust import as needed

export default function Profile() {
  const router = useRouter();

  // Create a navigation prop compatible with the existing component
  const navigationProp = {
    navigate: (screen: string, params?: any) => {
      if (screen.includes('Detail')) {
        router.push({
          pathname: `./home/${screen.toLowerCase().replace('detail', '-detail')}`,
          params: params,
        });
      } else {
        router.push(`./home/${screen.toLowerCase()}`);
      }
    },
    goBack: () => router.back(),
    dispatch: () => {},
    reset: () => {},
    preload: () => {},
    // Add other required members as needed
  } as unknown as ScreenNavigationProp;

  return <ProfileScreen navigation={navigationProp} />;
}
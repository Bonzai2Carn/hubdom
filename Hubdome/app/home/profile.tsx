import React from 'react';
import ProfileScreen from '../../../Hubdome/src/screens/profile/ProfileScreen';
import { useRouter } from 'expo-router';
import { ScreenNavigationProp } from '../../../Hubdome/src/screens/profile/ProfileScreen'; // adjust import as needed

export default function Profile() {
  const router = useRouter();

  // Create a navigation prop compatible with the existing component
  const navigationProp = {
    navigate: (screen: string, params?: any) => {
      if (screen.includes('Detail')) {
        router.push({
          pathname: `./${screen.toLowerCase().replace('detail', '-detail')}`,
          params: params,
        });
      } else {
        router.push(`./${screen.toLowerCase()}`);
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
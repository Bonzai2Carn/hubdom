import React from 'react';
import { useRouter } from 'expo-router';
import ProfileScreen from '../../../src/screens/profile/ProfileScreen';

export default function Profile() {
  const router = useRouter();

  // Create a navigation prop compatible with the existing component
  const navigationProp = {
    navigate: (screen: string, params?: any) => {
      switch (screen) {
        case 'EventDetail':
          router.push({
            pathname: `../(modals)/event-detail`,
            params: params
          });
          break;
        case 'HobbyDetail':
          router.push({
            pathname: `../(modals)/hobby-detail`,
            params: params
          });
          break;
        case 'EditProfile':
          router.push(`./(tabs)/profile/edit-profile`);
          break;
        case 'CreateHobby':
          router.push(`../(modals)/create-hobby`);
          break;
        default:
          router.push(`./(tabs)/${screen.toLowerCase()}`);
      }
    },
    goBack: () => router.back(),
    dispatch: () => {},
    isFocused: () => true,
    canGoBack: () => true,
    setParams: () => {},
    addListener: () => { 
        return { remove: () => {} }; },
    reset: () => {}
  };

  return <ProfileScreen navigate={navigationProp} />;
}
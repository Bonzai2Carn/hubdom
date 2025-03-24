import React from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen from '../src/screens/onboarding/OnboardingScreen';

export default function Onboarding() {
  const router = useRouter();

  // Handle onboarding completion
  const handleOnboardingComplete = async (selectedActivities: Record<number, string[]>) => {
    try {
      // Save selected activities (could be saved to API in the future)
      await AsyncStorage.setItem('userActivities', JSON.stringify(selectedActivities));
      
      // Mark onboarding as completed
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      
      // Navigate to home screen
      router.replace('./home/map');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <OnboardingScreen 
      navigation={{} as any} // Not needed with Expo Router 
      onComplete={handleOnboardingComplete} 
    />
  );
}
// app/onboarding.tsx
import React from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen, { OnboardingData } from '../src/screens/onboarding/OnboardingScreen';
import { useAppDispatch } from '../src/redux/hooks';
import { setUser } from '../src/redux/slices/userSlice';
import authService from '../src/services/authService';

export default function Onboarding() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Handle onboarding completion
  const handleOnboardingComplete = async (data: OnboardingData) => {
    try {
      // Save onboarding data to backend
      const response = await authService.updateUserProfile({
        hobbies: flattenSelectedActivities(data.selectedActivities),
        avatarType: data.avatarType,
        displayName: data.displayName,
        notificationPreferences: data.notificationPreferences,
      });
      
      // Update user in Redux
      if (response && response.user) {
        dispatch(setUser({
          ...response.user,
          avatarType: data.avatarType,
        }));
      }
      
      // Mark onboarding as completed
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      
      // Navigate to home screen
      router.replace('./home/map');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // You might want to handle errors differently
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      router.replace('./home/map');
    }
  };

  // Helper function to flatten selected activities into string array
  const flattenSelectedActivities = (selectedActivities: Record<number, string[]>): string[] => {
    const flattened: string[] = [];
    Object.values(selectedActivities).forEach(activities => {
      activities.forEach(activity => {
        if (!flattened.includes(activity)) {
          flattened.push(activity);
        }
      });
    });
    return flattened;
  };

  return (
    <OnboardingScreen 
      navigation={{} as any} // Not needed with Expo Router 
      onComplete={handleOnboardingComplete} 
    />
  );
}
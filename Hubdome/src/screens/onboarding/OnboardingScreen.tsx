// src/screens/onboarding/OnboardingScreen.tsx

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppDispatch } from '../../redux/hooks';
import { completeOnboarding } from '../../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import type { Router } from 'expo-router';

// Import components
import HobbyCategorySelector from '../../components/onboarding/HobbyCategorySelector';
import AvatarSelector from '../../components/onboarding/AvatarSelection';
import LocationPermissionStep from '../../components/onboarding/LocationPermissionStep';
import NotificationPreferences from '../../components/onboarding/NotificationPreference';

// Add interface for props
interface OnboardingScreenProps {
  navigation: Router;
  onComplete?: (data: {
    selectedActivities: Record<string, string[]>;
    avatarType: string;
    displayName: string;
    notificationPreferences: {
      events: boolean;
      messages: boolean;
      nearbyActivities: boolean;
    };
  }) => Promise<void>;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation, onComplete }) => {
  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedHobbies, setSelectedHobbies] = useState<Record<string, string[]>>({});
  const [selectedAvatar, setSelectedAvatar] = useState<string>("explorer");
  const [displayName, setDisplayName] = useState<string>("");
  const [locationPermission, setLocationPermission] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    events: true,
    messages: true,
    nearbyActivities: true
  });

  // Redux
  const dispatch = useAppDispatch();

  // Handle hobby selection
  const handleHobbySelect = useCallback((category: string, subcategory: string) => {
    setSelectedHobbies(prev => {
      const prevSubcategories = prev[category] || [];
      const exists = prevSubcategories.includes(subcategory);

      if (exists) {
        const updatedSubcategories = prevSubcategories.filter(sub => sub !== subcategory);
        return updatedSubcategories.length === 0 
          ? Object.fromEntries(Object.entries(prev).filter(([key]) => key !== category))
          : { ...prev, [category]: updatedSubcategories };
      }

      return {
        ...prev,
        [category]: [...prevSubcategories, subcategory]
      };
    });
  }, []);

  // Use useEffect for any side effects
  useEffect(() => {
    // Initialize any required data
  }, []);

  // Steps for onboarding
  const steps = [
    {
      id: 'hobbies',
      title: 'Choose Your Hobbies',
      description: 'Select hobbies you enjoy or want to explore',
      component: <HobbyCategorySelector 
        selectedHobbies={selectedHobbies} 
        onHobbySelect={handleHobbySelect} 
      />
    },
    {
      id: 'location',
      title: 'Enable Location Services',
      description: 'Help us find hobby events and enthusiasts near you',
      component: <LocationPermissionStep
        hasPermission={locationPermission}
        onPermissionChanged={setLocationPermission}
      />
    },
    {
      id: 'notifications',
      title: 'Notification Preferences',
      description: 'Choose how you want to stay updated',
      component: <NotificationPreferences
        preferences={notificationPreferences}
        onUpdatePreferences={setNotificationPreferences}
      />
    },
    {
      id: 'avatar',
      title: 'Select Your Avatar',
      description: 'Choose an avatar type that represents you',
      component: <AvatarSelector 
        selectedAvatar={selectedAvatar} 
        onSelectAvatar={setSelectedAvatar} 
        displayName={displayName}
        onUpdateDisplayName={setDisplayName}
      />
    }
  ];

  // Complete onboarding
  const handleComplete = async () => {
    try {
      // Save onboarding data
      await AsyncStorage.multiSet([
        ['hasCompletedOnboarding', 'true'],
        ['userHobbies', JSON.stringify(selectedHobbies)],
        ['userAvatar', JSON.stringify(selectedAvatar)],
        ['locationPermission', JSON.stringify(locationPermission)],
        ['notificationPreferences', JSON.stringify(notificationPreferences)]
      ]);
      
      // Dispatch action to update Redux state
      dispatch(completeOnboarding({
        hobbies: selectedHobbies,
        avatar: selectedAvatar,
        locationPermission,
        notificationPreferences
      }));
      
      if (onComplete) {
        await onComplete({
          selectedActivities: selectedHobbies,
          avatarType: selectedAvatar,
          displayName: displayName,
          notificationPreferences
        });
      } else {
        // Navigate to home screen
        navigation.replace('./home/map');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  // Check if can proceed to next step
  const canProceed = () => {
    switch (currentStep) {
      case 0: // Hobbies step
        return Object.keys(selectedHobbies).length > 0;
      case 1: // Location step
        return locationPermission;
      case 2: // Notifications step
        return true; // Always allow proceeding as notifications are optional
      case 3: // Avatar step
        return !!selectedAvatar;
      default:
        return true;
    }
  };

  // Navigate to next step
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  // Navigate to previous step
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Current step data
  const currentStepData = steps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1E2A" />
      
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        {steps.map((step, index) => (
          <View 
            key={step.id}
            style={[
              styles.progressDot,
              index === currentStep && styles.progressDotActive,
              index < currentStep && styles.progressDotCompleted
            ]}
          />
        ))}
      </View>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{currentStepData.title}</Text>
        <Text style={styles.headerSubtitle}>{currentStepData.description}</Text>
      </View>
      
      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {currentStepData.component}
      </ScrollView>
      
      {/* Navigation buttons */}
      <View style={styles.footer}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={goToPreviousStep}>
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[
            styles.nextButton,
            !canProceed() && styles.nextButtonDisabled
          ]}
          onPress={goToNextStep}
          disabled={!canProceed()}
        >
          <Text style={styles.nextButtonText}>
            {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
          </Text>
          <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2A',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#3498DB',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  progressDotCompleted: {
    backgroundColor: '#2ECC71',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 16,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498DB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  nextButtonDisabled: {
    backgroundColor: 'rgba(52, 152, 219, 0.5)',
  },
  nextButtonText: {
    color: '#FFFFFF',
    marginRight: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
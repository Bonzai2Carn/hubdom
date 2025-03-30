// src/screens/onboarding/LocationPermissionStep.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

interface LocationPermissionStepProps {
  hasPermission: boolean;
  onPermissionChanged: (hasPermission: boolean) => void;
}

const LocationPermissionStep: React.FC<LocationPermissionStepProps> = ({
  hasPermission,
  onPermissionChanged,
}) => {
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');

  // Check permission status on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationStatus('granted');
        onPermissionChanged(true);
      } else {
        setLocationStatus('idle');
      }
    })();
  }, []);

  const requestLocationPermission = async () => {
    setLocationStatus('requesting');
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        setLocationStatus('granted');
        onPermissionChanged(true);
      } else {
        setLocationStatus('denied');
        onPermissionChanged(false);
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLocationStatus('denied');
      onPermissionChanged(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <MaterialIcons name="location-on" size={60} color="#3498DB" style={styles.icon} />
        
        <Text style={styles.title}>Enable Location</Text>
        
        <Text style={styles.description}>
          Allow HobbyHub to access your location to discover nearby hobby events, 
          connect with local enthusiasts, and get personalized recommendations.
        </Text>
        
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <MaterialIcons name="place" size={20} color="#3498DB" />
            <Text style={styles.benefitText}>Discover nearby events</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <MaterialIcons name="groups" size={20} color="#3498DB" />
            <Text style={styles.benefitText}>Meet local hobby enthusiasts</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <MaterialIcons name="notifications" size={20} color="#3498DB" />
            <Text style={styles.benefitText}>Get relevant activity alerts</Text>
          </View>
        </View>
        
        <Text style={styles.privacyNote}>
          Your location data will only be used while using the app and according to our privacy policy.
          You can change this later in settings.
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        {locationStatus === 'granted' ? (
          <View style={styles.permissionGrantedContainer}>
            <MaterialIcons name="check-circle" size={24} color="#2ECC71" />
            <Text style={styles.permissionGrantedText}>Location access granted</Text>
          </View>
        ) : locationStatus === 'denied' ? (
          <View>
            <Text style={styles.permissionDeniedText}>
              Location permission denied. Some features may be limited.
            </Text>
            <Button
              mode="contained"
              onPress={requestLocationPermission}
              style={styles.retryButton}
              contentStyle={styles.buttonContent}
            >
              Try Again
            </Button>
          </View>
        ) : (
          <Button
            mode="contained"
            onPress={requestLocationPermission}
            loading={locationStatus === 'requesting'}
            disabled={locationStatus === 'requesting'}
            style={styles.allowButton}
            contentStyle={styles.buttonContent}
          >
            Allow Location Access
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  benefitsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  privacyNote: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  allowButton: {
    backgroundColor: '#3498DB',
    width: '100%',
  },
  retryButton: {
    backgroundColor: '#3498DB',
    marginTop: 16,
  },
  buttonContent: {
    height: 48,
  },
  permissionGrantedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
  },
  permissionGrantedText: {
    color: '#2ECC71',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  permissionDeniedText: {
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default LocationPermissionStep;
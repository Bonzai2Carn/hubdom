// src/utils/secureStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Use more secure storage when available
export async function setSecureItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    // Web doesn't support SecureStore, fallback to AsyncStorage
    await AsyncStorage.setItem(key, value);
  } else {
    // Use SecureStore on native platforms
    await SecureStore.setItemAsync(key, value);
  }
}

export async function getSecureItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return await AsyncStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

export async function removeSecureItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}
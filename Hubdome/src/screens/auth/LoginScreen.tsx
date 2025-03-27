// src/screens/auth/LoginScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loginUser, socialLogin } from '../../redux/actions/authActions';
import { clearError } from '../../redux/slices/authSlice';
import { theme } from '../../utils/theme';
import  {useRouter} from 'expo-router';

const LoginScreen: React.FC = () => {
  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Redux
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  // Navigation
  // const navigation = useNavigation<StackNavigationProp<any>>();
  const router = useRouter();

  // Effects
  useEffect(() => {
    // Show error message if there is one
    console.log('Error type:', typeof error, 'Error value:', error);
    if (error) {
      setErrorVisible(true);
    }
  }, [error]);

  useEffect(() => {
    setIsLoggingIn(loading);
  }, [loading]);

  // Handle login form submission
  const handleLogin = async () => {
    // Simple form validation
    if (!email.trim() || !password.trim()) {
      // Show error for empty fields
      return;
    }

    try {
      // Dispatch login action
      await dispatch(loginUser({ email, password })).unwrap();
      
      // Navigate to home on success (should be handled by MainNavigator)
    } catch (err) {
      // Error handling done by useEffect
      console.error('Login failed:', err);
    }
  };

  // Social login handlers
  const handleGoogleLogin = async () => {
    try {
      // In a real implementation, you'd integrate with Google OAuth
      // Mock implementation for now
      dispatch(socialLogin({
        provider: 'google',
        token: 'mock-google-token',
      }));
    } catch (err) {
      console.error('Google login failed:', err);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      // In a real implementation, you'd integrate with Facebook OAuth
      dispatch(socialLogin({
        provider: 'facebook',
        token: 'mock-facebook-token',
      }));
    } catch (err) {
      console.error('Facebook login failed:', err);
    }
  };

  // const handleAppleLogin = async () => {
  //   try {
  //     // In a real implementation, you'd integrate with Apple Sign In
  //     dispatch(socialLogin({
  //       provider: 'apple',
  //       token: 'mock-apple-token',
  //     }));
  //   } catch (err) {
  //     console.error('Apple login failed:', err);
  //   }
  // };

  // Dismiss error snackbar
  const dismissError = () => {
    setErrorVisible(false);
    dispatch(clearError());
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo and Header */}
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>HH</Text>
            </View>
            <Text style={styles.appTitle}>HobbyHub</Text>
            <Text style={styles.tagline}>Connect Through What You Love</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              left={<TextInput.Icon icon="email" color={theme.colors.placeholder} />}
              theme={{ colors: { primary: theme.colors.primary } }}
              outlineColor="rgba(255, 255, 255, 0.1)"
              selectionColor={theme.colors.primary}
              textColor={theme.colors.text}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!isPasswordVisible}
              style={[styles.input, { marginTop: 16 }]}
              left={<TextInput.Icon icon="lock" color={theme.colors.placeholder} />}
              right={
                <TextInput.Icon
                  icon={isPasswordVisible ? "eye-off" : "eye"}
                  color={theme.colors.placeholder}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                />
              }
              theme={{ colors: { primary: theme.colors.primary } }}
              outlineColor="rgba(255, 255, 255, 0.1)"
              selectionColor={theme.colors.primary}
              textColor={theme.colors.text}
            />

            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() => router.push('/auth/forgot-password')}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.loginButton}
              labelStyle={styles.loginButtonText}
              loading={isLoggingIn}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </Button>
          </View>

          {/* Social Login Options */}
          <View style={styles.socialLoginContainer}>
            <Text style={styles.socialLoginText}>Or sign in with</Text>
            <View style={styles.socialButtonsRow}>
              <TouchableOpacity 
                style={[styles.socialButton, styles.googleButton]}
                onPress={handleGoogleLogin}
              >
                <MaterialIcons name="email" size={20} color="#FFFFFF" />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.socialButton, styles.facebookButton]}
                onPress={handleFacebookLogin}
              >
                <MaterialIcons name="facebook" size={20} color="#FFFFFF" />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity 
                style={[styles.socialButton, styles.appleButton]}
                onPress={handleAppleLogin}
              >
                <MaterialIcons name="apple" size={20} color="#FFFFFF" />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity> */}
            </View>
          </View>

          {/* Register Option */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/register')}>
              <Text style={styles.registerLinkText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Error Message */}
      <Snackbar
  visible={errorVisible}
  onDismiss={dismissError}
  duration={3000}
  style={styles.errorSnackbar}
  action={{
    label: 'OK',
    onPress: dismissError,
    color: '#FFFFFF',
  }}
>
  {error || 'An error occurred during login.'}
</Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: theme.colors.placeholder,
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    height: 56,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialLoginContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  socialLoginText: {
    color: theme.colors.placeholder,
    marginBottom: 16,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  socialButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  registerText: {
    color: theme.colors.placeholder,
  },
  registerLinkText: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  errorSnackbar: {
    backgroundColor: theme.colors.error,
  },
});

export default LoginScreen;
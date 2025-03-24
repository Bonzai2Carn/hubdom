// src/screens/auth/RegisterScreen.tsx
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
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { TextInput, Button, Snackbar, HelperText } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { registerUser } from '../../redux/actions/authActions';
import { clearError } from '../../redux/slices/authSlice';
import { theme } from '../../utils/theme';
import { useRouter } from 'expo-router';

const RegisterScreen: React.FC = () => {
  // State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Form validation errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Redux
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  // Navigation
  // const navigation = useNavigation<StackNavigationProp<any>>();
  const router = useRouter();


  // Effects
  useEffect(() => {
    // Show error message if there is one
    if (error) {
      setErrorVisible(true);
    }
  }, [error]);

  useEffect(() => {
    setIsRegistering(loading);
  }, [loading]);

  // Validation
  const validateForm = (): boolean => {
    let isValid = true;
    
    // Reset errors
    setNameError('');
    setEmailError('');
    setUsernameError('');
    setPasswordError('');
    setConfirmPasswordError('');
    
    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    }
    
    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    // Validate username
    if (!username.trim()) {
      setUsernameError('Username is required');
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError('Username can only contain letters, numbers and underscores');
      isValid = false;
    }
    
    // Validate password
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }
    
    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }
    
    return isValid;
  };

  // Handle register form submission
  const handleRegister = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      // Dispatch register action
      await dispatch(registerUser({
        name,
        email,
        username,
        password,
      })).unwrap();
      
      // Registration success - navigation should be handled by MainNavigator
    } catch (err) {
      // Error handling done by useEffect
      console.error('Registration failed:', err);
    }
  };

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
          {/* Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Account</Text>
          </View>

          {/* Register Form */}
          <View style={styles.formContainer}>
            <TextInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="account" color={theme.colors.placeholder} />}
              theme={{ colors: { primary: theme.colors.primary } }}
              outlineColor="rgba(255, 255, 255, 0.1)"
              selectionColor={theme.colors.primary}
              textColor={theme.colors.text}
              error={!!nameError}
            />
            {nameError ? <HelperText type="error" visible={!!nameError}>{nameError}</HelperText> : null}

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              autoCapitalize="none"
              keyboardType="email-address"
              style={[styles.input, { marginTop: nameError ? 8 : 16 }]}
              left={<TextInput.Icon icon="email" color={theme.colors.placeholder} />}
              theme={{ colors: { primary: theme.colors.primary } }}
              outlineColor="rgba(255, 255, 255, 0.1)"
              selectionColor={theme.colors.primary}
              textColor={theme.colors.text}
              error={!!emailError}
            />
            {emailError ? <HelperText type="error" visible={!!emailError}>{emailError}</HelperText> : null}

            <TextInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              mode="outlined"
              autoCapitalize="none"
              style={[styles.input, { marginTop: emailError ? 8 : 16 }]}
              left={<TextInput.Icon icon="account-circle" color={theme.colors.placeholder} />}
              theme={{ colors: { primary: theme.colors.primary } }}
              outlineColor="rgba(255, 255, 255, 0.1)"
              selectionColor={theme.colors.primary}
              textColor={theme.colors.text}
              error={!!usernameError}
            />
            {usernameError ? <HelperText type="error" visible={!!usernameError}>{usernameError}</HelperText> : null}

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!isPasswordVisible}
              style={[styles.input, { marginTop: usernameError ? 8 : 16 }]}
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
              error={!!passwordError}
            />
            {passwordError ? <HelperText type="error" visible={!!passwordError}>{passwordError}</HelperText> : null}

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry={!isConfirmPasswordVisible}
              style={[styles.input, { marginTop: passwordError ? 8 : 16 }]}
              left={<TextInput.Icon icon="lock-check" color={theme.colors.placeholder} />}
              right={
                <TextInput.Icon
                  icon={isConfirmPasswordVisible ? "eye-off" : "eye"}
                  color={theme.colors.placeholder}
                  onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                />
              }
              theme={{ colors: { primary: theme.colors.primary } }}
              outlineColor="rgba(255, 255, 255, 0.1)"
              selectionColor={theme.colors.primary}
              textColor={theme.colors.text}
              error={!!confirmPasswordError}
            />
            {confirmPasswordError ? <HelperText type="error" visible={!!confirmPasswordError}>{confirmPasswordError}</HelperText> : null}

            <Button
              mode="contained"
              onPress={handleRegister}
              style={[styles.registerButton, { marginTop: confirmPasswordError ? 16 : 24 }]}
              labelStyle={styles.registerButtonText}
              loading={isRegistering}
              disabled={isRegistering}
            >
              {isRegistering ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </View>

          {/* Terms & Privacy */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By signing up, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>

          {/* Login Option */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.loginLinkText}>Sign in</Text>
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
        {error || 'An error occurred during registration'}
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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    height: 56,
  },
  registerButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsContainer: {
    marginTop: 16,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  termsText: {
    color: theme.colors.placeholder,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
  },
  termsLink: {
    color: theme.colors.primary,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  loginText: {
    color: theme.colors.placeholder,
  },
  loginLinkText: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  errorSnackbar: {
    backgroundColor: theme.colors.error,
  },
});

export default RegisterScreen;
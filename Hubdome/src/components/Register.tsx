import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInput, Button, Divider, Checkbox } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { registerUser, socialLogin } from '../redux/actions/authActions';
import { clearError } from '../redux/reducers/userReducer';
import { NavigationProp } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';

// Ensure redirecting is properly initialized for OAuth
WebBrowser.maybeCompleteAuthSession();

// Component props interface
interface RegisterProps {
  navigation: NavigationProp<any>;
}

const Register: React.FC<RegisterProps> = ({ navigation }) => {
  // State for form fields
  const [username, setUsername] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState<boolean>(true);
  
  // State for validation errors
  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  const [termsError, setTermsError] = useState<string>('');

  // Get redux state and dispatch
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.user);

  // Google Auth
  const [googleRequest, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
    // expoClientId: 'YOUR_EXPO_CLIENT_ID', // Replace with your Google Client ID
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
  });

  // Facebook Auth
  const [fbRequest, fbResponse, promptFacebookAsync] = Facebook.useAuthRequest({
    clientId: 'YOUR_FACEBOOK_APP_ID', // Replace with your Facebook App ID
  });

  // Check if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate('App');
    }
  }, [isAuthenticated, navigation]);

  // Handle Google auth response
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse;
      if (authentication?.accessToken) {
        handleGoogleSignup(authentication.accessToken);
      }
    }
  }, [googleResponse]);

  // Handle Facebook auth response
  useEffect(() => {
    if (fbResponse?.type === 'success') {
      const { authentication } = fbResponse;
      if (authentication?.accessToken) {
        handleFacebookSignup(authentication.accessToken);
      }
    }
  }, [fbResponse]);

  // Clear any errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Display error alert when error changes
  useEffect(() => {
    if (error) {
      Alert.alert('Registration Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Validate name
  const validateName = (): boolean => {
    if (!name) {
      setNameError('Name is required');
      return false;
    }
    setNameError('');
    return true;
  };

  // Validate username (new)
  const validateUsername = (): boolean => {
    if (!username) {
      setUsernameError('Username is required');
      return false;
    }
    setUsernameError('');
    return true;
  };

  // Validate email
  const validateEmail = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Validate password
  const validatePassword = (): boolean => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Validate confirm password
  const validateConfirmPassword = (): boolean => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  // Validate terms acceptance
  const validateTerms = (): boolean => {
    if (!acceptTerms) {
      setTermsError('You must accept the terms and conditions');
      return false;
    }
    setTermsError('');
    return true;
  };

  // Handle registration
  const handleRegister = async () => {
    // Validate all form fields
    const isNameValid = validateName();
    const isUsernameValid = validateUsername();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    const isTermsValid = validateTerms();

    if (isNameValid && isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isTermsValid) {
      dispatch(registerUser({ name, username, email, password }));
    }
  };

  // Handle Google signup
  const handleGoogleSignup = async (token: string) => {
    dispatch(socialLogin({
      provider: 'google',
      token,
      isRegistration: true
    }));
  };

  // Handle Facebook signup
  const handleFacebookSignup = async (token: string) => {
    dispatch(socialLogin({
      provider: 'facebook',
      token,
      isRegistration: true
    }));
  };

  // Toggle password visibility
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  // Toggle confirm password visibility
  const toggleSecureConfirmEntry = () => {
    setSecureConfirmTextEntry(!secureConfirmTextEntry);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSubtitle}>Join the HobbyHub community</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <TextInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              onBlur={validateName}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="account" color="#BBBBBB" />}
              error={!!nameError}
              textColor="#FFFFFF"
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          </View>
          
          {/* Username Input */}
          <View style={styles.inputContainer}>
            <TextInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              onBlur={validateUsername}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="account-circle" color="#BBBBBB" />}
              error={!!usernameError}
              textColor="#FFFFFF"
            />
            {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              onBlur={validateEmail}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="email" color="#BBBBBB" />}
              error={!!emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              textColor="#FFFFFF"
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              onBlur={validatePassword}
              style={styles.input}
              mode="outlined"
              secureTextEntry={secureTextEntry}
              left={<TextInput.Icon icon="lock" color="#BBBBBB" />}
              right={
                <TextInput.Icon
                  icon={secureTextEntry ? 'eye' : 'eye-off'}
                  color="#BBBBBB"
                  onPress={toggleSecureEntry}
                />
              }
              error={!!passwordError}
              textColor="#FFFFFF"
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onBlur={validateConfirmPassword}
              style={styles.input}
              mode="outlined"
              secureTextEntry={secureConfirmTextEntry}
              left={<TextInput.Icon icon="lock-check" color="#BBBBBB" />}
              right={
                <TextInput.Icon
                  icon={secureConfirmTextEntry ? 'eye' : 'eye-off'}
                  color="#BBBBBB"
                  onPress={toggleSecureConfirmEntry}
                />
              }
              error={!!confirmPasswordError}
              textColor="#FFFFFF"
            />
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
          </View>

          {/* Terms and Conditions */}
          <View style={styles.termsContainer}>
            <Checkbox
              status={acceptTerms ? 'checked' : 'unchecked'}
              onPress={() => setAcceptTerms(!acceptTerms)}
              color="#3498DB"
            />
            <View style={styles.termsTextContainer}>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text
                  style={styles.termsLink}
                  onPress={() => {
                    // Navigate to Terms & Conditions
                    Alert.alert('Terms & Conditions', 'Terms and conditions will be displayed here.');
                  }}
                >
                  Terms & Conditions
                </Text>{' '}
                and{' '}
                <Text
                  style={styles.termsLink}
                  onPress={() => {
                    // Navigate to Privacy Policy
                    Alert.alert('Privacy Policy', 'Privacy policy will be displayed here.');
                  }}
                >
                  Privacy Policy
                </Text>
              </Text>
            </View>
          </View>
          {termsError ? <Text style={[styles.errorText, { marginLeft: 8 }]}>{termsError}</Text> : null}

          {/* Register Button */}
          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.registerButton}
            contentStyle={styles.buttonContent}
            loading={loading}
            disabled={loading}
          >
            Create Account
          </Button>

          {/* Social Login Divider */}
          <View style={styles.dividerContainer}>
            <Divider style={styles.divider} />
            <Text style={styles.dividerText}>OR SIGN UP WITH</Text>
            <Divider style={styles.divider} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton]}
              onPress={() => promptGoogleAsync()}
              disabled={loading}
            >
              <MaterialIcons name="login" size={18} color="#FFFFFF" />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, styles.facebookButton]}
              onPress={() => promptFacebookAsync()}
              disabled={loading}
            >
              <MaterialIcons name="login" size={18} color="#FFFFFF" />
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLinkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2A',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#BBBBBB',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'rgba(42, 42, 54, 0.8)',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  termsTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  termsText: {
    color: '#BBBBBB',
    fontSize: 14,
  },
  termsLink: {
    color: '#3498DB',
    textDecorationLine: 'underline',
  },
  registerButton: {
    backgroundColor: '#3498DB',
    borderRadius: 8,
    marginTop: 10,
  },
  buttonContent: {
    height: 50,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    color: '#BBBBBB',
    marginHorizontal: 10,
    fontSize: 12,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    flex: 1,
    marginHorizontal: 5,
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  loginText: {
    color: '#BBBBBB',
    fontSize: 14,
    marginRight: 5,
  },
  loginLinkText: {
    color: '#3498DB',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Register;
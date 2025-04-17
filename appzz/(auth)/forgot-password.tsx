import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useState } from 'react';
import { router } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    // Implement password reset logic here
    setTimeout(() => {
      setLoading(false);
      router.back();
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.description}>
        Enter your email address and we'll send you instructions to reset your password.
      </Text>
      
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <Button
        mode="contained"
        onPress={handleResetPassword}
        loading={loading}
        style={styles.button}
      >
        Send Reset Instructions
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1E1E2A',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  button: {
    padding: 8,
    backgroundColor: '#3498DB',
  },
});
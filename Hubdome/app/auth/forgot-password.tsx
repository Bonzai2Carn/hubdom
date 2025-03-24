import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../../src/utils/theme';

export default function ForgotPassword() {
  const [email, setEmail] = React.useState('');
  const router = useRouter();
  
  const handleSubmit = () => {
    // Add password reset logic here
    alert('Password reset email sent!');
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reset Password</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.description}>
          Enter your email address and we'll send you instructions to reset your password.
        </Text>
        
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
        
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          labelStyle={styles.buttonText}
          disabled={!email.trim()}
        >
          Send Reset Link
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  content: {
    padding: 16,
    flex: 1,
  },
  description: {
    color: theme.colors.placeholder,
    marginBottom: 24,
    fontSize: 16,
    lineHeight: 24,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    height: 56,
    marginBottom: 24,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
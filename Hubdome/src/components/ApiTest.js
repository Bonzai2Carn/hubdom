import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const ApiTest = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const testApi = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1");
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container} data-testid="api-test-container">
      <Text data-testid="welcome-message">Welcome to HobbyHub</Text>
      <Button
        testID="test-api-button"
        title="Test API Connection"
        onPress={testApi}
      />
      {error && (
        <Text style={styles.error} data-testid="api-error">
          Error: {error}
        </Text>
      )}
      {data && (
        <Text style={styles.success} data-testid="api-response">
          Response: {JSON.stringify(data, null, 2)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  success: {
    color: "green",
    marginTop: 10,
  },
});

export default ApiTest;

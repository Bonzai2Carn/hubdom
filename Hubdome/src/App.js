import React from "react";
import "expo-dev-client";
import { SafeAreaView, StyleSheet, StatusBar, View, Text } from "react-native";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";
import store from "./redux/store";

// Import screens (temporary direct imports for testing)
import LoginScreen from "./screens/auth/LoginScreen";
import RegisterScreen from "./screens/auth/RegisterScreen";
import CreateHobbyScreen from "./screens/hobbies/CreateHobbyScreen";
import HobbyListScreen from "./screens/hobbies/HobbyListScreen";

// Custom theme based on our brand identity
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#3498DB", // Vibrant Blue
    accent: "#FF7F50", // Energetic Coral
    background: "#FFFFFF",
    surface: "#ECF0F1", // Soft Gray
    text: "#2C3E50", // Dark Navy
    error: "#E74C3C",
    secondary: "#2ECC71", // Fresh Mint
    tertiary: "#F1C40F", // Warm Yellow
    quaternary: "#9B59B6", // Deep Purple
  },
  fonts: {
    ...DefaultTheme.fonts,
    // You can customize fonts here if needed
  },
};

const App = () => {
  // For development/testing, directly render one screen
  // Later this will be replaced with proper navigation
  const [currentScreen, setCurrentScreen] = React.useState("login");

  const renderScreen = () => {
    switch (currentScreen) {
      case "login":
        return <LoginScreen navigation={{ navigate: setCurrentScreen }} />;
      case "Register":
        return <RegisterScreen navigation={{ navigate: setCurrentScreen }} />;
      case "CreateHobby":
        return (
          <CreateHobbyScreen navigation={{ navigate: setCurrentScreen }} />
        );
      case "HobbyList":
        return <HobbyListScreen navigation={{ navigate: setCurrentScreen }} />;
      default:
        return (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Welcome to HobbyHub</Text>
            <Text style={styles.welcomeSubtitle}>
              Connect Through What You Love
            </Text>
          </View>
        );
    }
  };

  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="dark-content" backgroundColor="#ECF0F1" />
        <SafeAreaView style={styles.container}>{renderScreen()}</SafeAreaView>
      </PaperProvider>
    </StoreProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECF0F1",
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3498DB",
    marginBottom: 10,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: "#2C3E50",
    textAlign: "center",
  },
});

export default App;

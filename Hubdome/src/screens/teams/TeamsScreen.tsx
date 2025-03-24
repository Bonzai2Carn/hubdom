import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ComingSoon = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Coming Soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E2A",
  },
  text: {
    fontSize: 24,
    color: "#FFFFFF",
  },
});

export default ComingSoon;
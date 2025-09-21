// src/screens/HomeScreen.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const HomeScreen = ({ navigation }) => {
  const features = [
    { name: "Crop Advisory", icon: "🌾", screen: "CropAdvisory" },
    { name: "Weather", icon: "🌤️", screen: "Weather" },
    { name: "Market Prices", icon: "💰", screen: "Market" },
    { name: "Pest Detection", icon: "🐛", screen: "PestDetection" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, Farmer!</Text>
      <View style={styles.grid}>
        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={styles.featureButton}
            onPress={() => navigation.navigate(feature.screen)}
          >
            <Text style={styles.icon}>{feature.icon}</Text>
            <Text style={styles.featureText}>{feature.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureButton: {
    width: "45%",
    height: 120,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  icon: { fontSize: 40, marginBottom: 10 },
  featureText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default HomeScreen;

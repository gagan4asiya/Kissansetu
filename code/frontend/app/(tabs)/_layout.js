// app/(tabs)/_layout.js
import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "#999",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#E0E0E0",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="advisory"
        options={{
          title: "Advisory",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🌾</Text>,
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: "Weather",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🌤️</Text>,
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          title: "Market",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>💰</Text>,
        }}
      />
      <Tabs.Screen
        name="pest"
        options={{
          title: "Pest Detection",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🐛</Text>,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🤝</Text>,
        }}
      />
    </Tabs>
  );
}

// app/(tabs)/_layout.js
import { Tabs } from "expo-router";

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
          tabBarIcon: () => "🏠",
        }}
      />
      <Tabs.Screen
        name="advisory"
        options={{
          title: "Advisory",
          tabBarIcon: () => "🌾",
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: "Weather",
          tabBarIcon: () => "🌤️",
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          title: "Market",
          tabBarIcon: () => "💰",
        }}
      />
      <Tabs.Screen
        name="pest"
        options={{
          title: "Pest Detection",
          tabBarIcon: () => "🐛",
        }}
      />
      // app/(tabs)/_layout.js
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: () => "🤝",
        }}
      />
    </Tabs>
  );
}

// app/index.tsx - Main entry point
import { Redirect } from "expo-router";

export default function Index() {
  // Redirect to tabs on app start
  return <Redirect href="/(tabs)" />;
}

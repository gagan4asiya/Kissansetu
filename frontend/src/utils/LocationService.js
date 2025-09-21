// src/utils/LocationService.js
import * as Location from "expo-location";
import { Alert } from "react-native";

export class LocationService {
  static async requestLocationPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Location Permission Required",
          "Savior needs location access to provide weather updates and crop recommendations for your area.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Grant Permission",
              onPress: () => this.requestLocationPermission(),
            },
          ]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Location permission error:", error);
      return false;
    }
  }

  static async getCurrentLocation() {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) return null;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: await this.reverseGeocode(
          location.coords.latitude,
          location.coords.longitude
        ),
      };
    } catch (error) {
      console.error("Get location error:", error);
      return null;
    }
  }

  static async reverseGeocode(latitude, longitude) {
    try {
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (address.length > 0) {
        const addr = address[0];
        return `${addr.city || addr.district || addr.subregion}, ${
          addr.region
        }`;
      }
      return "Unknown Location";
    } catch (error) {
      console.error("Reverse geocode error:", error);
      return "Unknown Location";
    }
  }
}

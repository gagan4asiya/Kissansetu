// src/components/haptic-tab.js
import * as Haptics from "expo-haptics";
import { Platform, Pressable } from "react-native";

export function HapticTab(props) {
  return (
    <Pressable
      {...props}
      onPressIn={(ev) => {
        if (Platform.OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}

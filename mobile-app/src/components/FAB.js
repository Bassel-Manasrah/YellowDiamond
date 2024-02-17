import React from "react";
import { FloatingAction } from "react-native-floating-action";

export default function FAB({ icon, color, onPress }) {
  return (
    <FloatingAction
      color={color}
      floatingIcon={icon}
      onPressMain={onPress}
      buttonSize={72}
      distanceToEdge={{ vertical: 24, horizontal: 24 }}
      overlayColor="rgba(0, 0, 0, 0)"
    />
  );
}

import { View, Text } from "react-native";
import React, { useEffect } from "react";
import messageStorageService from "../services/MessageStorageService";

export default function AnotherTestScreen() {
  useEffect(() => {
    (async () => {
      lastMessages = await messageStorageService.getLastMessages();
      console.log(lastMessages);
    })();
  }, []);

  return (
    <View>
      <Text>AnotherTestScreen</Text>
    </View>
  );
}

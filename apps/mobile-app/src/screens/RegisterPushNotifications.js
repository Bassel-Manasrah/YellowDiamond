import { View, Text } from "react-native";
import SplashScreen from "./SplashScreen";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { useEffect } from "react";
import axios from "axios";
import { store } from "../utils/store";

export default function RegisterPushNotifications({ route, navigation }) {
  useEffect(() => {
    const { phoneNumber, otp } = route.params;

    registerForPushNotificationsAsync().then((pushToken) => {
      const url = `http://${process.env.EXPO_PUBLIC_AUTH_HOSTNAME}/register`;
      const payload = {
        phoneNumber,
        otp,
        pushToken,
      };
      console.log("i am here!");
      axios
        .post(url, payload)
        .then(async (response) => {
          const { token } = response.data;
          console.log(token);
          await store.set("token", token);
          await store.set("myPhoneNumber", phoneNumber);
        })
        .catch((error) => {
          console.error(error);
          navigation.navigate("authInit");
        });
    });
  }, []);

  return <SplashScreen />;
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: "4ef0672b-6e12-4c80-b57f-88b38fd66a90",
    });
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token.data;
}

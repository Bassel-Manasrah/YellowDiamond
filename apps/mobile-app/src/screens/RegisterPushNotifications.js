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
  return <Text>Hello</Text>;

  useEffect(() => {
    const { phoneNumber, otp } = route.params;

    (async () => {
      const pushToken = await registerForPushNotificationsAsync();

      console.log(`push token: ${pushToken}`);

      const payload = {
        phoneNumber,
        otp,
        pushToken,
      };
      const url = `http://${process.env.EXPO_PUBLIC_AUTH_HOSTNAME}/register`;

      const response = await axios.post(url, payload);
      const { token } = response.data;

      console.log(`auth token: ${token}`);

      await store.set("myPhoneNumber", phoneNumber);
      await store.set("token", token);
    })();

    // registerForPushNotificationsAsync().then((pushToken) => {
    //   console.log(`pushToken: ${pushToken}`);
    //   const url = `http://${process.env.EXPO_PUBLIC_AUTH_HOSTNAME}/register`;
    //   const payload = {
    //     phoneNumber,
    //     otp,
    //     pushToken,
    //   };
    //   axios
    //     .post(url, payload)
    //     .then(async (response) => {
    //       const { token } = response.data;
    //       console.log(`phoneNumber: ${phoneNumber}`);
    //       await store.set("myPhoneNumber", phoneNumber);
    //       await store.set("token", token);
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //       navigation.navigate("authInit");
    //     });
    // });
  }, []);

  return <Text>Hello World!</Text>;
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
      projectId: "47cbc978-4641-4f60-8ae8-b9f7f23efc05",
    });
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token.data;
}

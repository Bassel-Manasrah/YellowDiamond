import React, { useEffect } from "react";
import SplashScreen from "./SplashScreen";
import contactService from "../services/ContactService";
import notificationService from "../services/NotificationService";
import axios from "axios";
import { store } from "../utils/store";

export default function SetupScreen({ route, navigation }) {
  useEffect(() => {
    (async () => {
      await contactService.requestPermissionAsync();
      pushToken = await notificationService.registerForPushNotificationsAsync();
      const { phoneNumber, otp } = route.params;

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
  }, []);

  return <SplashScreen />;
}

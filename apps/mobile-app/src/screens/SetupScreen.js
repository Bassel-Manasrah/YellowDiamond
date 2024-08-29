import React, { useEffect } from "react";
import SplashScreen from "./SplashScreen";
import contactService from "../services/ContactService";
import notificationService from "../services/NotificationService";
import axios from "axios";
import { store } from "../utils/store";
import Toast from "react-native-root-toast";

export default function SetupScreen({ route, navigation }) {
  useEffect(() => {
    (async () => {
      pushToken = await notificationService.registerForPushNotificationsAsync();
      const { phoneNumber, otp } = route.params;

      await contactService.requestPermissionAsync();

      const payload = {
        phoneNumber,
        otp,
        pushToken,
      };

      try {
        const url = `http://${process.env.EXPO_PUBLIC_AUTH_HOSTNAME}/register`;

        const response = await axios.post(url, payload);
        const { token } = response.data;

        console.log(`auth token: ${token}`);

        await store.set("myPhoneNumber", phoneNumber);
        await store.set("token", token);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Handle 401 Unauthorized error
          console.log("Unauthorized: Invalid credentials or session expired.");
          navigation.navigate("authInit");
          let toast = Toast.show("You have entered wrong verification code!", {
            duration: Toast.durations.LONG,
            position: Toast.positions.CENTER,
            backgroundColor: "red",
          });

          // You can add further handling here, like redirecting the user to a login page
        } else {
          // Handle other errors
          console.error("An error occurred:", error.message);
        }
      }
    })();
  }, []);

  return <SplashScreen />;
}

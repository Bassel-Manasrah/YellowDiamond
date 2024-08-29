import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthInit from "./src/screens/AuthInit";
import AuthVerify from "./src/screens/AuthVerify";
import Home from "./src/screens/Home";
import Contacts from "./src/screens/Contacts";
import Chat from "./src/screens/Chat";
import { store } from "./src/utils/store";
import { useEffect, useRef, useState } from "react";
import SplashScreen from "./src/screens/SplashScreen";
import RegisterPushNotifications from "./src/screens/RegisterPushNotifications";
import TestScreen from "./src/screens/TestScreen";
import AuthenticatedApp from "./AuthenticatedApp";
import DatabaseLog from "./src/screens/DatabaseLog";
import { Text, TouchableNativeFeedback, View } from "react-native";
import SetupScreen from "./src/screens/SetupScreen";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { RootSiblingParent } from "react-native-root-siblings";
import notificationService from "./src/services/NotificationService";
import messageStorageService from "./src/services/MessageStorageService";

// const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

// console.log(`------------------------ TASK DEFINED`);
// TaskManager.defineTask(
//   BACKGROUND_NOTIFICATION_TASK,
//   async ({ data, error, executionInfo }) => {
//     console.log(`------------------------ BACKGROUND_NOTIFICATION_TASK`);
//     if (error) {
//       console.error(error);
//     }
//     if (data) {
//       message = JSON.parse(data.notification.data.body);
//       console.log("background data", message);
//       await messageStorageService.openAsync();
//       await messageStorageService.addMessageAsync(message);
//       notificationService.showNotification("you have new message");
//     }
//   }
// );
// Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

const { Navigator, Screen } = createNativeStackNavigator();

export default function App() {
  const responseListener = useRef();

  const [token, setToken] = useState(null);
  const fetchToken = async () => {
    const fetched = await store.get("token");
    setToken(fetched);
  };

  // Custom function to be executed when the user clicks the notification
  const handleNotificationClick = async (response) => {
    // Access data from the notification
    const notificationData = response.notification.request.content.data;

    // Your custom logic here
    console.log("Executing custom function with data:", notificationData);

    if (notificationData) {
      await messageStorageService.openAsync();
      await messageStorageService.addMessageAsync(notificationData);
    }
  };

  useEffect(() => {
    // This listener is fired whenever the user taps on or interacts with a notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("User clicked on the notification:", response);
        // Here, you can execute your custom function
        handleNotificationClick(response);
      });

    return () => {
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  useEffect(() => {
    fetchToken();
    const interval = setInterval(() => {
      fetchToken();
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const commonScreenOptions = {
    headerShown: true,
    headerStyle: {
      backgroundColor: "royalblue",
    },
    headerTintColor: "white",
  };
  return token ? (
    <RootSiblingParent>
      <AuthenticatedApp />
    </RootSiblingParent>
  ) : (
    <RootSiblingParent>
      <NavigationContainer>
        <Navigator screenOptions={{ headerShown: false, animation: "none" }}>
          <Screen name="authInit" component={AuthInit} />
          <Screen name="authVerify" component={AuthVerify} />
          <Screen name="setup" component={SetupScreen} />
        </Navigator>
      </NavigationContainer>
    </RootSiblingParent>
  );
}

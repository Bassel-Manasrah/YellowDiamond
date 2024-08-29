import useAppStateHandler from "./src/hooks/useAppStateHandler";
import SplashScreen from "./src/screens/SplashScreen";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/screens/Home";
import Contacts from "./src/screens/Contacts";
import Chat from "./src/screens/Chat";
import { useEffect, useState } from "react";
import TestScreen from "./src/screens/TestScreen";
import AnotherTestScreen from "./src/screens/AnotherTestScreen";
import { Text, TouchableNativeFeedback } from "react-native";
import RegisterPushNotifications from "./src/screens/RegisterPushNotifications";
import Ionicons from "@expo/vector-icons/Ionicons";

import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import DatabaseLog from "./src/screens/DatabaseLog";
import useRealTimeMessaging from "./src/hooks/useRealTimeMessaging";
import messageStorageService from "./src/services/MessageStorageService";
import notificationService from "./src/services/NotificationService";
import SearchScreen from "./src/screens/SearchScreen";
import PickContactsScreen from "./src/screens/PickContactsScreen";
import { store } from "./src/utils/store";

// This handler will process notifications in the background
// Notifications.setNotificationHandler({
//   handleNotification: async (notification) => {
//     console.log("--------------------- handleNotification");
//   const { data } = notification.request.content;

//   // Handle data-only notifications here
//   if (AppState.currentState === "background" && data) {
//     message = JSON.parse(data.notification.data.body);
//     console.log("background data", message);
//     await messageStorageService.openAsync();
//     await messageStorageService.addMessageAsync(message);
//     notificationService.showNotification("you have new message");
//   }

//   return {
//     shouldShowAlert: false,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   };
//   },
// });

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

export default function AuthenticatedApp() {
  const [phoneNumber, setPhoneNumber] = useState(null);
  const { loading } = useRealTimeMessaging(phoneNumber);
  // const { loading } = useRealTimeMessaging("+972585100114");

  const fetchPhoneNumber = async () => {
    const phoneNumber = await store.get("myPhoneNumber");
    setPhoneNumber(phoneNumber);
  };

  useEffect(() => {
    fetchPhoneNumber();
  }, []);

  const commonScreenOptions = {
    headerShown: true,
    headerStyle: {
      backgroundColor: "royalblue",
    },
    headerTintColor: "white",
  };

  const splashScreen = <Screen name="splash" component={SplashScreen} />;
  const mainScreens = (
    <>
      <Screen
        name="home"
        component={Home}
        options={{
          title: "Chats",
          ...commonScreenOptions,
          headerRight: () => {
            const navigation = useNavigation();
            return (
              <TouchableNativeFeedback
                onPress={() => navigation.navigate("pick")}
              >
                <Ionicons
                  name={"square"}
                  size={24}
                  color={"#fcdb03"}
                  style={{ transform: [{ rotate: "45deg" }] }}
                />
              </TouchableNativeFeedback>
            );
          },
        }}
      />
      <Screen
        name="contacts"
        component={Contacts}
        options={{
          title: "Contacts",
          ...commonScreenOptions,
        }}
      />
      <Screen name="chat" component={Chat} />
      <Screen name="pick" component={TestScreen} />
      <Screen name="search" component={SearchScreen} />
      <Screen name="pickContacts" component={PickContactsScreen} />
    </>
  );
  return (
    <NavigationContainer>
      <Navigator screenOptions={{ headerShown: false, animation: "none" }}>
        {!phoneNumber || loading ? splashScreen : mainScreens}
      </Navigator>
    </NavigationContainer>
  );
}

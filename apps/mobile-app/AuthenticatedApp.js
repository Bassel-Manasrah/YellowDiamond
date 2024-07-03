import useAppStateHandler from "./src/hooks/useAppStateHandler";
import SplashScreen from "./src/screens/SplashScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/screens/Home";
import Contacts from "./src/screens/Contacts";
import Chat from "./src/screens/Chat";
import { useEffect } from "react";
import { store } from "./src/utils/store";
import TestScreen from "./src/screens/TestScreen";
import AnotherTestScreen from "./src/screens/AnotherTestScreen";
import { Text } from "react-native";
import RegisterPushNotifications from "./src/screens/RegisterPushNotifications";

import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import DatabaseLog from "./src/screens/DatabaseLog";
import useRealTimeMessaging from "./src/hooks/useRealTimeMessaging";
import messageStorageService from "./src/services/MessageStorageService";
import notificationService from "./src/services/NotificationService";
import SearchScreen from "./src/screens/SearchScreen";
import PickContactsScreen from "./src/screens/PickContactsScreen";

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  async ({ data, error, executionInfo }) => {
    if (error) {
      console.error(error);
    }
    if (data) {
      message = JSON.parse(data.notification.data.body);
      console.log("background data", message);

      await messageStorageService.openAsync();
      await messageStorageService.addMessageAsync(message);
      notificationService.showNotification("you have new message");
    }
  }
);

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

const { Navigator, Screen } = createNativeStackNavigator();

export default function AuthenticatedApp() {
  const { loading } = useRealTimeMessaging("+972585100114");

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
      {/* <Screen
        name="databaseLog"
        component={DatabaseLog}
        options={{
          title: "Chats",
          ...commonScreenOptions,
        }}
      /> */}

      <Screen
        name="home"
        component={Home}
        options={{
          title: "Chats",
          ...commonScreenOptions,
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
        {loading ? splashScreen : mainScreens}
      </Navigator>
    </NavigationContainer>
  );
}

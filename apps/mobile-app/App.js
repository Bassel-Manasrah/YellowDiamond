import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthInit from "./src/screens/AuthInit";
import AuthVerify from "./src/screens/AuthVerify";
import Home from "./src/screens/Home";
import Contacts from "./src/screens/Contacts";
import Chat from "./src/screens/Chat";
import { store } from "./src/utils/store";
import { useEffect, useState } from "react";
import SplashScreen from "./src/screens/SplashScreen";
import RegisterPushNotifications from "./src/screens/RegisterPushNotifications";
import TestScreen from "./src/screens/TestScreen";
import AuthenticatedApp from "./AuthenticatedApp";
import DatabaseLog from "./src/screens/DatabaseLog";
import { Text, View } from "react-native";
import SetupScreen from "./src/screens/SetupScreen";
import SearchScreen from "./src/screens/SearchScreen";
import PickContactsScreen from "./src/screens/PickContactsScreen";
import SingScreen from "./src/screens/SingScreen";

const { Navigator, Screen } = createNativeStackNavigator();

export default function App() {
  // return (
  //   <NavigationContainer>
  //     <Navigator screenOptions={{ headerShown: false, animation: "none" }}>
  //       <Screen name="sing" component={SingScreen} />
  //     </Navigator>
  //   </NavigationContainer>
  // );
  const [token, setToken] = useState(null);
  const fetchToken = async () => {
    const fetched = await store.get("token");
    setToken(fetched);
  };
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
    <AuthenticatedApp />
  ) : (
    <NavigationContainer>
      <Navigator screenOptions={{ headerShown: false, animation: "none" }}>
        <Screen name="authInit" component={AuthInit} />
        <Screen name="authVerify" component={AuthVerify} />
        <Screen name="setup" component={SetupScreen} />
      </Navigator>
    </NavigationContainer>
  );
}

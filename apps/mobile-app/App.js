import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthInit from "./src/screens/AuthInit";
import AuthVerify from "./src/screens/AuthVerify";
import Home from "./src/screens/Home";
import Contacts from "./src/screens/Contacts";
import useAppStateHandler from "./src/hooks/useAppStateHandler";
import Chat from "./src/screens/Chat";
import { store } from "./src/utils/store";
import { useEffect, useState } from "react";
import SplashScreen from "./src/screens/SplashScreen";
import RegisterPushNotifications from "./src/screens/RegisterPushNotifications";

const { Navigator, Screen } = createNativeStackNavigator();

export default function App() {
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const [token, setToken] = useState(null);
  const { ready } = useAppStateHandler();

  const fetchToken = async () => {
    const fetched = await store.get("token");
    setToken(fetched);
    setIsLoadingToken(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchToken();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoadingToken) {
    return <SplashScreen />;
  }

  const commonScreenOptions = {
    headerShown: true,
    headerStyle: {
      backgroundColor: "royalblue",
    },
    headerTintColor: "white",
  };

  const authScreens = (
    <>
      <Screen name="authInit" component={AuthInit} />
      <Screen name="authVerify" component={AuthVerify} />
      <Screen
        name="registerPushNotification"
        component={RegisterPushNotifications}
      />
    </>
  );

  const mainScreens = ready ? (
    <>
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
    </>
  ) : (
    <Screen name="splash" component={SplashScreen} />
  );

  return (
    <NavigationContainer>
      <Navigator screenOptions={{ headerShown: false, animation: "none" }}>
        {token ? mainScreens : authScreens}
      </Navigator>
    </NavigationContainer>
  );
}

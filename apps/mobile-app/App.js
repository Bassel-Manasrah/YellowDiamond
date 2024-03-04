import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthInit from "./src/screens/AuthInit";
import AuthVerify from "./src/screens/AuthVerify";
import Home from "./src/screens/Home";
import Contacts from "./src/screens/Contacts";
import useAppStateHandler from "./src/hooks/useAppStateHandler";

const { Navigator, Screen } = createNativeStackNavigator();

export default function App() {
  const { ready } = useAppStateHandler();

  return (
    ready && (
      <NavigationContainer>
        <Navigator
          screenOptions={{ headerShown: false, animation: "slide_from_right" }}
        >
          <Screen name="authInit" component={AuthInit} />
          <Screen name="authVerify" component={AuthVerify} />
          <Screen name="home" component={Home} />
          <Screen
            name="contacts"
            component={Contacts}
            options={{
              headerShown: true,
            }}
          />
        </Navigator>
      </NavigationContainer>
    )
  );
}

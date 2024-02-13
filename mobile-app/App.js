import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthInit from "./src/screens/AuthInit";
import AuthVerify from "./src/screens/AuthVerify";
import { View } from "react-native";
import OTP from "./src/components/OTP";
import Home from "./src/screens/Home";

const { Navigator, Screen } = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Navigator
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      >
        <Screen name="authInit" component={AuthInit} />
        <Screen name="authVerify" component={AuthVerify} />
        <Screen name="home" component={Home} />
      </Navigator>
    </NavigationContainer>
  );
}

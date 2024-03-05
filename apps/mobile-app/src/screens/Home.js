import { Text, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import FAB from "../components/FAB";
import { StatusBar } from "expo-status-bar";

export default function Home({ navigation }) {
  const onFloatingButtonPress = () => {
    navigation.navigate("contacts");
  };

  const floatingButtonIcon = (
    <Ionicons name="person-add" size={32} color="white" />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="royalblue" style="light" />
      <Text>Home</Text>
      <FAB
        color="#075eec"
        icon={floatingButtonIcon}
        onPress={onFloatingButtonPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

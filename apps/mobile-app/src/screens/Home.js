import { Text, StyleSheet, FlatList, View } from "react-native";
import React, { useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import FAB from "../components/FAB";
import { StatusBar } from "expo-status-bar";
import useChatPreviews from "../hooks/useChatPreviews";
import ChatPreview from "../components/ChatPreview";
import SplashScreen from "./SplashScreen";
import contactService from "../services/ContactService";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home({ navigation }) {
  const { chatPreviews, loading } = useChatPreviews();
  const onFloatingButtonPress = () => {
    // navigation.navigate("pick");
    navigation.navigate("contacts");
  };
  const floatingButtonIcon = (
    <Ionicons name="person-add" size={32} color="white" />
  );
  if (loading) return <SplashScreen />;
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="royalblue" style="light" />
      <FlatList
        data={chatPreviews}
        renderItem={({ item }) => (
          <ChatPreview
            name={item.name}
            lastMessage={item.lastMessage}
            unreadCount={item.unreadCount}
            onPress={() => {
              navigation.navigate("chat", {
                phoneNumber: item.phoneNumber,
                name: item.name,
              });
            }}
          />
        )}
      />
      <FAB
        color="#075eec"
        icon={floatingButtonIcon}
        onPress={onFloatingButtonPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

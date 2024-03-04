import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";

export default function ChatHeader({ name, imgUri, onBackPress }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backContainer} onPress={onBackPress}>
        <Ionicons name="arrow-back" size={24} color="white" />
        <Image
          height={64}
          width={64}
          source={{
            uri: imgUri,
          }}
          style={styles.image}
        />
      </TouchableOpacity>
      <Text style={styles.text}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "royalblue",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 8,
  },
  backContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    color: "white",
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
});

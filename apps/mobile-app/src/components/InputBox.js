import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function InputBox({ value, onChange, onSend }) {
  const sendIconStyle = [styles.sendIcon];
  if (value != "") sendIconStyle.push(styles.active);
  else sendIconStyle.push(styles.inactive);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Message"
        value={value}
        onChangeText={onChange}
        style={styles.input}
      />
      <Ionicons
        name="send"
        color="white"
        size={24}
        onPress={value != "" ? onSend : null}
        style={sendIconStyle}
      ></Ionicons>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 8,
    gap: 8,
  },
  input: {
    backgroundColor: "white",
    flex: 1,
    padding: 4,
    paddingHorizontal: 16,
    borderColor: "lightgray",
    borderWidth: 1,
  },
  sendIcon: {
    padding: 12,
    borderRadius: 50,
  },
  active: {
    backgroundColor: "royalblue",
  },
  inactive: {
    backgroundColor: "lightgray",
  },
});

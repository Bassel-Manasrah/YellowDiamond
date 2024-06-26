import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function Message({ text, mine }) {
  // define the container style and text style
  const containerStyle = [styles.container];
  const textStyle = [];

  if (mine) {
    containerStyle.push(styles.myMessageContainer);
    textStyle.push(styles.myMessageText);
  } else {
    containerStyle.push(styles.notMyMessageContainer);
  }

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  myMessageText: {
    color: "black",
  },
  myMessageContainer: {
    backgroundColor: "#c9e0ff",
    alignSelf: "flex-end",
  },
  notMyMessageContainer: {
    backgroundColor: "white",
    alignSelf: "flex-start",
  },
});

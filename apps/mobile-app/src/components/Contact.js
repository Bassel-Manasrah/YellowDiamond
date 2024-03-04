import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
} from "react-native";
import React from "react";

export default function Contact({
  imgUri: propImgUri,
  name,
  registered = false,
  onPress,
}) {
  const defaultImgUri =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZiwJCHgq3aS6uqBsM9jXnZfzivlNkahN_zNz4ZOpETg&s";
  const imgUri = propImgUri || defaultImgUri;

  const statusStyle = [styles.status];
  if (registered) statusStyle.push(styles.positiveStatus);
  else statusStyle.push(styles.negativeStatus);

  const statusMessage = registered ? "on app" : "off app";

  return (
    <TouchableNativeFeedback disabled={!registered} onPress={onPress}>
      <View style={styles.container}>
        <Image source={{ uri: imgUri }} style={styles.img} />
        <Text style={styles.title} numberOfLines={1}>
          {name}
        </Text>
        <Text style={statusStyle}>{statusMessage}</Text>
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  img: {
    height: 48,
    width: 48,
    borderRadius: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  status: {
    marginLeft: "auto",
    fontWeight: "bold",
  },
  positiveStatus: {
    color: "green",
  },
  negativeStatus: {
    color: "red",
  },
});

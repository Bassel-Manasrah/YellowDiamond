import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Contact({
  imgUri: propImgUri,
  name,
  onPress,
  registered = false,
  showStatus = true,
  selectable = false,
  selected = false,
  showHappiness = false,
  happy = false,
}) {
  const defaultImgUri =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZiwJCHgq3aS6uqBsM9jXnZfzivlNkahN_zNz4ZOpETg&s";
  const imgUri = propImgUri || defaultImgUri;

  const statusStyle = [styles.status];
  if (registered) statusStyle.push(styles.positiveStatus);
  else statusStyle.push(styles.negativeStatus);

  const statusMessage = registered ? "on app" : "off app";

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{ uri: imgUri }} style={styles.img} />
      <Text style={styles.title} numberOfLines={1}>
        {name}
      </Text>
      {!selectable && <Text style={statusStyle}>{statusMessage}</Text>}
      {selectable && (
        <View
          style={[
            statusStyle,
            {
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              width: 48,
            },
          ]}
        >
          {showHappiness &&
            (happy ? (
              <Ionicons name="happy" color="#44ba5d" size={24} />
            ) : (
              <Ionicons name="sad" color="#F61067" size={24} />
            ))}

          <BouncyCheckbox
            isChecked={selected}
            size={24}
            fillColor="royalblue"
            unFillColor="#FFFFFF"
            onPress={onPress}
          />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingHorizontal: 16,
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

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
} from "react-native";
import NumberBadge from "./NumberBadge";

export default function ChatPreview({
  name,
  lastMessage,
  unreadCount,
  onPress,
}) {
  const uri =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZiwJCHgq3aS6uqBsM9jXnZfzivlNkahN_zNz4ZOpETg&s";

  const lastMessageStyle = [];
  if (lastMessage === "* recommendation *")
    lastMessageStyle.push(styles.lastMessageRecommendation);
  else if (unreadCount > 0)
    lastMessageStyle.push(styles.lastMessageHighlighted);
  else lastMessageStyle.push(styles.lastMessage);

  return (
    <TouchableNativeFeedback onPress={onPress}>
      <View style={styles.container}>
        <Image source={{ uri }} style={styles.img} />
        <View style={styles.subContainer}>
          <Text>{name}</Text>
          <Text style={lastMessageStyle} numberOfLines={1}>
            {lastMessage}
          </Text>
        </View>
        <View style={styles.NumberBadgeContainer}>
          {unreadCount > 0 && <NumberBadge number={unreadCount} />}
        </View>
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  subContainer: {
    flexDirection: "column",
  },
  img: {
    height: 48,
    width: 48,
    borderRadius: 30,
  },
  lastMessage: {
    color: "gray",
  },
  lastMessageHighlighted: {
    color: "royalblue",
    fontWeight: "bold",
  },
  lastMessageRecommendation: {
    color: "#fcdb03",
    fontWeight: "bold",
  },
  NumberBadgeContainer: {
    marginLeft: "auto",
  },
});

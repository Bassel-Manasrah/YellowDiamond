import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

export default function Button({ children, disabled, loading, onPress }) {
  const containerStyle = [styles.container];
  if (disabled) containerStyle.push(styles.disabled);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={containerStyle}
    >
      {loading ? (
        <ActivityIndicator color="white" size="large" />
      ) : (
        <Text style={styles.text}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#075eec",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  disabled: {
    opacity: 0.4,
  },
});

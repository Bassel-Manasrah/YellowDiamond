import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Button from "../components/Button";
import { StatusBar } from "expo-status-bar";

const MOVIE = "movie";
const SONG = "song";

export default function TestScreen({ navigation }) {
  const [selected, setSelected] = useState(null);

  const navigate = () => {
    navigation.navigate("search", {
      toSearch: selected,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.header}>What do you want to recommend</Text>
      <TouchableWithoutFeedback
        onPress={() => {
          setSelected(MOVIE);
        }}
      >
        <View
          style={[
            styles.choiceContainer,
            selected === MOVIE && styles.selected,
          ]}
        >
          <MaterialCommunityIcons
            name="movie-open"
            size={48}
            color={selected === MOVIE ? "white" : "black"}
          />
          <Text style={[styles.header, selected === MOVIE && styles.selected]}>
            Movie
          </Text>
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        onPress={() => {
          setSelected(SONG);
        }}
      >
        <View
          style={[styles.choiceContainer, selected === SONG && styles.selected]}
        >
          <MaterialCommunityIcons
            name="music-note"
            size={48}
            color={selected === SONG ? "white" : "black"}
          />
          <Text style={[styles.header, selected === SONG && styles.selected]}>
            Song
          </Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={{ flex: 1 }}>
        <View style={{ marginTop: "auto" }}>
          <Button disabled={!selected} onPress={navigate}>
            Continue
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 32,
    paddingHorizontal: 16,
    gap: 8,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  choiceContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 32,
    borderWidth: 2,
    backgroundColor: "#dddd",
    alignItems: "center",
    justifyContent: "center",
  },
  choiceHeader: {
    fontSize: 24,
  },

  selected: {
    color: "white",
    backgroundColor: "#A143FF",
  },
  continueButton: {},
});

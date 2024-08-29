import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Button from "../components/Button";
import recommendationsFetchingService from "../services/RecommendationFetchingService";
import Suggestion from "../components/Suggestion";

export default function SearchScreen({ navigation, route }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState([]);

  const { toSearch } = route.params;

  const handleSubmit = async () => {
    fetched = await recommendationsFetchingService.searchAsync(
      query,
      20,
      toSearch,
      false
    );
    setResults(fetched);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.inputContainer}>
          <FontAwesome name="search" size={16} color="black" />
          <TextInput
            placeholder={`Search name of ${toSearch}`}
            style={styles.input}
            cursorColor={"royalblue"}
            onSubmitEditing={handleSubmit}
            value={query}
            onChangeText={setQuery}
          />
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate("home");
          }}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableWithoutFeedback>
      </View>

      <FlatList
        data={results}
        renderItem={({ item }) => (
          <View
            style={[
              { height: 80, marginTop: 16 },
              selected?.id === item.id && styles.selected,
            ]}
          >
            <Suggestion
              suggestion={item}
              onPress={() => {
                setSelected(item);
              }}
            />
          </View>
        )}
        style={styles.flatList}
      />
      <Button
        disabled={!selected}
        onPress={() => {
          navigation.navigate("pickContacts", {
            recommendation: selected,
          });
        }}
      >
        Continue
      </Button>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  input: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  inputContainer: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#ddd",
    flexDirection: "row",
    gap: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  cancelText: {
    color: "#F61067",
    fontWeight: "bold",
  },
  continueText: {
    color: "royalblue",
    fontWeight: "bold",
    fontSize: 24,
    marginLeft: "auto",
  },
  selected: {
    borderColor: "royalblue",
    borderStyle: "dashed",
    borderWidth: 3,
    height: 150,
    // backgroundColor: "#F4F0BB",
  },
});

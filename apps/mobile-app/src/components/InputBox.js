import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableNativeFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Suggestion from "./Suggestion";
import MovieService from "../services/MovieService";
import recommendationsFetchingService from "../services/RecommendationFetchingService";
import debounce from "lodash/debounce";
import axios from "axios";

export default function InputBox({ onSend, phoneNumber }) {
  const [value, setValue] = useState("");
  const [recommendActive, setRecommendActive] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const toggleRecommend = () => {
    setRecommendActive((recommendActive) => !recommendActive);
  };

  const handleSubmit = () => {
    if (value != "") {
      onSend(value);
      setSelectedSuggestion(null);
      setValue("");
    }
  };

  const selectSuggestion = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setValue(`RECOMMENDATION/${suggestion.id}`);
    setRecommendActive(false);
    setSuggestions([]);
  };

  const unselectSuggestion = () => {
    setSelectedSuggestion(null);
    setValue("");
  };

  const fetchSuggestions = async () => {
    console.log(`fetch: ${value}`);
    const recommendations = await recommendationsFetchingService.searchAsync(
      value
    );

    setSuggestions(recommendations);
  };

  useEffect(() => {
    if (recommendActive && value.length > 0) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [recommendActive]);

  useEffect(() => {
    if (value.length === 0) {
      setSuggestions([]);
    }
    // if (recommendActive && value.length > 0) {
    //   fetchSuggestions();
    // }
    if (recommendActive) {
      setRecommendActive(false);
    }
  }, [value]);

  useEffect(() => {
    (async () => {
      setRecommendActive(false);
      if (
        selectedSuggestion &&
        !selectedSuggestion.hasOwnProperty("prediction")
      ) {
        console.log(
          "selected suggestion -> predict",
          !selectSuggestion.prediction
        );

        // ----------------------------------------

        try {
          const url = `http://${process.env.EXPO_PUBLIC_PREDICT_HOSTNAME}/predict`;
          const data = {
            phoneNumbers: [phoneNumber],
            mediaId: selectedSuggestion.id,
            mediaType: selectedSuggestion.type,
          };
          const { data: predictions } = await axios.post(url, data);

          console.log("Predictions:", predictions);

          setSelectedSuggestion({
            ...selectedSuggestion,
            prediction: predictions[0].prediction,
          });
        } catch (e) {
          setSelectedSuggestion({
            ...selectedSuggestion,
            prediction: true,
          });
        }

        // ----------------------------------------
      }
    })();
  }, [selectedSuggestion]);

  const sendIconStyle = [styles.sendIcon];
  if (value != "") sendIconStyle.push(styles.active);
  else sendIconStyle.push(styles.inactive);

  return (
    <View style={styles.container}>
      <View style={styles.inputResultsContainer}>
        {suggestions?.length > 0 ? (
          <View
            style={[
              styles.resultsContainer,
              { height: suggestions.length * 100 },
            ]}
          >
            {suggestions.map((suggestion, index) => {
              return (
                <Suggestion
                  key={index}
                  suggestion={suggestion}
                  onPress={() => selectSuggestion(suggestion)}
                />
              );
            })}
          </View>
        ) : null}
        <View
          style={
            !selectedSuggestion
              ? styles.inputContainer
              : styles.suggestionContainer
          }
        >
          {!selectedSuggestion ? (
            <TextInput
              placeholder="Message"
              value={value}
              onChangeText={(newValue) => {
                // if (newValue.length < value.length) {
                //   setRecommendActive(false);
                // }
                setValue(newValue);
              }}
              style={styles.input}
            />
          ) : (
            <Suggestion
              suggestion={selectedSuggestion}
              showPrediction={true}
              happy={selectedSuggestion.prediction === true}
              sad={selectedSuggestion.prediction === false}
            />
          )}
          <TouchableNativeFeedback
            onPress={!selectedSuggestion ? toggleRecommend : unselectSuggestion}
          >
            <View style={styles.recommendIconContainer}>
              {!selectedSuggestion ? (
                <Ionicons
                  name={recommendActive ? "square" : "square-outline"}
                  size={24}
                  color={recommendActive ? "#fcdb03" : "black"}
                  style={styles.recommendIcon}
                />
              ) : (
                <Ionicons name="close" size={32} color="black" />
              )}
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
      <Ionicons
        name="send"
        color="white"
        size={24}
        onPress={handleSubmit}
        style={sendIconStyle}
      ></Ionicons>
    </View>
  );
}

const styles = StyleSheet.create({
  // resultsSpawner: {
  //   position: "relative",
  //   zIndex: 1000,
  // },

  inputResultsContainer: {
    flexDirection: "column",
    flex: 1,
  },
  resultsContainer: {
    width: "100%",
    height: 100,
    backgroundColor: "white",
    // position: "absolute",
  },
  container: {
    flexDirection: "row",
    gap: 4,
    padding: 16,
  },
  inputContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    height: 56,
  },
  suggestionContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    height: 100,
  },
  suggestion: {
    flex: 1,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    padding: 16,
  },
  recommendIcon: {
    transform: [{ rotate: "45deg" }],
  },
  recommendIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 56,
  },
  sendIcon: {
    padding: 12,
    borderRadius: 50,
    alignSelf: "flex-end",
  },
  active: {
    backgroundColor: "royalblue",
  },
  inactive: {
    backgroundColor: "lightgray",
  },
});

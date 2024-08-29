import {
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import MovieService from "../services/MovieService";
import Suggestion from "./Suggestion";
import recommendationsFetchingService from "../services/RecommendationFetchingService";

export default function Message({ text, mine }) {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);

  const openUrl = async (url) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    }
  };

  const fetchSuggestion = async () => {
    console.log("Message call fetchAsync");
    const fetched = await recommendationsFetchingService.fetchAsync(text);
    setSuggestion(fetched);
  };

  useEffect(() => {
    (async () => {
      const isSuggestion =
        recommendationsFetchingService.isRecommendation(text);
      if (isSuggestion) {
        await fetchSuggestion();
        setLoading(false);
      }
      setLoading(false);
    })();
  }, []);

  // define the container style and text style
  const containerStyle = [styles.container];
  const textStyle = [];
  if (mine) {
    containerStyle.push(styles.myMessageContainer);
    textStyle.push(styles.myMessageText);
  } else {
    containerStyle.push(styles.notMyMessageContainer);
  }

  let dynamicHeightStyle = {};
  if (suggestion?.type === "song") {
    dynamicHeightStyle = { height: 150 };
  }

  return (
    <View style={containerStyle}>
      {suggestion ? (
        <>
          <View style={[{ width: 300 }]}>
            <Suggestion
              suggestion={suggestion}
              showOverview={true}
              onPress={() => {
                openUrl(suggestion.actionUrl);
              }}
              showFeedback={!mine}
            />
          </View>
        </>
      ) : loading ? (
        <Text>loading ...</Text>
      ) : (
        <Text>{text}</Text>
      )}
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
  img: {
    width: 150,
    height: 200,
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

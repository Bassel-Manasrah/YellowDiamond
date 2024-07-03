import {
  Text,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
  View,
  Touchable,
} from "react-native";
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";

const FEEDBACK = {
  LIKE: "like",
  DISLIKE: "dislike",
  NEUTRAL: "no_feedback",
};

export default function Suggestion({
  suggestion,
  onPress,
  showOverview = false,
  showPrediction = false,
  happy = false,
  sad = false,
  showFeedback = false,
}) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState(FEEDBACK.NEUTRAL);

  const loadSound = async () => {
    const { sound: NewSound } = await Audio.Sound.createAsync(
      {
        uri: suggestion.previewUrl,
      },
      { shouldPlay: false }
    );
    setSound(NewSound);
    console.log(`${suggestion.name} loaded`);
  };

  useEffect(() => {
    if (suggestion.type === "song" && suggestion.previewUrl) loadSound();
  }, []);

  const onLongPress = async () => {
    console.log(suggestion);
    if (suggestion.type === "song" && sound) {
      sound.playAsync();
      setIsPlaying(true);
      console.log("long pressed a song!");
    }
  };

  const onPressOut = async () => {
    if (isPlaying) {
      try {
        await sound.stopAsync();
        setIsPlaying(false);
        console.log("stopped playing the song!");
      } catch (error) {
        console.error("Error stopping sound", error);
      }
    }
  };

  const getPredictionComponent = () => {
    if (happy) return <Ionicons name="happy" color="#44ba5d" size={24} />;
    if (sad) return <Ionicons name="sad" color="#F61067" size={24} />;
    return <Fontisto name="neutral" color="gray" size={24} />;
  };

  const getFeedbackComponent = () => {
    let likeComponent = (
      <TouchableOpacity
        style={styles.likeContainer}
        onPress={() => setFeedback(FEEDBACK.LIKE)}
      >
        <AntDesign name="like2" size={24} color="#44ba5d" />
      </TouchableOpacity>
    );

    let dislikeComponent = (
      <TouchableOpacity
        style={styles.dislikeContainer}
        onPress={() => setFeedback(FEEDBACK.DISLIKE)}
      >
        <AntDesign name="dislike2" size={24} color="#F61067" />
      </TouchableOpacity>
    );

    if (feedback === FEEDBACK.LIKE) {
      likeComponent = (
        <View style={[styles.likeContainer, { backgroundColor: "#44ba5d" }]}>
          <AntDesign name="like1" size={24} color="white" />
        </View>
      );
    }
    if (feedback === FEEDBACK.DISLIKE) {
      dislikeComponent = (
        <View style={[styles.dislikeContainer, { backgroundColor: "#F61067" }]}>
          <AntDesign name="dislike1" size={24} color="white" />
        </View>
      );
    }
    return (
      <View style={styles.feedbackContainer}>
        {likeComponent}
        {dislikeComponent}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.container2}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressOut={onPressOut}
      >
        <Image
          source={{
            uri: suggestion.imgUrl,
          }}
          style={
            showOverview && suggestion.overview
              ? [styles.img, { height: 100 }]
              : [styles.img]
          }
        />
        <Text style={styles.title} numberOfLines={1}>
          {suggestion.name}
        </Text>
        {showPrediction ? (
          getPredictionComponent()
        ) : (
          <Text style={styles.year}>{suggestion.year}</Text>
        )}
      </TouchableOpacity>

      {suggestion.overview && showOverview && (
        <Text>{suggestion.overview}</Text>
      )}
      {showFeedback && getFeedbackComponent()}
    </View>
  );
}

const styles = StyleSheet.create({
  feedbackContainer: {
    marginTop: 8,
    flexDirection: "row",
    gap: 8,
  },
  likeContainer: {
    borderWidth: 2,
    borderColor: "#44ba5d",
    opacity: 0.8,
    flex: 1,
    alignItems: "center",
    padding: 8,
  },
  dislikeContainer: {
    borderWidth: 2,
    borderColor: "#F61067",
    opacity: 0.8,
    flex: 1,
    alignItems: "center",
    padding: 8,
  },
  container: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  container2: {
    gap: 16,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  img: {
    width: 60,
    height: "100%",
  },
  title: {
    flex: 1,
    fontSize: 16,
  },
  year: {
    color: "gray",
    fontSize: 12,
  },
});

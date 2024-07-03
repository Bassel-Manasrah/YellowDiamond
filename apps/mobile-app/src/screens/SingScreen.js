import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Button, StatusBar } from "react-native";
import { Audio } from "expo-av";

export default function SingScreen() {
  const [sound, setSound] = useState(null);

  const playSound = async () => {
    if (sound) {
      await sound.playAsync();
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
    }
  };

  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          {
            uri: "https://p.scdn.co/mp3-preview/374b492571c9ba59c2c4b455ab79ee7501adab93?cid=7e701abdfd66456e86e65bd5d028a52d",
          }, // Replace with your URL
          { shouldPlay: false }
        );
        setSound(newSound);
      } catch (error) {
        console.error("Error loading sound", error);
      }
    };

    loadSound();

    // Cleanup function to unload the sound when the component unmounts
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Button onPress={playSound} title="Play Sound" style={{ margin: 16 }} />
      <Button onPress={stopSound} title="Stop Sound" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import messageStorageService from "../services/MessageStorageService";
import contactService from "../services/ContactService";
import recommendationStorageService from "../services/RecommendationStorageService";
import recommendationsFetchingService from "../services/RecommendationFetchingService";

export default function DatabaseLog() {
  const [messages, setMessages] = useState([]);
  const [id, setId] = useState(20);

  const fetchMessages = async () => {
    // let messages = await messageStorageService.getMessagesAsync();
    let messages = await recommendationStorageService.getRecommendationsAsync();
    setMessages(messages);
  };
  const logChatPreviews = async () => {
    const messages = await messageStorageService.getChatPreviewsAsync();
    console.log(messages);
  };
  function getRandomNumber(min, max) {
    // Generate a random decimal number between 0 (inclusive) and 1 (exclusive)
    const randomDecimal = Math.random();

    // Scale the random decimal to the desired range [min, max]
    const randomNumber = Math.floor(randomDecimal * (max - min + 1)) + min;

    return randomNumber;
  }

  useEffect(() => {
    (async () => {
      await recommendationStorageService.openAsync();
      // setInterval(() => {
      //   recommendationStorageService.addRecommendationAsync({
      //     id: getRandomNumber(0, 100000),
      //     name: "bassool",
      //     year: 2002,
      //     imgUrl: "khhhh",
      //   });
      // }, 1000);
      const fetched = await recommendationsFetchingService.fetchAsync(550);
      console.log(fetched);
    })();

    // console.log("database log");
    //   // fetchMessages();
    //   // logChatPreviews();
    //   // const name = contactService.getNameByPhoneNumber("+972524814835");
    //   // console.log(`name: ${Object.keys(name)}`);
    //   (async () => {
    //     console.log("----------------------");
    //     previews = await messageStorageService.getChatPreviewsAsync();
    //     previews = await Promise.all(
    //       previews.map(async (preview) => ({
    //         ...preview,
    //         phoneNumber: await contactService.getNameByPhoneNumberAsync(
    //           preview.phoneNumber
    //         ),
    //       }))
    //     );

    //     console.log(previews);
    //   })();
    // }, []);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Database Log</Text>
      {/* <TouchableOpacity
        onPress={() => messageStorageService.deleteAllMessages()}
        style={styles.button}
      >
        <Text style={{ color: "white" }}>Delete all</Text>
      </TouchableOpacity> */}
      <TouchableOpacity onPress={fetchMessages} style={styles.button}>
        <Text style={{ color: "white" }}>Refresh</Text>
      </TouchableOpacity>
      <FlatList
        data={messages}
        renderItem={({ item }) => {
          return (
            // <Text>{`${item.phoneNumber} : ${item.content} (isMine: ${item.isMine}, isRead: ${item.isRead})`}</Text>
            <Text>{`${item.id}, ${item.name}, ${item.year}`}</Text>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: "pink",
  },
  title: {
    marginBottom: 12,
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    padding: 12,
    backgroundColor: "royalblue",
    marginVertical: 8,
  },
});

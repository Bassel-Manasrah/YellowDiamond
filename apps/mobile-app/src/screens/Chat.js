import { StyleSheet, FlatList } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Message from "../components/Message";
import { SafeAreaView } from "react-native-safe-area-context";
import InputBox from "../components/InputBox";
import ChatHeader from "../components/ChatHeader";
import { StatusBar } from "expo-status-bar";
import uuid from "react-native-uuid";
import { store } from "../utils/store";
import messageStorageService from "../services/MessageStorageService";
import realTimeService from "../services/RealTimeService";

export default function Chat({ navigation, route }) {
  const { phoneNumber, name } = route.params;

  const [messages, setMessages] = useState([]);
  const [myPhoneNumber, setMyPhoneNumber] = useState(null);
  const flatListRef = useRef();

  const fetchMessages = async () => {
    console.log("phoneNumber", phoneNumber);
    const fetched = await messageStorageService.getMessagesByPhoneNumberAsync(
      phoneNumber
    );
    setMessages(fetched);
  };

  const fetchMyPhoneNumber = async () => {
    fetched = await store.get("myPhoneNumber");
    console.log(fetched);
    setMyPhoneNumber(fetched);
  };

  useEffect(() => {
    messageStorageService.markMessagesAsRead(phoneNumber);
    fetchMessages();
    fetchMyPhoneNumber();
    messageStorageService.onNewMessage((message) => {
      if (message.phoneNumber === phoneNumber)
        setMessages((messages) => [...messages, { ...message, id: uuid.v4() }]);
    });

    return () => {
      messageStorageService.markMessagesAsRead(phoneNumber);
    };
  }, []);

  const onSend = async (messageText) => {
    // add message to local messages storeage
    await messageStorageService.addMessageAsync({
      phoneNumber,
      isMine: true,
      isRead: true,
      content: messageText,
    });

    // send message to the real time server
    realTimeService.send({ to: phoneNumber, text: messageText });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="royalblue" style="light" />
      <ChatHeader
        name={name}
        onBackPress={() => {
          navigation.navigate("home");
        }}
        imgUri="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZiwJCHgq3aS6uqBsM9jXnZfzivlNkahN_zNz4ZOpETg&s"
      />
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <Message text={item.content} mine={item.isMine} />
        )}
        ref={flatListRef}
        onContentSizeChange={() =>
          flatListRef.current.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
      />
      <InputBox onSend={onSend} phoneNumber={phoneNumber} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf0e6",
  },
});

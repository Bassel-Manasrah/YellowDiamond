import { StyleSheet, FlatList } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Message from "../components/Message";
import { SafeAreaView } from "react-native-safe-area-context";
import InputBox from "../components/InputBox";
import ChatHeader from "../components/ChatHeader";
import { StatusBar } from "expo-status-bar";
import chatService from "../services/ChatService";
import uuid from "react-native-uuid";
import { store } from "../utils/store";

export default function Chat({ navigation, route }) {
  const { phoneNumber, name } = route.params;

  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [myPhoneNumber, setMyPhoneNumber] = useState(null);
  const flatListRef = useRef();

  const fetchMessages = async () => {
    const fetched = await chatService.getMessagesByPhoneNumberAsync(
      phoneNumber
    );
    setMessages(fetched);
  };

  const fetchMyPhoneNumber = async () => {
    setMyPhoneNumber(await store.get("myPhoneNumber"));
  };

  useEffect(() => {
    fetchMessages();
    fetchMyPhoneNumber();
    chatService.onNewMessage(phoneNumber, (message) => {
      setMessages((messages) => [...messages, { ...message, id: uuid.v4() }]);
    });
  }, []);

  const onSend = async () => {
    await chatService.sendMessageAsync(phoneNumber, newMessageText);
    setMessages((messages) => [
      ...messages,
      {
        text: newMessageText,
        sender: myPhoneNumber,
        reeiver: phoneNumber,
        id: uuid.v4(),
      },
    ]);
    setNewMessageText("");
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
        renderItem={({ item }) => <Message message={item} />}
        ref={flatListRef}
        onContentSizeChange={() =>
          flatListRef.current.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
      />
      <InputBox
        value={newMessageText}
        onChange={setNewMessageText}
        onSend={onSend}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf0e6",
  },
});

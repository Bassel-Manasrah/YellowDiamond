import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import contactService from "../services/ContactService";
import SplashScreen from "./SplashScreen";
import Contact from "../components/Contact";
import Button from "../components/Button";
import realTimeService from "../services/RealTimeService";
import messageStorageService from "../services/MessageStorageService";
import axios from "axios";

export default function PickContactsScreen({ navigation, route }) {
  const [contacts, setContacts] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const { recommendation } = route.params;

  const joinLists = (listA, listB) => {
    const mapB = new Map(listB.map((item) => [item.phoneNumber, item]));
    return listA.map((itemA) => ({
      ...itemA,
      ...mapB.get(itemA.phoneNumber),
    }));
  };

  useEffect(() => {
    (async () => {
      let fetched = await contactService.fetchRegisteredContactsAsync();

      // const url = `http://${process.env.EXPO_PUBLIC_PREDICT_HOSTNAME}/predict`;
      // const data = {
      //   phoneNumbers: fetched.map((contact) => contact.phoneNumber),
      //   movieId: recommendation.id,
      //   movieType: "movie",
      // };

      // const { data: predicitons } = await axios.post(url, data);
      // console.log("Predictions:", predicitons);

      // fetched = joinLists(fetched, predicitons);
      setContacts(fetched.map((item) => ({ ...item, prediciton: false })));
    })();
  }, []);

  const send = async () => {
    selected.forEach(async ({ phoneNumber }) => {
      // construct message content
      messageContent = `RECOMMENDATION/${recommendation.id}`;

      // add message to local messages storeage
      await messageStorageService.addMessageAsync({
        phoneNumber,
        isMine: true,
        isRead: true,
        content: messageContent,
      });

      // send message to the real time server
      realTimeService.send({ to: phoneNumber, text: messageContent });
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Select Contacts</Text>

      {!contacts && <SplashScreen />}
      {contacts && contacts.length === 0 && (
        <View style={styles.flatList}>
          <Text
            style={{
              paddingHorizontal: 16,
              color: "#F61067",
              fontWeight: "bold",
            }}
          >
            No contacts of yours are registered on the app :(
          </Text>
        </View>
      )}
      {contacts && contacts.length > 0 && (
        <FlatList
          style={styles.flatList}
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Contact
              name={item.name}
              selectable={true}
              showStatus={false}
              selected={selected.includes(item)}
              onPress={() => {
                if (selected.includes(item))
                  setSelected(selected.filter((contact) => contact !== item));
                else setSelected([...selected, item]);
              }}
              showHappiness={true}
              happy={item.prediciton}
            />
          )}
        />
      )}

      <Text style={styles.selectStatus}>{selected.length} selected</Text>
      <Button
        disabled={selected.length === 0}
        onPress={async () => {
          setLoading(true);
          await send();
          navigation.navigate("home");
        }}
      >
        Continue
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 32,
    paddingHorizontal: 16,
    // gap: 8,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  selectStatus: {
    color: "royalblue",
    fontWeight: "bold",
    margin: 8,
    alignSelf: "center",
  },
  flatList: {
    flex: 1,
  },
});

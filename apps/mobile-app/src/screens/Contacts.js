import { View, Text, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import useContacts from "../hooks/useContacts";
import Contact from "../components/Contact";
import axios from "axios";

export default function Contacts() {
  const { contacts, loading, setContacts } = useContacts("IL");

  const fetchRegisteredContacts = async () => {
    const response = await axios.post(
      `http://${process.env.EXPO_PUBLIC_HOSTNAME}/filterRegistered`,
      contacts.map((contact) => contact.phoneNumber)
    );

    const registeredPhoneNumbers = response.data;

    const updatedContacts = contacts.map((contact) => ({
      ...contact,
      registered: registeredPhoneNumbers.includes(contact.phoneNumber),
    }));

    setContacts(updatedContacts);
  };

  useEffect(() => {
    if (!loading) {
      fetchRegisteredContacts();
    }
  }, [loading]);

  return (
    <View style={styles.container}>
      {!loading ? (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.phoneNumber}
          renderItem={({ item }) => (
            <Contact name={item.name} registered={item.registered} />
          )}
        />
      ) : (
        <Text>loading ...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

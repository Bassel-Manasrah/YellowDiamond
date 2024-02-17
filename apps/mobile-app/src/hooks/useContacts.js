import React, { useEffect, useState } from "react";
import * as ExpoContacts from "expo-contacts";
import { parsePhoneNumber } from "awesome-phonenumber";

export default function useContacts(regionCode) {
  const [contacts, setContacts] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    // get permission to read contacts
    const { status } = await ExpoContacts.requestPermissionsAsync();
    if (status !== "granted") return;

    // get contacts data from expo
    const { data } = await ExpoContacts.getContactsAsync();
    const contacts = [];

    // go through the contacts data
    data.forEach((entry) => {
      // extract the phone number
      if (!entry.phoneNumbers) return;
      const phoneNumber = entry.phoneNumbers[0].number;

      // parse the phone number and get the e164 format
      const parsedPhoneNumber = parsePhoneNumber(phoneNumber, {
        regionCode,
      });
      const phoneNumberE164 = parsedPhoneNumber.number.e164;

      /* 
        add it to the list if all the following conditions are met
        1) it's valid
        2) a mobile phone number
        3) does not already exist in the list
      */
      const isValid = parsedPhoneNumber.valid;
      const isMobile = parsedPhoneNumber.typeIsMobile;
      const exists = contacts.some(
        (contact) => contact.phoneNumber === phoneNumberE164
      );

      if (isValid && isMobile && !exists) {
        contacts.push({
          phoneNumber: phoneNumberE164,
          name: entry.name,
        });
      }
    });
    setContacts([...contacts]);
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return { contacts, loading, setContacts };
}

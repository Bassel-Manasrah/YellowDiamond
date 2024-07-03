import * as ExpoContacts from "expo-contacts";
import { normalizePhoneNumber } from "../utils/phoneNumberUtils";
import axios from "axios";

class ContactService {
  async requestPermissionAsync() {
    const { status } = await ExpoContacts.requestPermissionsAsync();
    return status == "granted" ? true : false;
  }

  async fetchContactsAsync() {
    let { data: contacts } = await ExpoContacts.getContactsAsync();

    contacts = contacts.map((contact) => ({
      id: contact.id,
      name: contact.name,
      phoneNumber: normalizePhoneNumber(contact.phoneNumbers[0].number, "IL"),
    }));

    return contacts;
  }

  async fetchRegisteredContactsAsync() {
    let contacts = await this.fetchContactsAsync();

    const { data: registeredPhoneNumbers } = await axios.post(
      `http://${process.env.EXPO_PUBLIC_REG_HOSTNAME}/filterRegistered`,
      contacts.map((contact) => contact.phoneNumber)
    );

    contacts = contacts.filter((contact) => {
      return registeredPhoneNumbers.includes(contact.phoneNumber);
    });

    return contacts;
  }

  async getNameByPhoneNumberAsync(phoneNumber) {
    const contacts = await this.fetchContactsAsync();

    const found = contacts.find((contact) => {
      return phoneNumber === contact.phoneNumber;
    });

    return found.name;
  }
}

const contactService = new ContactService();
export default contactService;

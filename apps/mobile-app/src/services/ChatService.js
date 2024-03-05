import { store } from "../utils/store";
import messageStorageService from "./MessageStorageService";
import realTimeService from "./RealTimeService";

class ChatService {
  constructor() {}

  async sendMessageAsync(to, text) {
    if (!this.myPhoneNumber)
      this.myPhoneNumber = await store.get("myPhoneNumber");

    // construct the message object
    message = { sender: this.myPhoneNumber, receiver: to, text };

    // add message to local messages storeage
    await messageStorageService.addMessageAsync(message);

    // send message to the real time server
    realTimeService.send({ to, text });
  }

  async getMessagesByPhoneNumberAsync(phoneNumber) {
    return messageStorageService.getMessagesByPhoneNumberAsync(phoneNumber);
  }

  onNewMessage(from, callback) {
    realTimeService.subscribe((message) => {
      if (message.sender === from) callback(message);
    });
  }
}

const chatService = new ChatService();
export default chatService;

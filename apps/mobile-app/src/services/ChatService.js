import messageStorageService from "./MessageStorageService";
import realTimeService from "./RealTimeService";

class ChatService {
  async sendMessageAsync(to, text) {
    // construct the message object
    message = { sender: "bassel", receiver: to, text };

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

import { WebSocketServer } from "ws";
import fetchPushToken from "./utils/fetchPushToken.js";
import pushDataNotification from "./utils/pushDataNotification.js";

const wss = new WebSocketServer({ port: process.env.PORT });

const clients = new Map();

wss.on("connection", (ws, request) => {
  ws.on("error", console.error);

  const phoneNumber = request.url.slice(1);
  ws.phoneNumber = phoneNumber;

  if (!phoneNumber || clients.has(phoneNumber)) {
    ws.close(4000, "Invalid or duplicate phone number");
    return;
  }
  clients.set(phoneNumber, ws);
  console.log(`client conencted with phone number ${phoneNumber}`);

  ws.on("close", () => {
    clients.delete(ws.phoneNumber);
    console.log(`${phoneNumber} disconnected`);
  });

  ws.on("message", async (message) => {
    console.log(`received message from ${ws.phoneNumber}`);
    // parese the message
    const { to, text } = JSON.parse(message);

    if (!to || !text) return;

    const messageToSend = {
      phoneNumber: ws.phoneNumber,
      isMine: false,
      isRead: false,
      content: text,
    };

    // Check if the phone number 'to' is connected
    if (clients.has(to)) {
      // if it is, send the message via web socket
      console.log(`sending message from ${to}`);

      const dest = clients.get(to);
      dest.send(JSON.stringify(messageToSend));
    } else {
      // if it is not, send the message to it via push token
      const pushToken = await fetchPushToken(to);

      if (!pushToken) return;

      console.log(`pushToken: ${pushToken}`);
      await pushDataNotification(pushToken, messageToSend);
    }
  });
});

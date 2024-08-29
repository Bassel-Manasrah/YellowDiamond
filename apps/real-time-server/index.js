import { WebSocketServer } from "ws";
import fetchPushToken from "./utils/fetchPushToken.js";
import pushDataNotification from "./utils/pushDataNotification.js";
import { MongoClient } from "mongodb";
import axios from "axios";

const client = new MongoClient(process.env.USERS_DB_URI);
await client.connect();
const database = client.db(process.env.USERS_DB_NAME);
const collection = database.collection("users");

const wss = new WebSocketServer({ port: process.env.PORT });

const clients = new Map();

wss.on("connection", async (ws, request) => {
  ws.on("error", console.error);

  // Extract phoneNumber and token from the request URL
  const params = new URLSearchParams(request.url.split("?")[1]);
  const phoneNumber = params.get("phoneNumber");
  const token = params.get("token");

  console.log(`${phoneNumber} | ${token}`);

  // Validate phoneNumber
  if (!phoneNumber || clients.has(phoneNumber)) {
    ws.close(4000, "Invalid or duplicate phone number");
    return;
  }

  // Validate token
  if (!token) {
    ws.close(4000, "Invalid token");
    return;
  }

  try {
    const response = await axios.post(
      `${process.env.AUTH_SERVICE_URI}/validateToken`,
      {
        phoneNumber,
        token,
      }
    );
  } catch (e) {
    ws.close(4001, "Invalid token");
    return;
  }

  ws.phoneNumber = phoneNumber;
  clients.set(phoneNumber, ws);
  console.log(`client conencted with phone number ${phoneNumber}`);

  ws.on("close", () => {
    clients.delete(ws.phoneNumber);
    console.log(`${phoneNumber} disconnected`);
  });

  ws.on("message", async (message) => {
    console.log(`received message from ${ws.phoneNumber}`);
    // parese the message
    const { to, text, token } = JSON.parse(message);

    if (!to || !text || !token) return;

    const messageToSend = {
      phoneNumber: ws.phoneNumber,
      isMine: false,
      isRead: false,
      content: text,
    };

    // Check if the phone number 'to' is connected
    if (clients.has(to)) {
      // if it is, send the message via web socket
      console.log(`sending message to ${to}`);

      const dest = clients.get(to);
      dest.send(JSON.stringify(messageToSend));
    } else {
      console.log(`${to} is not connected`);

      // if it is not, send the message to it via push token
      const pushToken = await fetchPushToken(to);

      if (!pushToken) return;

      console.log(`pushToken: ${pushToken}`);
      await pushDataNotification(pushToken, messageToSend);
    }
  });
});

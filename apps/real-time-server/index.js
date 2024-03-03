import { WebSocketServer } from "ws";

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
  });

  ws.on("message", (message) => {
    console.log(`received message from ${ws.phoneNumber}`);
    // parese the message
    const { to, text } = JSON.parse(message);

    if (!to || !text) return;

    // Check if the phone number 'to' exists
    if (clients.has(to)) {
      // if it does, send the message to it
      const dest = clients.get(to);
      dest.send(JSON.stringify({ sender: ws.phoneNumber, receiver: to, text }));
    }
  });
});

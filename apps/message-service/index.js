import express from "express";
import { MongoClient } from "mongodb";
import { Expo } from "expo-server-sdk";

const app = express();
const port = process.env.PORT || 3000;
const dbUri = process.env.USERS_DB_URI;
const dbName = process.env.USERS_DB_NAME;
const expo = new Expo({
  useFcmV1: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const messages = [
    {
      to: "ExponentPushToken[_DH89xJZ7tZnIYdX0qaHfr]",
      data: { from: "6666", text: "hey" },
      priority: "high",
    },
  ];

  let tickets = await expo.sendPushNotificationsAsync(messages);
  res.json(tickets);
});

app.post("/sendMessage", async (req, res) => {
  const { from, to, message } = req.body;

  const client = new MongoClient(dbUri);
  await client.connect();
  const collection = client.db(dbName).collection("users");
  const user = await collection.findOne({ phoneNumber: to });

  client.close();

  const messages = [
    {
      to: user.pushToken,
      body: "This is a test notification",
      data: { message },
    },
  ];

  await expo.sendPushNotificationsAsync(messages);
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

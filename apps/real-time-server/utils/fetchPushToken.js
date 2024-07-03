import { MongoClient } from "mongodb";

export default async function fetchPushToken(phoneNumber) {
  const client = new MongoClient(process.env.USERS_DB_URI);
  const dbName = process.env.USERS_DB_NAME;

  await client.connect();
  console.log("connected successfully to database");
  const db = client.db(dbName);
  const collection = db.collection("users");

  const result = await collection.findOne({ phoneNumber: phoneNumber });

  return result?.pushToken;
}

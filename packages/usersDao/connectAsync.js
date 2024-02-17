import { MongoClient } from "mongodb";

const connectAsync = async () => {
  // connect to database
  const client = new MongoClient("mongodb://localhost:27017");
  await client.connect();

  // fetch the collection
  const collection = client.db("greatDB").collection("users");

  // define close function callback
  const closeAsync = async () => {
    await client.close();
  };

  // return collectiona and close function
  return { collection, closeAsync };
};

export default connectAsync;

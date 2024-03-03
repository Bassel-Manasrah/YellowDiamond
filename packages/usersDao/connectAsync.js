import { MongoClient } from "mongodb";

const connectAsync = async (uri, dbName) => {
  // connect to database
  const client = new MongoClient(uri);
  await client.connect();

  // fetch the collection
  const collection = client.db(dbName).collection("users");

  // define close function callback
  const closeAsync = async () => {
    await client.close();
  };

  // return collectiona and close function
  return { collection, closeAsync };
};

export default connectAsync;

import connectAsync from "./connectAsync.js";
import handleErrorsAsync from "./handleErrorsAsync.js";

class userDao {
  constructor(uri, dbName) {
    this.uri = uri;
    this.dbName = dbName;
  }
  async addAsync({ phoneNumber, pushToken }) {
    return await handleErrorsAsync(async () => {
      // connect to database
      const { collection, closeAsync } = await connectAsync(
        this.uri,
        this.dbName
      );

      // insert the user in the database
      const { insertedId } = await collection.insertOne({
        phoneNumber,
        pushToken,
      });

      // close connection
      await closeAsync();

      // return inserted user's id
      return insertedId;
    });
  }
  async getByPhoneNumberAsync(phoneNumber) {
    return await handleErrorsAsync(async () => {
      // connect to the database
      const { collection, closeAsync } = await connectAsync(
        this.uri,
        this.dbName
      );

      // find the user with that phone number
      const user = await collection.findOne({ phoneNumber });

      // close connection
      await closeAsync();

      // return the user
      return user;
    });
  }
}

export default userDao;

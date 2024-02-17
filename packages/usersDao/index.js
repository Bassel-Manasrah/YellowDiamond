import connectAsync from "./connectAsync.js";
import handleErrorsAsync from "./handleErrorsAsync.js";

const userDao = {
  addAsync: async ({ phoneNumber }) => {
    return await handleErrorsAsync(async () => {
      // connect to database
      const { collection, closeAsync } = await connectAsync();

      // insert the user in the database
      const { insertedId } = await collection.insertOne({ phoneNumber });

      // close connection
      await closeAsync();

      // return inserted user's id
      return insertedId;
    });
  },

  getByPhoneNumberAsync: async (phoneNumber) => {
    return await handleErrorsAsync(async () => {
      // connect to the database
      const { collection, closeAsync } = await connectAsync();

      // find the user with that phone number
      const user = await collection.findOne({ phoneNumber });

      // close connection
      await closeAsync();

      // return the user
      return user;
    });
  },
};

export default userDao;

import filterAsync from "./utils/filterAsync.js";
import userDao from "./utils/usersDao/index.js";

const registry = {
  userDao: new userDao(process.env.USERS_DB_URI, process.env.USERS_DB_NAME),

  isRegisteredAsync: async (phoneNumber) => {
    const user = await registry.userDao.getByPhoneNumberAsync(phoneNumber);
    return user ? true : false;
  },

  filterRegisteredAsync: async (phoneNumbers) => {
    const registeredPhoneNumbers = await filterAsync(
      phoneNumbers,
      registry.isRegisteredAsync
    );
    return registeredPhoneNumbers;
  },
};

export default registry;

import filterAsync from "./utils/filterAsync.js";
import usersDao from "@yellowdiamond/usersdao";

const registry = {
  isRegisteredAsync: async (phoneNumber) => {
    const user = await usersDao.getByPhoneNumberAsync(phoneNumber);
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

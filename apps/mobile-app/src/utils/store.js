import * as SecureStore from "expo-secure-store";

export const store = {
  async get(key) {
    const value = await SecureStore.getItemAsync(key);
    return value;
  },

  async set(key, value) {
    await SecureStore.setItemAsync(key, value);
  },
};

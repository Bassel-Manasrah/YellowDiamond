import SimpleJSON from "simple-json-db";

const db = new SimpleJSON("data.json");

export const set = async (phoneNumber, otp) => {
  db.set(phoneNumber, otp);
};

export const get = async (phoneNumber) => {
  return db.get(phoneNumber);
};

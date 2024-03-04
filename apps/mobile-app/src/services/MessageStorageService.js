import * as SQLite from "expo-sqlite";

class MessageStorageService {
  #db = null;
  #opened = false;

  async connectAsync() {
    this.#db = SQLite.openDatabase("yellowDiamond.#db");
    console.log("messageStorageService: connect");
  }

  #createTableIfNotExist = () => {
    this.#db.transaction((tx) => {
      const createSql =
        "CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, sender TEXT, receiver TEXT, text TEXT)";
      tx.executeSql(createSql);
    });
  };

  async getMessagesAsync() {
    this.#createTableIfNotExist();

    return new Promise((resolve, reject) => {
      const getSql = "SELECT * FROM messages";

      const callback = (tx, { rows }) => {
        resolve(rows._array);
      };

      const errorCallback = (tx, error) => {
        console.log(error);
        reject(error);
      };

      this.#db.transaction((tx) => {
        tx.executeSql(getSql, [], callback, errorCallback);
      });
    });
  }

  async getMessagesByPhoneNumberAsync(phoneNumber) {
    console.log("messageStorageService: getMessages");
    this.#createTableIfNotExist();

    return new Promise((resolve, reject) => {
      const getSql = "SELECT * FROM messages WHERE sender = ? OR receiver = ?";

      const callback = (tx, { rows }) => {
        resolve(rows._array);
      };

      const errorCallback = (tx, error) => {
        console.log(error);
        reject(error);
      };

      this.#db.transaction((tx) => {
        tx.executeSql(
          getSql,
          [phoneNumber, phoneNumber],
          callback,
          errorCallback
        );
      });
    });
  }

  async addMessageAsync({ sender, receiver, text }) {
    this.#createTableIfNotExist();

    return new Promise((resolve, reject) => {
      const addSql =
        "INSERT INTO messages (sender, receiver, text) VALUES (?, ?, ?)";

      const callback = (tx, { insertId }) => {
        resolve(insertId);
      };

      const errorCallback = (tx, error) => {
        reject(null);
      };

      this.#db.transaction((tx) => {
        tx.executeSql(
          addSql,
          [sender, receiver, text],
          callback,
          errorCallback
        );
      });
    });
  }

  async closeAsync() {
    await this.#db.closeAsync();
  }
}

const messageStorageService = new MessageStorageService();
export default messageStorageService;

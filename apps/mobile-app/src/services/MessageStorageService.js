import * as SQLite from "expo-sqlite/next";

class MessageStorageService {
  constructor() {
    this.db = null;
    this.newMessageSubs = [];
    this.readStatusSubs = [];
  }

  async openAsync() {
    this.db = await SQLite.openDatabaseAsync("messages");
    await this.db.execAsync(
      "CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, phoneNumber TEXT, isMine INTEGER, isRead INTEGER, content TEXT)"
    );
    console.log(`messageStorageService: opened database`);
  }

  async closeAsync() {
    await this.db.closeAsync();
    console.log(`messageStorageService: closed database`);
  }

  async getMessagesAsync() {
    const messages = await this.db.getAllAsync("SELECT * FROM messages");

    return messages;
  }

  async addMessageAsync({ phoneNumber, isMine, isRead, content }) {
    const { lastInsertRowId } = await this.db.runAsync(
      "INSERT INTO messages (phoneNumber, isMine, isRead, content) VALUES (?, ?, ?, ?)",
      phoneNumber,
      isMine,
      isRead,
      content
    );
    console.log(
      `messageStorageService: added message (id: ${lastInsertRowId})`
    );

    this.notifySubs(this.newMessageSubs, {
      phoneNumber,
      isMine,
      isRead,
      content,
    });

    return lastInsertRowId;
  }

  async deleteAllMessages() {
    await this.db.execAsync("DELETE FROM messages");
  }

  async getChatPreviewsAsync() {
    const query = `
      SELECT MAX(id) AS id, phoneNumber, content AS lastMessage, SUM(CASE WHEN isRead = 0 THEN 1 ELSE 0 END) AS unreadCount
      FROM messages
      GROUP BY phoneNumber;`;

    const result = await this.db.getAllAsync(query);

    return result;
  }

  async getMessagesByPhoneNumberAsync(phoneNumber) {
    const query = `
      SELECT *
      FROM messages
      WHERE phoneNumber = ?
    `;

    const result = await this.db.getAllAsync(query, phoneNumber);
    return result;
  }

  async markMessagesAsRead(phoneNumber) {
    console.log("markMessagesAsRead");
    const query = `
      UPDATE messages
      SET isRead = 1
      WHERE phoneNumber = ?
    `;
    await this.db.runAsync(query, phoneNumber);
    this.notifySubs(this.readStatusSubs);
  }

  onNewMessage(callback) {
    this.newMessageSubs.push(callback);
  }

  onChangeReadStatus(callback) {
    this.readStatusSubs.push(callback);
  }

  notifySubs(subs, input) {
    subs.forEach((sub) => sub(input));
  }
}

const messageStorageService = new MessageStorageService();
export default messageStorageService;

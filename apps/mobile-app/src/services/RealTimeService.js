import { store } from "../utils/store";
import forge from "node-forge";

class RealTimeService {
  #subscribers = [];
  #ws;
  #connected = false;
  #token = null;

  async connectAsync(phoneNumber) {
    if (this.#connected) return true;

    if (!this.#token) {
      this.#token = await store.get("token");
    }

    return new Promise(async (resolve, reject) => {
      const encodedPhoneNumber = encodeURIComponent(phoneNumber);
      const encodedToken = encodeURIComponent(this.#token);
      console.log(`---------------- token: ${encodedToken}`);
      this.#ws = new WebSocket(
        `ws://${process.env.EXPO_PUBLIC_REALTIME_HOSTNAME}?phoneNumber=${encodedPhoneNumber}&token=${encodedToken}`
      );
      this.#ws.onmessage = (e) => this.#receive(e.data);
      this.#ws.onopen = () => {
        this.#connected = true;
        console.log(`realTimeService: opened connection as ${phoneNumber}`);
        resolve(true);
      };
      this.#ws.onerror = (error) => {
        console.error(
          `realTimeService: failed to connect as ${phoneNumber}`,
          error
        );
        resolve(false);
      };

      this.#ws.on;
    });
  }
  #receive(message) {
    console.log(`received message: ${message}`);

    message = JSON.parse(message);

    console.log(`parsed message: ${message}`);

    this.#subscribers.forEach((subscriber) => subscriber(message));
  }
  send(message) {
    message = JSON.stringify({
      ...message,
      token: encodeURIComponent(this.#token),
    });
    if (!this.#connected) return false;
    this.#ws.send(message);
    return true;
  }
  subscribe(callback) {
    this.#subscribers.push(callback);
    console.log(
      `realTimeService: added subscriber (total: ${this.#subscribers.length})`
    );
    return () => {
      this.#unsubscribe(callback);
    };
  }
  #unsubscribe(callback) {
    this.#subscribers = this.#subscribers.filter(
      (subscriber) => subscriber !== callback
    );
  }

  close() {
    if (this.#ws && this.#ws.readyState === this.#ws.OPEN) {
      this.#ws.close();
      this.#connected = false;
      console.log(`realTimeService: closed connection`);
    }
  }
}

const realTimeService = new RealTimeService();
export default realTimeService;

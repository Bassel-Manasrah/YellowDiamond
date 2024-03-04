class RealTimeService {
  #subscribers = [];
  #ws;
  #connected = false;

  async connectAsync() {
    if (this.#connected) return true;

    return new Promise((resolve, reject) => {
      this.#ws = new WebSocket(
        `ws://${process.env.EXPO_PUBLIC_REALTIME_HOSTNAME}/${process.env.EXPO_PUBLIC_PHONE_NUMBER}`
      );
      this.#ws.onmessage = (e) => this.#receive(e.data);
      this.#ws.onopen = () => {
        this.#connected = true;
        resolve(true);
      };
      this.#ws.onerror = () => {
        resolve(false);
      };

      this.#ws.on;
    });
  }
  #receive(message) {
    message = JSON.parse(message);
    this.#subscribers.forEach((subscriber) => subscriber(message));
  }
  send(message) {
    message = JSON.stringify(message);
    if (!this.#connected) return false;
    this.#ws.send(message);
    return true;
  }
  subscribe(callback) {
    this.#subscribers.push(callback);
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
    }
  }
}

const realTimeService = new RealTimeService();
export default realTimeService;

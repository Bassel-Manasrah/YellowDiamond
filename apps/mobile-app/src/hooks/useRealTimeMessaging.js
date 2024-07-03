import { useEffect, useState } from "react";
import { AppState } from "react-native";
import messageStorageService from "../services/MessageStorageService";
import realTimeService from "../services/RealTimeService";

export default function useRealTimeMessaging(phoneNumber) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (state) => {
      state === "active" ? await activate() : await deactivate();
    });
    activate();
    return () => {
      subscription.remove();
    };
  }, []);

  let cleanup = null;

  const activate = async () => {
    console.log("useRealTimeMessaging: activating");
    cleanup = realTimeService.subscribe((message) => {
      messageStorageService.addMessageAsync(message);
    });
    await realTimeService.connectAsync(phoneNumber);
    await messageStorageService.openAsync();
    setLoading(false);
  };

  const deactivate = async () => {
    console.log("useRealTimeMessaging: deactivating");
    realTimeService.close();
    await messageStorageService.closeAsync();
    cleanup();
  };

  return { loading };
}

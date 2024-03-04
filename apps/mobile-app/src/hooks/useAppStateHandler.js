import { useEffect, useState } from "react";
import { AppState } from "react-native";
import messageStorageService from "../services/MessageStorageService";
import realTimeService from "../services/RealTimeService";

export default function useAppStateHandler() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (state) => {
    if (state === "active") {
      handleAppForeground();
    } else {
      handleAppBackground();
    }
  };

  let unsubscribe = null;

  const handleAppForeground = async () => {
    console.log("foreground");
    await messageStorageService.connectAsync();
    unsubscribe = realTimeService.subscribe((message) => {
      messageStorageService.addMessageAsync(message);
    });
    await realTimeService.connectAsync();

    setReady(true);
  };

  const handleAppBackground = async () => {
    console.log("background");
    realTimeService.close();
    await messageStorageService.closeAsync();
    unsubscribe();
    setReady(false);
  };

  return { ready };
}

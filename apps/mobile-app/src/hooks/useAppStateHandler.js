import { useEffect, useState } from "react";
import { AppState } from "react-native";
import messageStorageService from "../services/MessageStorageService";
import realTimeService from "../services/RealTimeService";

export default function useAppStateHandler() {
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    activate();
    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (state) => {
    if (state === "active") {
      activate();
    } else {
      deactivate();
    }
  };

  let unsubscribe = null;

  const activate = async () => {
    unsubscribe = realTimeService.subscribe((message) => {
      messageStorageService.addMessageAsync({
        with: message.from,
        isMine: false,
        content: message.text,
      });
    });
    await realTimeService.connectAsync();
    setActivated(true);
  };

  const deactivate = async () => {
    realTimeService.close();
    unsubscribe();
    setActivated(false);
  };

  return {
    activated,
  };
}

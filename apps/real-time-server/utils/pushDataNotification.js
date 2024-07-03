import { Expo } from "expo-server-sdk";

const expo = new Expo({
  useFcmV1: true,
});

export default async function pushDataNotification(pushToken, data) {
  await expo.sendPushNotificationsAsync([
    {
      to: pushToken,
      data,
    },
  ]);
}

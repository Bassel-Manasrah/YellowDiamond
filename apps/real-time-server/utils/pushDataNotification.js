import { Expo } from "expo-server-sdk";

const expo = new Expo({
  useFcmV1: true,
});

export default async function pushDataNotification(pushToken, data) {
  console.log({
    to: pushToken,
    data,
  });
  try {
    const result = await expo.sendPushNotificationsAsync([
      {
        title: "You have a new message!",
        to: pushToken,
        data,
      },
    ]);
    console.log(result);
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}

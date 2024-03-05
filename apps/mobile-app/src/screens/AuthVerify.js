import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import OTP from "../components/OTP";
import Button from "../components/Button";
import axios from "axios";
import { store } from "../utils/store";

export default function AuthVerify({ route, navigation }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const canContinue = otp.length === 4;
  const { phoneNumber } = route.params;

  const onPress = async () => {
    setLoading(true);
    const url = `http://${process.env.EXPO_PUBLIC_AUTH_HOSTNAME}/verifyOTP`;
    const payload = {
      phoneNumber,
      otp,
    };
    axios
      .post(url, payload)
      .then(async (response) => {
        const { token } = response.data;
        await store.set("token", token);
        await store.set("myPhoneNumber", phoneNumber);
      })
      .catch((error) => {
        navigation.navigate("authInit");
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Enter verification code</Text>
      <OTP onChange={setOtp} />
      <View style={styles.spacer}></View>
      <Button disabled={!canContinue} loading={loading} onPress={onPress}>
        Continue
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 32,
    gap: 36,
  },
  spacer: {
    flex: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
  },
});

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
    navigation.navigate("registerPushNotification", {
      phoneNumber,
      otp,
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

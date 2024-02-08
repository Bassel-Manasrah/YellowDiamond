import { View, Text, StyleSheet, processColor } from "react-native";
import PhoneInput from "react-native-international-phone-number";
import Button from "../components/Button";
import { useState } from "react";
import axios from "axios";

export default function AuthInit() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

  const onPress = async () => {
    cleanedPhoneNumber = phoneNumber.replace(/^0+/, "");
    countryCode = selectedCountry.callingCode;
    try {
      const response = await axios.post(
        `http://${process.env.EXPO_PUBLIC_HOSTNAME}/sendOTP`,
        {
          phoneNumber: `${countryCode}${cleanedPhoneNumber}`,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your phone number</Text>
      <PhoneInput
        value={phoneNumber}
        selectedCountry={selectedCountry}
        onChangePhoneNumber={setPhoneNumber}
        onChangeSelectedCountry={setSelectedCountry}
        customMask={["##########"]}
      />
      <View style={{ flex: 1 }}></View>

      <Button onPress={onPress}>Continue</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 32,
    gap: 36,
  },
  header: {
    gap: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
  },
});

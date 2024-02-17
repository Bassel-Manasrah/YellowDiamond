import React from "react";
import { OtpInput } from "react-native-otp-entry";

export default function OTP({ onChange }) {
  return (
    <OtpInput numberOfDigits={4} focusColor="#075eec" onTextChange={onChange} />
  );
}

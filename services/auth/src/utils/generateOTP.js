import { generate } from "otp-generator";

const generateOTP = () => {
  const options = {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  };
  const otp = generate(4, options);
  return otp;
};

export default generateOTP;

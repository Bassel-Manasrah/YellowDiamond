import { get, set } from "./db.js";
import sendSMS from "./utils/sendSMS.js";
import generateOTP from "./utils/generateOTP.js";
import generateToken from "./utils/generateToken.js";

class Auth {
  constructor() {}

  async sendOTP(phoneNumber) {
    // generate verification code
    const otp = generateOTP();

    // send verification code via SMS
    sendSMS({
      to: phoneNumber,
      from: "YellowDiamond",
      text: `Your verification code is: ${otp}`,
    });

    // save the verification code to the database
    set(phoneNumber, otp);
  }

  async verifyOTP(phoneNumber, otp) {
    const realOtp = await get(phoneNumber);

    const verified = realOtp === otp;
    let token = verified ? generateToken({ phoneNumber }) : null;

    return { verified, token };
  }
}

export default Auth;

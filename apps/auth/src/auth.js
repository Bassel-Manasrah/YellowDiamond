import { get, set } from "./db.js";
import sendSMS from "./utils/sendSMS.js";
import generateOTP from "./utils/generateOTP.js";
import generateToken from "./utils/generateToken.js";
import userDao from "./utils/usersDao/index.js";

class Auth {
  constructor() {
    this.userDao = new userDao(
      process.env.USERS_DB_URI,
      process.env.USERS_DB_NAME
    );
  }

  async sendOTP(phoneNumber) {
    // generate verification code
    const otp = generateOTP();

    console.log("here");
    // send verification code via SMS
    sendSMS({
      to: "972585100114",
      from: "Vonage APIs",
      text: `Your verification code is: ${otp}`,
    });

    // save the verification code to the database
    set(phoneNumber, otp);
  }

  async register(phoneNumber, otp, pushToken) {
    const realOtp = await get(phoneNumber);

    const verified = realOtp === otp;
    let token = verified ? generateToken({ phoneNumber }) : null;

    if (verified) {
      const movieProfile = new Array(26944).fill(0);
      await this.userDao.addAsync({ phoneNumber, pushToken, movieProfile });
    }

    return { verified, token };
  }
}

export default Auth;

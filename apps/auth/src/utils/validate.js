import jwt from "jsonwebtoken";

function validate(token, phoneNumber) {
  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Check if the decoded phone number matches the provided phone number
    if (decoded.phoneNumber === phoneNumber) {
      console.log("Token is valid and matches the phone number.");
      return true;
    } else {
      console.log("Token is valid but does not match the phone number.");
      return false;
    }
  } catch (error) {
    console.error("Token validation failed:", error.message);
    return false;
  }
}

export default validate;

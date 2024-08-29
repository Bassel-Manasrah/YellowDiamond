import express from "express";
import Auth from "./auth.js";

const router = express.Router();
const auth = new Auth();

router.get("/", (req, res) => {
  res.status(200).send("auth service is up!");
  console.log("pingo");
});

router.post("/sendOTP", (req, res) => {
  console.log("pingo");
  const phoneNumber = req.body.phoneNumber;
  if (phoneNumber) {
    auth.sendOTP(phoneNumber);
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

router.post("/register", async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const otp = req.body.otp;
  const pushToken = req.body.pushToken;

  const { verified, token } = await auth.register(phoneNumber, otp, pushToken);
  verified ? res.status(200).send({ token }) : res.sendStatus(401);
});

router.post("/validateToken", async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const token = req.body.token;

  const isValid = auth.validate(token, phoneNumber);
  console.log(`isValid: ${isValid}`);
  isValid ? res.sendStatus(200) : res.sendStatus(401);
});

export default router;

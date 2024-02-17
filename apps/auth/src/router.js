import express from "express";
import Auth from "./auth.js";

const router = express.Router();
const auth = new Auth();

router.get("/", (req, res) => {
  res.status(200).send("auth service is up!");
  console.log("pingo");
});

router.post("/sendOTP", (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  if (phoneNumber) {
    auth.sendOTP(phoneNumber);
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

router.post("/verifyOTP", async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const otp = req.body.otp;
  const { verified, token } = await auth.verifyOTP(phoneNumber, otp);
  verified ? res.status(200).send({ token }) : res.sendStatus(401);
});

export default router;

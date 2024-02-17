import express from "express";
import registry from "./registry.js";

const router = express.Router();

router.post("/filterRegistered", async (req, res) => {
  const phoneNumbers = req.body;

  if (!phoneNumbers || !Array.isArray(phoneNumbers)) {
    return res.status(400).json({ error: "Invalid request format" });
  }

  const registeredPhoneNumbers = await registry.filterRegisteredAsync(
    phoneNumbers
  );

  res.json(registeredPhoneNumbers);
});

export default router;

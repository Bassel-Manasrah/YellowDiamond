import { Vonage } from "@vonage/server-sdk";

const vonage = new Vonage({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
});

const sendSMS = async ({ to, from, text }) => {
  // await vonage.sms
  //   .send({ to, from, text })
  //   .then((resp) => {
  //     console.log("Message sent successfully");
  //     console.log(resp);
  //   })
  //   .catch((err) => {
  //     console.log("There was an error sending the messages.");
  //     console.error(err);
  //   });
};

export default sendSMS;

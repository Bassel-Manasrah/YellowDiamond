import app from "./app.js";
import "dotenv/config";

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(
    `listening on port ${port} | ${process.env.API_KEY} | ${process.env.API_SECRET}`
  );
});

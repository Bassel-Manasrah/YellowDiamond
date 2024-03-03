import app from "./app.js";
import "dotenv/config";

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});

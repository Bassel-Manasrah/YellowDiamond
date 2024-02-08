import app from "./app.js";
import "dotenv/config";

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

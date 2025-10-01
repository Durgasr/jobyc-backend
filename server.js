import app from "./app.js";
import { connectDB } from "./config/db.js";

const port = process.env.PORT ||3700

app.listen(port, async (err) => {
  if (err) {
    console.log(`server failed with error ${err}`);
  } else {
    await connectDB();
    console.log(`server is running at http://localhost:${port}`);
  }
});

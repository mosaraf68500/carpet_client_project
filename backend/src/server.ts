import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./common/config/db.js";

const PORT = process.env.PORT || 5000;

async function start(): Promise<void> {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start();

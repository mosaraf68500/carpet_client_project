import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./common/config/db.js";

const PORT = process.env.PORT || 8000;

// Fail fast if a required secret is missing, rather than starting up and
// only breaking (with an opaque error) the first time something needs it —
// e.g. JWT_SECRET being undefined would otherwise silently sign tokens with
// no secret until the first verify attempt fails.
const REQUIRED_ENV_VARS = ["MONGO_URI", "JWT_SECRET"] as const;

function assertRequiredEnv(): void {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(
      `Missing required environment variable(s): ${missing.join(", ")}. Set them in .env before starting the server.`
    );
    process.exit(1);
  }
}

async function start(): Promise<void> {
  assertRequiredEnv();
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start();

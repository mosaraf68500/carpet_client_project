import "dotenv/config";
import type { IncomingMessage, ServerResponse } from "node:http";

// This is the Vercel serverless entry point — separate from src/server.ts,
// which stays the entry for local dev / traditional (long-lived process)
// hosting. Deliberately importing the *compiled* output (../dist, produced
// by `npm run build` as this project's Vercel buildCommand) rather than
// ../src directly: it's the same artifact `npm start` already runs
// locally, and it sidesteps depending on Vercel's bundler to resolve this
// project's NodeNext-style ("./foo.js" pointing at "./foo.ts") imports —
// dist's imports already point at real, compiled .js files.
import app from "../dist/app.js";
import { connectDB } from "../dist/common/config/db.js";

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  await connectDB();
  app(req, res);
}

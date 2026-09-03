import mongoose from "mongoose";

// On Vercel, this module is re-evaluated on a cold start but kept in memory
// across invocations that reuse the same warm serverless instance — caching
// the in-flight connect() promise at module scope (rather than reconnecting
// every request) is what keeps a bursty function from opening a new MongoDB
// connection per invocation and blowing through Atlas's connection limit.
let connectionPromise: ReturnType<typeof mongoose.connect> | null = null;

export async function connectDB(): Promise<void> {
  // Already connected from a prior invocation on this warm instance.
  if (mongoose.connection.readyState === 1) return;

  if (!connectionPromise) {
    // Auto-building indexes on every connect is fine for dev iteration but
    // costs performance on a populated production collection; index changes
    // there should go through an explicit migration instead.
    connectionPromise = mongoose.connect(process.env.MONGO_URI as string, {
      autoIndex: process.env.NODE_ENV !== "production",
    });
  }

  try {
    const conn = await connectionPromise;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    // Let the next invocation try again instead of being stuck reusing a
    // rejected promise forever.
    connectionPromise = null;
    console.error(`MongoDB connection failed: ${(err as Error).message}`);
    // Running as a long-lived process (local dev, traditional hosting):
    // fail fast, there's no request to fail gracefully instead.
    // Running as a Vercel function: exiting would just crash the
    // container — throw instead so the request handler can return a 500.
    if (process.env.VERCEL !== "1") process.exit(1);
    throw err;
  }

  if (mongoose.connection.listenerCount("disconnected") === 0) {
    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });
  }
}

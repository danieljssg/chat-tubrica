import mongoose from "mongoose";

const { MONGO_URI, MONGO_DB_NAME, MONGO_CFG } = process.env;

if (!MONGO_URI) {
  // MONGO_URI es esencial. MONGO_CFG puede ser opcional.
  throw new Error(
    "Please define the MONGO_URI environment variable. MONGO_DB_NAME (e.g., 'hr_saas') and MONGO_CFG (e.g., '?retryWrites=true&w=majority', optional) are also used."
  );
}

// Caché global para mantener la conexión entre recargas en caliente en desarrollo.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log("Using cached MongoDB connection.");
    return cached.conn;
  }

  if (!cached.promise) {
    const dbName = MONGO_DB_NAME || "test_chat";
    const mongoUriEndsWithSlash = MONGO_URI.endsWith("/");
    const separator = mongoUriEndsWithSlash ? "" : "/";

    const connectionString = `${MONGO_URI}${separator}${dbName}${
      MONGO_CFG || ""
    }`;

    console.log(
      "Attempting to connect to MongoDB:",
      connectionString.replace(/:([^:@\s]+)@/, ":****@")
    );

    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(connectionString, opts)
      .then((mongooseInstance) => {
        console.log("MongoDB connection promise resolved.");
        return mongooseInstance;
      });
  }

  try {
    console.log("Awaiting MongoDB connection promise.");
    cached.conn = await cached.promise;
  } catch (e) {
    console.error("MongoDB connection error:", e);
    cached.promise = null;
    throw e;
  }
  console.log("MongoDB connected successfully.");
  return cached.conn;
}

export default connectDB;

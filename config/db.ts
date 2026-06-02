// backend/src/config/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Direct Connection to MongoDB Database Instance
 * Uses Mongoose schema compiler mappings and logs errors gracefully.
 */
export const connectDB = async (): Promise<typeof mongoose | null> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error(
      "[Database Severe Error]: MONGO_URI environment variable is not defined in .env"
    );
    console.warn("[Database Suggestion]: Please configure your MongoDB credentials to enable persistence.");
    return null;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      autoIndex: true, // Auto-build schema indexes for fast search mappings
    });
    console.log(`[Database Connection Success]: Connected securely to MongoDB Host: ${conn.connection.host}`);
    return conn;
  } catch (error: any) {
    console.error(`[Database Local Connection Exception]: ${error.message || error}`);
    console.warn("[Database Suggestion]: The database server could be unreachable. Server will shut down.");
    process.exit(1);
  }
};

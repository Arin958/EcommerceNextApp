import mongoose from "mongoose";
import configEnv from "./config";

let isConnected = false; // <-- cache

const connectDB = async () => {
  if (isConnected) {
    // Already connected, skip reconnection
    return;
  }

  try {
    console.log("🟡 Connecting to MongoDB...");

    const db = await mongoose.connect(configEnv.env.mongodb.uri);

    isConnected = db.connections[0].readyState === 1;

    console.log("🔵 MongoDB Connected:", isConnected);

  } catch (error) {
    console.error("❗Error connecting to MongoDB:", error);
  }
};

export default connectDB;

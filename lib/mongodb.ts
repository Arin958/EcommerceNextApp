import mongoose from "mongoose";
import configEnv from "./config";

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(configEnv.env.mongodb.uri);

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectDB;
import mongoose from "mongoose";
import configEnv from "./config";

const connectDB = async () => {
  console.log("🟡 Connecting to MongoDB...");

  try {
    console.log("Mongo URI:", configEnv.env.mongodb.uri);

    await mongoose.connect(configEnv.env.mongodb.uri);

    console.log("🔵 Connection ReadyState:", mongoose.connection.readyState);
    
    mongoose.connection.on("connected", () => {
      console.log("✅ Mongoose connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Mongoose Error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ Mongoose disconnected");
    });

  } catch (error) {
    console.error("❗Error connecting to MongoDB:", error);
  }
};

export default connectDB;

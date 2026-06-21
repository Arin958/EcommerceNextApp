import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  username: { type: String },
  email: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  lastActivity: { type: Date, default: Date.now },
}, {
  timestamps: true
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
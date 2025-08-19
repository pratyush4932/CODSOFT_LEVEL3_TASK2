import mongoose from "mongoose";
import ProjectSchema from "./ProjectSchema.js";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
  },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  projects: [ProjectSchema],
});

export default mongoose.model("User", UserSchema);

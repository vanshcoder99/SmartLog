import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  refreshToken: {
    type: String,
  },
});

export const User = mongoose.model("User", userSchema);

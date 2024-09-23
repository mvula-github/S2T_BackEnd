import mongoose, { mongo, Types } from "mongoose";

const UserSchema = new mongoose.Schema({
  fName: { type: String, required: true, unique: false },
  lName: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  cPassword: { type: String, required: true, unique: true },
  affiliation: { type: String, required: false, unique: false, default: null },
  credentials: { type: String, required: false, unique: false, default: null },
  role: { type: String, required: true, unique: false, default: "eductor" },
});

export const User = mongoose.model("User", UserSchema);

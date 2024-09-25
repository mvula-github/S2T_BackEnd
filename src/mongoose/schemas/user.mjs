import mongoose, { mongo, Types } from "mongoose";
import {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
} from "../../utils/classes/errors.mjs";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  fName: { type: String, required: true, unique: false },
  lName: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  affiliation: { type: String, required: false, unique: false, default: null },
  credentials: { type: String, required: false, unique: false, default: null },
  role: { type: String, required: false, unique: false, default: "educator" },
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.statics.signup = async function (email, data) {
  const user = await this.findOne({ email }); //find user in the database
  //To check if user already exists
  if (user) throw new ValidationError("Email already exists");

  const newUser = this(data);
  await newUser.save();

  return newUser;
};

UserSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email }); //find user in the database

  if (!user) throw new NotFoundError("Provided email not found");

  const auth = await bcrypt.compare(password, user.password);

  //password validation handling
  if (!auth) throw new ValidationError("Incorrect Password");

  return user;
};

export const User = mongoose.model("User", UserSchema);

import mongoose, { mongo, Types } from "mongoose";
import {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
} from "../../utils/classes/errors.mjs";
import bcrypt from "bcrypt";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
  fName: { type: String, required: true, unique: false },
  lName: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  affiliation: { type: String, required: false, unique: false, default: null },
  credentials: { type: String, required: false, unique: false, default: null },
  role: { type: String, required: false, unique: false, default: "educator" },
  passwordResetToken: String,
  passwordTokenExpire: Date,
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.statics.signup = async function (email, data) {
  const user = await this.findOne({ email }); //find user in the database

  if (user) throw new ValidationError("Provided email already exists");

  const newUser = this(data);
  await newUser.save();
  return newUser;
};

UserSchema.statics.login = async function (email, password) {
  console.log(email);
  const user = await this.findOne({ email }); //find user in the database

  if (!user) throw new NotFoundError("Provided email not found");

  const auth = await bcrypt.compare(password, user.password);

  //password validation handling
  if (!auth) throw new ValidationError("Incorrect Password");

  return user;
};

UserSchema.methods.resetPasswordToken = function () {
  //generating token to send to the user
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordTokenExpire = Date.now() + 10 * 60 * 1000; //time in miliseconds

  console.log(resetToken, this.passwordResetToken);

  //give user the resetToken
  return resetToken;
};

export const User = mongoose.model("User", UserSchema);

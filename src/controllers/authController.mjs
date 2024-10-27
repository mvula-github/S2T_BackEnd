import { validationResult, matchedData } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../mongoose/schemas/user.mjs";
import { requireAuth } from "../utils/middleware/middleware.mjs";
import { NotFoundError, ValidationError } from "../utils/classes/errors.mjs";
import sendEmail from "../utils/email.mjs";
import { console } from "inspector";

//creating the jwt token
const maxDuration = 2 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "secret signature", {
    expiresIn: maxDuration,
  });
};

export const userSignUp = async (request, response) => {
  //handling the validation results if they are present
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).send(errors.array().map((err) => err.msg));

  const { password, cPassword, email } = request.body;

  //verifying if confirmation password matches password
  if (cPassword !== password)
    return response.status(400).send("Passwords do not match");

  //declaring the new users with only valid data

  const data = matchedData(request);

  //Saving user to the database
  try {
    //saving user to database
    const savedUser = await User.signup(email, data);

    //creating jwt token and cookie
    const token = createToken(savedUser._id);

    response.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxDuration * 1000,
    });
    return response.status(201).send(`Account created succesfully`);
  } catch (err) {
    response.status(500).send(`${err}`);
  }
};

export const userLogin = async (request, response) => {
  const {
    body: { email, password },
  } = request;

  try {
    //validation to check if user exits
    const user = await User.login(email, password);

    //creating jwt for user
    const token = createToken(user._id);
    response.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxDuration * 1000,
    });

    response.status(200).send("Loggin Successful");
  } catch (err) {
    response.status(400).send(`${err}`);
  }
};

export const userLogout = (request, response) => {
  if (!requireAuth) return response.status(401).send("User did not log in");

  response.cookie("jwt", "", { maxAge: 1 });
  response.status(200).send("User logged out");
};

export const userForgotPassword = async (request, response, next) => {
  try {
    const { email } = request.body;
    //get user based on email
    console.log(email);
    const theUser = await User.findOne({ email });

    if (!theUser) throw new NotFoundError("User email not found");

    //genneraete random token
    const resetToken = theUser.resetPasswordToken();

    await theUser.save({ validateBeforeSave: false });
    //send token to user via email
    const resetURL = `${request.protocol}://${request.get(
      "host"
    )}//api/v1/users.resetPassword/${resetToken}`;

    const theMessage = `Please use the link below to reset your password\n\n${resetURL}\n\nThis reset password link is valid for only 10 minutes`;

    try {
      await sendEmail({
        email: theUser.email,
        subject: `Password change request recieved`,
        message: theMessage,
      });

      response.status().send("password reset link is send to the user email");
    } catch (error) {
      theUser.passwordResetToken = undefined;
      theUser.passwordTokenExpire = undefined;
      theUser.save({ validateBeforeSave: false });
      console.log(error);
      return next(`There was an error with sending the email`);
    }
    response.send("check email for verification");
  } catch (err) {
    next(`${err}`);
  }
};

export const userStatus = (request, response) => {
  return response.locals.user
    ? response.status(200).send(response.locals.user.id)
    : response.status(401).send(" User Not Authenticated");
};

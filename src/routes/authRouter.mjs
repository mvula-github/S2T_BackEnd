import express, { Router } from "express";
import { User } from "../mongoose/schemas/user.mjs";
import { validationResult, matchedData, checkSchema } from "express-validator";
import { addUserValidation } from "../utils/validation/usersValidation.mjs";
import jwt from "jsonwebtoken";
import { requireAuth } from "../utils/middleware/middleware.mjs";
import sendEmail from "../utils/email.mjs";
import {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
} from "../utils/classes/errors.mjs";

const app = Router();

app.use(express.json());

const maxDuration = 2 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "secret signature", {
    expiresIn: maxDuration,
  });
};

//To Display to signup page
app.get("/api/auth/signup", (request, response) => {
  response.render("SignUp Page");
});

//To display the Log in page
app.get("api/auth/login", (request, response) => {
  response.render("Log In");
});

//FOR WHEN USERS CREATE A NEW ACCOUNT
app.post(
  "/api/auth/signup",
  checkSchema(addUserValidation),
  async (request, response) => {
    //handling the validation results if they are present
    const errors = validationResult(request);
    if (!errors.isEmpty())
      return response.status(400).send(errors.array().map((err) => err.msg));

    const { password, cPassword, email } = request;

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
      console.log(err);
      return response.status(400).send(`${err}`);
    }
  }
);

//USER LOGIN REQUEST
app.post("/api/auth/login", async (request, response) => {
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
});

//USER LOGOUT REQUEST
app.post("/api/auth/logout", requireAuth, (request, response) => {
  if (!requireAuth) return response.status(401).send("User did not log in");

  response.cookie("jwt", "", { maxAge: 1 });
  response.redirect("/");
});

//TO CHECK IF USER IS LOG IN STATUS
app.get("/api/auth/status", requireAuth, (request, response) => {
  console.log("This is the status endpoint ");
  console.log(request.user);
  console.log(request.session);

  return request.user
    ? response.status(200).send(request.user)
    : response.status(401).send(" User Not Authenticated");
});

app.post("/api/auth/forgotPassword", async (request, response, next) => {
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
});

app.patch(
  "/api/auth/resetPassword/:token",
  async (request, response, next) => {}
);

export default app;

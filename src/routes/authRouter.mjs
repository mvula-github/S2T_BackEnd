import express, { Router } from "express";
import { User } from "../mongoose/schemas/user.mjs";
import { validationResult, matchedData, checkSchema } from "express-validator";
import { addUserValidation } from "../utils/validation/usersValidation.mjs";
import passport from "passport";
import "../strategies/local-strategy.mjs";

const app = Router();

app.use(express.json());

//FOR WHEN USERS CREATE A NEW ACCOUNT
app.post(
  "/api/auth/signup",
  checkSchema(addUserValidation),
  async (request, response) => {
    //handling the validation results if they are present
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(400).send(errors.array());

    const {
      body: { password, cPassword, email },
    } = request;

    //verifying if confirmation password matches password
    if (cPassword !== password)
      return response.status(400).send("Passwords do not match");

    //To check if user already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return response.status(400).send("Email already exists");
    }

    //declaring the new users with only valid data
    const data = matchedData(request);
    const newUser = User(data);
    console.log(newUser);

    //Saving user to the database
    try {
      const savedUser = await newUser.save();
      request.session.user = {
        id: savedUser.id,
        username: savedUser.email,
        role: savedUser.role,
      };
      return response.status(201).send(savedUser);
    } catch (err) {
      console.log(err);
      return response.sendStatus(400);
    }
  }
);

//USER LOGIN REQUEST
app.post(
  "/api/auth/login",
  passport.authenticate("local"),
  async (request, response) => {
    const {
      body: { email },
    } = request;
    try {
      const findUser = await User.findOne({ email });

      request.session.user = {
        id: findUser.id,
        username: findUser.email,
        role: findUser.role,
      };
      console.log(request.session.user);
      response.status(200).send("Loggin Successful");
    } catch (err) {
      response.status(500).send(`Error: ${err}`);
    }
  }
);

//USER LOGOUT REQUEST
app.post("/api/auth/logout", (request, response) => {
  if (!request.user) return response.sendStatus(401);

  request.logout((err) => {
    if (err) return response.sendStatus(400);
    response.status(200).send("Logged Out Succesfully");
  });
});

//TO CHECK IF USER IS LOG IN STATUS
app.get("/api/auth/status", (request, response) => {
  console.log("This is the status endpoint ");
  console.log(request.user);
  console.log(request.session);

  return request.user
    ? response.status(200).send(request.user)
    : response.status(401).send(" User Not Authenticated");
});

export default app;
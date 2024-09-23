import express, { request, response, Router } from "express";
import { User } from "../mongoose/schemas/user.mjs";
import {
  query,
  body,
  validationResult,
  matchedData,
  checkSchema,
} from "express-validator";
import {
  addUserValidation,
  updateUserValidation,
} from "../utils/validation/usersValidation.mjs";
import passport from "passport";
import "../strategies/local-strategy.mjs";

const app = Router();

app.use(express.json());

//----------------------------------------POST------------------------------------
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

    try {
      const savedUser = await newUser.save();

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

      request.session.user = { id: findUser.id, username: findUser.email };
      response.status(200).send("Loggin Successful");
    } catch (err) {
      response.status(500).send(`Error: ${err}`);
    }
  }
);

app.post("/api/auth/logout", (request, response) => {
  if (!request.user) return response.sendStatus(401);

  request.logout((err) => {
    if (err) return response.sendStatus(400);
    response.send(200);
  });
});

app.get("/api/auth/status", (request, response) => {
  console.log("This is the status endpoint ");
  console.log(request.user);
  console.log(request.session);

  return request.user
    ? response.status(200).send(request.user)
    : response.status(401).send(" User Not Authenticated");
});

//-----------------------GET-----------------------------
//to view all users in the database
app.get("/api/users", async (request, response) => {
  if (request.session.user) {
    try {
      const allUsers = await User.find();

      //display all users
      response.status(200).send(allUsers);
    } catch (err) {
      return response
        .status(500)
        .send(`Failed to retrieve all users, Error:${err}`);
    }
  } else {
    response.status(401).send("User not logged in");
  }
});

//FOR WHEN ADMIN WANTS TO VIEW SPECIFIC USERS BY ROLE OR CREDENTIALS
//to find users based in a filter query
app.get("/api/users", (request, response) => {
  console.log(request.query); //to view query values in cmd

  //const { filter, value } = request.query;

  //if (!filter && !value) return response.send(userList);

  //const filteredUsers = userList.filter((user) => user[filter].includes(value));

  return response.send(filteredUsers);
});

//----------------------------------PATCH--------------------------------------

//WHEN USER OR ADMIN WANTS TO UPDATE CERTAIN

export default app;

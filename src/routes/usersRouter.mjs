import express, { response, Router } from "express";
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
    console.log(data);

    const newUser = User(data);

    try {
      const savedUser = await newUser.save();

      return response.status(200).send(savedUser);
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
  (request, response) => {
    /*const {
      body: { fName, password },
    } = request;

    const findUser = userList.find((user) => user.fName === fName);

    if (!findUser) return response.status(401).send({ msg: "Bad Credentials" });

    request.session.user = findUser;
    return response.status(200).send(findUser);*/
    response.status(200).send("Loggin Successful");
  }
);

app.get("/api/auth/status", (req, res) => {
  console.log("This is the status endpoint ");
  req.sessionStore.get(req.sessionID, (err, session) => {
    console.log(session);
  });

  return req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(401).send({ msg: "Not Authenticated" });
});

//-----------------------GET-----------------------------
//to view all users in the database
app.get("/api/users", (request, response) => {
  return response.send(userList);
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

import express, { Router } from "express";
import { User } from "../mongoose/schemas/user.mjs";
import { validationResult, matchedData, checkSchema } from "express-validator";
import { addUserValidation } from "../utils/validation/usersValidation.mjs";
import jwt from "jsonwebtoken";

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
      const token = createToken(savedUser._id);
      response.cookie("jwt", token, {
        httpOnly: true,
        maxAge: maxDuration * 1000,
      });
      //   request.session.user = {
      //     id: savedUser.id,
      //     username: savedUser.email,
      //     role: savedUser.role,
      //   };
      return response.status(201).send({ user: savedUser.id });
    } catch (err) {
      console.log(err);
      return response.sendStatus(400);
    }
  }
);

//USER LOGIN REQUEST
app.post("/api/auth/login", async (request, response) => {
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
});

//USER LOGOUT REQUEST
app.post("/api/auth/logout", (request, response) => {
  if (!request.user) return response.status(401).send("User did not log in");

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

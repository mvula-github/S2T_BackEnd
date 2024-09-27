import express, { request, response, Router } from "express";
import { User } from "../mongoose/schemas/user.mjs";
import { validationResult, matchedData, checkSchema } from "express-validator";
import {
  addUserValidation,
  updateUserValidation,
} from "../utils/validation/usersValidation.mjs";
import {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
} from "../utils/classes/errors.mjs";
import { requireAuth } from "../utils/middleware/middleware.mjs";
import { getAllUsers } from "../controllers/usershandler.mjs";

const app = Router();

app.use(express.json());

//----------------------------------------GET--------------------------------------------
//to view all users in the database
app.get("/api/users", requireAuth, getAllUsers);

//FOR WHEN ADMIN WANTS TO VIEW SPECIFIC USERS BY ROLE OR CREDENTIALS
//to find users based in a filter query

//TO RETRIEVE A SPECIFIC USER BY ID
app.get("/api/users/:id", async (request, response, next) => {
  try {
    if (!request.session.user)
      throw new UnauthorizedError("User not logged in"); //verify if user is logged in

    const {
      params: { id },
    } = request;

    const theUser = await User.findById(id);
    if (!theUser) throw new NotFoundError("User not found");

    response.status(200).send(theUser);
  } catch (err) {
    next(`${err} `);
  }
});

//----------------------------------PATCH--------------------------------------

//WHEN USER OR ADMIN WANTS TO UPDATE CERTAIN
app.patch(
  "/api/users/:id",
  checkSchema(updateUserValidation),
  async (request, response, next) => {
    try {
      if (!request.session.user)
        throw new UnauthorizedError("User not logged in"); //verify if user is logged in

      //handle the validations i.e. doesn't add invalid data to database
      if (!errors.isEmpty())
        return response.status(400).send({ error: errors.array() });

      //To know if the data is valid or not
      const {
        params: { id },
      } = request;

      //extracting and storing only valid data
      const data = matchedData(request);
      const updatedUser = await User.findByIdAndUpdate(id, data);

      if (!updatedUser) throw new NotFoundError("User not found");

      response.status(201).send("User updated successlly");
    } catch (err) {
      next(`${err} `);
    }
  }
);

//-------------------------------------------PUT--------------------------------------------

app.put(
  "/api/users/:id",
  checkSchema(addUserValidation),
  async (request, response, next) => {
    try {
      if (!request.session.user)
        throw new UnauthorizedError("User not logged in"); //verify if user is logged in

      //handle the validations i.e. doesn't add invalid data to database
      if (!errors.isEmpty())
        return response.status(400).send({ error: errors.array() });

      //To know if the data is valid or not
      const {
        params: { id },
      } = request;

      //extracting and storing only valid data
      const data = matchedData(request);
      const updatedUser = await User.findByIdAndUpdate(id, data);

      if (!updatedUser) throw new NotFoundError("User not found");

      response.status(201).send("User updated successlly");
    } catch (err) {
      next(`${err} `);
    }
  }
);

//-------------------------------------------DELETE--------------------------------------------

app.delete("/api/users/:id", async (request, response, next) => {
  //handle the validations

  try {
    if (!request.session.user)
      throw new UnauthorizedError("User not logged in"); //verify if user is logged in

    const errors = validationResult(request);
    //handle the validations
    if (!errors.isEmpty())
      return response.status(400).send({ error: errors.array() });

    const {
      params: { id },
    } = request;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) throw new NotFoundError("User not found");

    response.status(200).send("User removed successfully");
  } catch (err) {
    next(`${err} `);
  }
});

export default app;

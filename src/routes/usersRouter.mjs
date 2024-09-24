import express, { request, response, Router } from "express";
import { User } from "../mongoose/schemas/user.mjs";
import { validationResult, matchedData, checkSchema } from "express-validator";
import {
  addUserValidation,
  updateUserValidation,
} from "../utils/validation/usersValidation.mjs";

const app = Router();

app.use(express.json());

//----------------------------------------GET--------------------------------------------
//to view all users in the database
app.get("/api/users", async (request, response) => {
  if (request.session.user) {
    //verify if user is logged in
    try {
      const allUsers = await User.find();

      //display all users
      response.status(200).send(allUsers);
    } catch (err) {
      //error handling
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

//TO RETRIEVE A SPECIFIC USER BY ID
app.get("/api/users/:id", async (request, response) => {
  if (request.session.user) {
    //verify user
    const {
      params: { id },
    } = request;

    try {
      const theUser = await User.findById(id);
      if (!theUser) return response.status(404).send("User not found");

      response.status(200).send(theUser);
    } catch (err) {
      response.status().send(`Failed to retrieved the user: ${err}`);
    }
  } else {
    response.status(401).send("User not logged in");
  }
});

//----------------------------------PATCH--------------------------------------

//WHEN USER OR ADMIN WANTS TO UPDATE CERTAIN
app.patch(
  "/api/users/:id",
  checkSchema(updateUserValidation),
  async (request, response) => {
    if (request.session.user) {
      const errors = validationResult(request);

      //handle the validations i.e. doesn't add invalid data to database
      if (!errors.isEmpty())
        return response.status(400).send({ error: errors.array() });

      //To know if the data is valid or not
      const {
        params: { id },
      } = request;

      //extracting and storing only valid data
      const data = matchedData(request);
      try {
        const updatedUser = await User.findByIdAndUpdate(id, data);

        if (!updatedUser) return response.status(404).send("User not found");

        response.status(201).send("User updated successlly");
      } catch (err) {
        return response.status(500).send(`Failed to update the user: ${err}`);
      }
    } else {
      response.status(401).send("User not logged in");
    }
  }
);

//-------------------------------------------PUT--------------------------------------------

app.put(
  "/api/users/:id",
  checkSchema(addUserValidation),
  async (request, response) => {
    if (request.session.user) {
      const errors = validationResult(request);

      //handle the validations
      if (!errors.isEmpty())
        return response.status(400).send({ error: errors.array() });

      //To know if the data is valid or not
      const {
        params: { id },
      } = request;

      //extracting and storing only valid data
      const data = matchedData(request);

      try {
        const updatedUser = await User.findByIdAndUpdate(id, data);

        if (!updatedUser) return response.status(404).send("User not found");

        response.status(201).send("User updated successlly");
      } catch (err) {
        return response.status(500).send(`Failed to update the user: ${err}`);
      }
    } else {
      response.status(401).send("User not logged in");
    }
  }
);

//-------------------------------------------DELETE--------------------------------------------

app.delete("/api/users/:id", async (request, response) => {
  if (request.session.user) {
    const errors = validationResult(request);

    //handle the validations
    if (!errors.isEmpty())
      return response.status(400).send({ error: errors.array() });

    const {
      params: { id },
    } = request;

    try {
      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) return response.status(404).send("User not found");

      response.status(200).send("User removed successfully");
    } catch (err) {
      return response.status(500).send(`Failed to remove User: ${err}`);
    }
  } else {
    response.status(401).send("User not logged in");
  }
});
export default app;

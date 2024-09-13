import express, { response, Router } from "express";
import { userList } from "./../utils/USERS/usersData.mjs";

const app = Router();

const findUserIndex = (request, response, next) => {
  const {
    body,
    params: { id },
  } = request;

  const parsedId = parseInt(id);
  if (isNaN(parsedId))
    return response.status(400).send("Bad request. Invalid value");

  const userIndex = userList.findIndex((user) => user.id === parsedId);
  if (userIndex === -1) return response.status(404).send("User was not found");

  request.userIndex = userIndex;
  next();
};

//----------------------------------------POST------------------------------------
//FOR WHEN USERS CREATE A NEW ACCOUNT
app.post("/api/users", (request, response) => {
  const { body } = request;

  const newUser = { id: userList[userList.length - 1].id + 1, ...body };
  userList.push(newUser);

  return response.status(200).send("New User Added Succesfully");
});

//---------------------------------------GET-----------------------------
//to view all users in the database
app.get("/api/users", (request, response) => {
  return response.send(userList);
});

export default app;

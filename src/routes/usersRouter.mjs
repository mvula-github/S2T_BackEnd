import express, { response, Router } from "express";
import { userList } from "./../utils/USERS/usersData.mjs";

const app = Router();

app.use(express.json());

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
app.post("/api/auth/signup", (request, response) => {
  const {
    body: { password, cPassword, email },
  } = request;

  //console.log(`Password: ${password}, cPassword: ${cPassword}`);

  if (password !== cPassword)
    return response.status(400).send("Passwords do not match");

  const userExists = userList.some((user) => user.email === email);

  //To check if user already exists
  if (userExists) {
    return response.status(400).send("Email already exists");
  }

  //add code to check if email already exits

  const newUser = {
    id: userList[userList.length - 1].id + 1,
    ...body,
  };
  userList.push(newUser);

  return response.status(200).send("New User Added Succesfully");
});

//---------------------------------------GET-----------------------------
//to view all users in the database
app.get("/api/users", (request, response) => {
  return response.send(userList);
});

//FOR WHEN USERS WANTS TO SIGN IN
//to view or find a specific user in database
app.get("/api/auth/login", findUserIndex, (request, response) => {
  const { userIndex } = request;

  const findUser = userList[userIndex];
  if (!findUser) return response.sendStatus(404);

  return response.status(200).send(findUser);
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

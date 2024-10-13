import { User } from "../mongoose/schemas/user.mjs";
import { requireAuth } from "../utils/middleware/middleware.mjs";
import { validationResult, matchedData } from "express-validator";
import { NotFoundError, UnauthorizedError } from "../utils/classes/errors.mjs";

//TO VIEW ALL USERS IN THE DATABASE
export const getAllUsers = async (request, response, next) => {
  //if (!requireAuth) throw new UnauthorizedError("User not logged in"); //verify if user is logged in

  try {
    const allUsers = await User.find();

    if (!allUsers || allUsers.length === 0)
      throw new NotFoundError("No users are found");

    return response.status(200).send(allUsers);
    next();
  } catch (err) {
    return response.status(404).send(err);
  }
};

//TO RETRIEVE A SPECIFIC USER BY ID
export const getUserById = async (request, response, next) => {
  if (!requireAuth) throw new UnauthorizedError("User not logged in"); //verify if user is logged in

  const {
    params: { id },
  } = request;

  try {
    const theUser = await User.findById(id);
    if (!theUser) throw new NotFoundError("User not found in database");

    response.status(200).send(theUser);
    next();
  } catch (err) {
    return response.status(404).send(`${err} `);
  }
};

//WHEN ADMIN WANTS TO UPDATE A CERTAIN USER
export const updateUserById = async (request, response, next) => {
  if (!requireAuth) throw new UnauthorizedError("User not logged in"); //verify if user is logged in

  //handle the validations i.e. doesn't add invalid data to database
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).send(errors.array().map((err) => err.msg));
  //console.log({ error: errors.array() }); To nvaigate the error precisely

  //To know if the data is valid or not
  const {
    params: { id },
  } = request;

  try {
    //extracting and storing only valid data
    const data = matchedData(request);
    const updatedUser = await User.findByIdAndUpdate(id, data);

    if (!updatedUser) throw new NotFoundError("User not found");

    response.status(201).send("User updated successlly");
  } catch (err) {
    next(`${err} `);
  }
};

//WHEN ADMIN WANTS TO REMOVED A USER OR USER DELETES AN ACCOUNT
export const deleteUserById = async (request, response, next) => {
  try {
    if (!requireAuth) throw new UnauthorizedError("User not logged in"); //verify if user is logged in

    const errors = validationResult(request);
    //handle the validations
    if (!errors.isEmpty())
      return response.status(400).send(errors.array().map((err) => err.msg));

    //console.log({ error: errors.array() }); To nvaigate the error precisely

    const {
      params: { id },
    } = request;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) throw new NotFoundError("User not found");

    response.status(200).send("User removed successfully");
  } catch (err) {
    next(`${err} `);
  }
};

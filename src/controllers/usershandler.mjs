import { User } from "../mongoose/schemas/user.mjs";
import { requireAuth } from "../utils/middleware/middleware.mjs";
import { validationResult, matchedData } from "express-validator";

//TO VIEW ALL USERS IN THE DATABASE
export const getAllUsers = async (request, response) => {
  if (!requireAuth) return response.status(401).send("User not logged in"); //verify if user is logged in

  try {
    const allUsers = await User.find();

    if (!allUsers || allUsers.length === null)
      return response.status(404).send("No users are found");

    return response.status(200).send(allUsers);
  } catch (err) {
    return response.status(500).send("Internal server error" + err);
  }
};

//TO RETRIEVE A SPECIFIC USER BY ID
export const getUserById = async (request, response) => {
  if (!requireAuth) return response.status(401).send("User not logged in"); //verify if user is logged in

  const {
    params: { _id },
  } = request;

  try {
    const theUser = await User.findById(_id);

    if (!theUser || theUser.length === 0)
      return response.status(404).send("User not found");

    response.status(200).send(theUser);
  } catch (err) {
    return response.status(500).send("Internal server error" + err);
  }
};

//WHEN ADMIN WANTS TO UPDATE A CERTAIN USER
export const updateUserById = async (request, response) => {
  if (!requireAuth) return response.status(401).send("User not logged in"); //verify if user is logged in

  //handle the validations i.e. doesn't add invalid data to database
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).send(errors.array().map((err) => err.msg));
  //console.log({ error: errors.array() }); To nvaigate the error precisely

  //To know if the data is valid or not
  const {
    params: { _id },
  } = request;

  try {
    //extracting and storing only valid data
    const data = matchedData(request);
    const updatedUser = await User.findByIdAndUpdate(_id, data);

    if (!updatedUser || updatedUser === null)
      return response.status(404).send("User not found");

    response.status(201).send("User updated successlly");
  } catch (err) {
    return response.status(500).send("Internal server error" + err);
  }
};

//WHEN ADMIN WANTS TO REMOVED A USER OR USER DELETES AN ACCOUNT
export const deleteUserById = async (request, response) => {
  try {
    if (!requireAuth) return response.status(401).send("User not logged in"); //verify if user is logged in

    const errors = validationResult(request);
    //handle the validations
    if (!errors.isEmpty())
      return response.status(400).send(errors.array().map((err) => err.msg));

    //console.log({ error: errors.array() }); To nvaigate the error precisely

    const {
      params: { _id },
    } = request;

    const deletedUser = await User.findByIdAndDelete({ _id });

    if (!deletedUser) return response.status(404).send("User not found");

    response.status(200).send("User removed successfully");
  } catch (err) {
    return response.status(500).send("Internal server error" + err);
  }
};

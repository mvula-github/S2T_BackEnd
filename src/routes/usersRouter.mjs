import express, { Router } from "express";
import { checkSchema } from "express-validator";
import { updateUserValidation } from "../utils/validation/usersValidation.mjs";
import { requireAuth } from "../utils/middleware/middleware.mjs";
import {
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from "../controllers/usershandler.mjs";

const app = Router();

app.use(express.json());

//----------------------------------------GET--------------------------------------------
//to view all users in the database
app.get("/api/users", requireAuth, getAllUsers);

//FOR WHEN ADMIN WANTS TO VIEW SPECIFIC USERS BY ROLE OR CREDENTIALS
//to find users based in a filter query

//TO RETRIEVE A SPECIFIC USER BY ID
app.get("/api/users/:id", requireAuth, getUserById);

//----------------------------------UPDATE--------------------------------------

//WHEN USER OR ADMIN WANTS TO UPDATE CERTAIN
app.patch(
  "/api/users/:id",
  requireAuth,
  checkSchema(updateUserValidation),
  updateUserById
);

//-------------------------------------------DELETE--------------------------------------------

app.delete("/api/users/:id", requireAuth, deleteUserById);

export default app;

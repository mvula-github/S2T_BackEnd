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

const router = Router();

router.use(express.json());

//----------------------------------------GET--------------------------------------------
//TO VIEW ALL USERS IN THE DATABASE
router.get("/api/users", requireAuth, getAllUsers);

//FOR WHEN ADMIN WANTS TO VIEW SPECIFIC USERS BY ROLE OR CREDENTIALS
//to find users based in a filter query

//TO RETRIEVE A SPECIFIC USER BY ID
router.get("/api/users/:id", requireAuth, getUserById); //

//----------------------------------UPDATE----------------------------------------------

router.patch(
  "/api/users/:id",
  requireAuth,
  checkSchema(updateUserValidation),
  updateUserById
);

//-------------------------------------------DELETE--------------------------------------------

router.delete("/api/users/:id", requireAuth, deleteUserById);

export default router;

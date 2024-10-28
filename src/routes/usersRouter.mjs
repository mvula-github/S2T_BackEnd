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
router.get("/api/users", getAllUsers);

//TO RETRIEVE A SPECIFIC USER BY ID
router.get("/api/users/:_id", getUserById);

//----------------------------------UPDATE----------------------------------------------
router.patch(
  "/api/users/:_id",
  requireAuth(["admin"]),
  checkSchema(updateUserValidation),
  updateUserById
);

//-------------------------------------------DELETE--------------------------------------------
router.delete("/api/users/:_id", deleteUserById);

export default router;

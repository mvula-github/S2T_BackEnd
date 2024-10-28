import express, { Router } from "express";
import { checkSchema } from "express-validator";
import { addUserValidation } from "../utils/validation/usersValidation.mjs";
import { requireAuth } from "../utils/middleware/middleware.mjs";
import {
  userForgotPassword,
  userLogin,
  userLogout,
  userSignUp,
  userStatus,
} from "../controllers/authController.mjs";

const router = Router();

router.use(express.json());

//FOR WHEN USERS CREATE A NEW ACCOUNT
router.post("/api/auth/signup", checkSchema(addUserValidation), userSignUp);

//USER LOGIN REQUEST
router.post("/api/auth/login", userLogin);

//USER LOGOUT REQUEST
router.post("/api/auth/logout", userLogout);

//TO CHECK IF USER IS LOG IN STATUS
router.get("/api/auth/status", userStatus);

//for varification when euser forgot password
router.post("/api/auth/forgotPassword", userForgotPassword);

router.patch(
  "/api/auth/resetPassword/:token",
  async (request, response, next) => {}
);

export default router;

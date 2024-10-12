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

const app = Router();

app.use(express.json());

//To Display to signup page
app.get("/api/auth/signup", (request, response) => {
  response.render("SignUp Page");
});

//To display the Log in page
app.get("api/auth/login", (request, response) => {
  response.render("Log In");
});

//FOR WHEN USERS CREATE A NEW ACCOUNT
app.post("/api/auth/signup", checkSchema(addUserValidation), userSignUp);

//USER LOGIN REQUEST
app.post("/api/auth/login", userLogin);

//USER LOGOUT REQUEST
app.post("/api/auth/logout", requireAuth, userLogout);

//TO CHECK IF USER IS LOG IN STATUS
app.get("/api/auth/status", requireAuth, userStatus);

//for varification when euser forgot password
app.post("/api/auth/forgotPassword", userForgotPassword);

app.patch(
  "/api/auth/resetPassword/:token",
  async (request, response, next) => {}
);

export default app;

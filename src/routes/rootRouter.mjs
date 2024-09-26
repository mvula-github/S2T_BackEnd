import express, { Router } from "express";
import faqRouter from "./faqRouter.mjs";
import usersRouter from "./usersRouter.mjs";
import authRouter from "./authRouter.mjs";
import fileUploadRouter from "./fileUpload.mjs"; // Import the file upload route


const app = Router();
const rootRouter = express.Router();

// Include the file upload routes
rootRouter.use("/api", fileUploadRouter);  // Your upload route will be `/api/upload`
app.use(faqRouter, usersRouter, authRouter);

export default app;

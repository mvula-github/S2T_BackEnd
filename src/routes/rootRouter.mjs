import express, { Router } from "express";
import faqRouter from "./faqRouter.mjs";
import usersRouter from "./usersRouter.mjs";
import authRouter from "./authRouter.mjs";
import uploadRouter from "./files_routes/uploadRouter.mjs"; // Import the file upload route
import authorRouter from "./oer_routes/authorRouter.mjs";
import guideRouter from "./oer_routes/guideRouter.mjs";
import tutorialRouter from "./oer_routes/toturialRoutes.mjs";

const app = Router();
const rootRouter = express.Router();

// Include the file upload routes
//rootRouter.use("/api", uploadRouter); // Your upload route will be `/api/upload`
//app.use(uploadRouter, authorRouter, guideRouter, tutorialRouter);
app.use(faqRouter, usersRouter, authRouter, uploadRouter);

export default app;

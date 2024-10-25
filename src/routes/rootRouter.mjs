import express, { Router } from "express";
import faqRouter from "./faqRouter.mjs";
import usersRouter from "./usersRouter.mjs";
import authRouter from "./authRouter.mjs";
import uploadRouter from "./files_routes/uploadRouter.mjs"; // Import the file upload route
import authorRouter from "./oer_routes/authorRouter.mjs";
import guideRouter from "./oer_routes/guideRouter.mjs";
import tutorialRouter from "./oer_routes/toturialRoutes.mjs";
import ratingRouter from "./files_routes/ratingRouter.mjs";
import reportingRouter from "./files_routes/reportingRouter.mjs";
import subjectRouter from "./subjectRouter.mjs";

const router = Router();

router.use(
  faqRouter,
  usersRouter,
  authRouter,
  uploadRouter,
  ratingRouter,
  reportingRouter,
  authorRouter,
  guideRouter,
  tutorialRouter,
  subjectRouter
);

export default router;

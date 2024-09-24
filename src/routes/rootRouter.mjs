import express, { Router } from "express";
import faqRouter from "./faqRouter.mjs";
import usersRouter from "./usersRouter.mjs";

// Import OER routes
import tutorialRoutes from "./oer_routes/toturialRoutes.mjs";
import guideRoutes from "./oer_routes/guideRouter.mjs";
import authorRoutes from "./oer_routes/authorRouter.mjs";

const app = Router();

app.use(faqRouter, usersRouter, tutorialRoutes, guideRoutes, authorRoutes);

export default app;

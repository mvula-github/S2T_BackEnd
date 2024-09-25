import express, { Router } from "express";
import faqRouter from "./faqRouter.mjs";
import usersRouter from "./usersRouter.mjs";
import authRouter from "./authRouter.mjs";
import fileRouter from "./fileRouter.mjs";

const app = Router();

app.use(faqRouter, fileRouter, usersRouter, authRouter);

export default app;

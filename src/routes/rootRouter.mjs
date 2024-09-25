import express, { Router } from "express";
import faqRouter from "./faqRouter.mjs";
import usersRouter from "./usersRouter.mjs";
import authRouter from "./authRouter.mjs";

const app = Router();

app.use(faqRouter, usersRouter, authRouter);

export default app;

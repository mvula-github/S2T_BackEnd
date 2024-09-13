import express, { Router } from "express";
import faqRouter from "./faqRouter.mjs";
import usersRouter from "./usersRouter.mjs";

const app = Router();

app.use(faqRouter, usersRouter);

export default app;

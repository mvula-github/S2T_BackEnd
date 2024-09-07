import express, { Router } from "express";
import faqRouter from "./faqRouter.mjs";

const app = Router();

app.use(faqRouter);

export default app;

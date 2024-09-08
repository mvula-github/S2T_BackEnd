import express, { json, Router } from "express";
import rootRouter from "./routes/rootRouter.mjs";

//Initialize the express app
const app = express();

// Parsing JSON request bodies
app.use(express.json());

//route which contains all my other routes
app.use(rootRouter);

//starting the express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

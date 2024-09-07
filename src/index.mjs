import express, { json, Router } from "express";
import rootRouter from "./routes/rootRouter.mjs";

//This is to run the express app
const app = express();
const PORT = process.env.PORT || 5000;

//middleware which help in extrating request bodies from browser in json
app.use(express.json());
app.use(rootRouter);

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

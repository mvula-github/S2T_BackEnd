import express from "express";
import mongoose from "mongoose";
import { createApp } from "./createApp.mjs";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(`${process.env.CONNECTION_STRING}`) //`mongodb://${process.env.CONNECTON_STRING}
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(`Error: ${err}`));

// Initialize the express app
const app = createApp();
// Connect to MongoDB

// Start the express server
const PORT = process.env.PORT; //process.env.PORT;
app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

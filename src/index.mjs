import express, { json, response, Router } from "express";
import rootRouter from "./routes/rootRouter.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import "./strategies/local-strategy.mjs";

// Initialize the express app
const app = express();

//callling db functions
/*const { connectToDb, getDb } = require("./db");

//db connection
let db;
connectToDb((err) => {
  if (!err) {
    app.listen(PORT, () => {
      console.log(`Running on Port ${PORT}`);
    });
    db = getDb();
  }
});

*/

mongoose
  .connect("mongodb://localhost:27017/share2teach")
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(`Error: ${err}`));

// Middleware Setup
app.use(express.json()); // Parsing JSON request bodies
app.use(cookieParser()); // Parse cookies

app.use(
  session({
    secret: "secretPassword",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 }, //set cookie to 2 hour
  })
);

// Registering passport
app.use(passport.initialize());
app.use(passport.session());

// Root route which contains other routes
app.use(rootRouter);

// Simple route for testing
app.get("/", (request, response) => {
  response.status(403).send({ msg: "Hello World" });
});

// Starting the express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

import express, { json, response, Router } from "express";
import {
  sessionMiddleware,
  cookieMiddleware,
} from "./utils/middleware/sessionMiddleware.mjs";
import rootRouter from "./routes/rootRouter.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import "./strategies/local-strategy.mjs";

// Import OER routes
import tutorialRoutes from "./routes/tutorialRoutes.mjs";
import guideRoutes from "./routes/guideRoutes.mjs";
import authorRoutes from "./routes/authorRoutes.mjs";

// Initialize the express app
const app = express();

//callling db functions
const { connectToDb, getDb } = require("./db");

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

mongoose
  .connect("mongodb://localhost:34007/share2teach")
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
    cookie: { maxAge: 60000 * 60 * 5 }, // Set cookie to 5 hours
  })
);

// Registering passport
app.use(passport.initialize());
app.use(passport.session());

// Root route which contains other routes
app.use(rootRouter);

// Use OER routes for Tutorials, Guides, and Authors
app.use("/tutorials", tutorialRoutes);
app.use("/guides", guideRoutes);
app.use("/authors", authorRoutes);

// Authentication route
app.post("/api/auth", passport.authenticate("local"), (request, response) => {
  response.sendStatus(200);
});

// Simple route for testing
app.get("/", (request, response) => {
  response.status(403).send({ msg: "Hello World" });
});

// Starting the express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

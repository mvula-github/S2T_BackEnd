import express, { json, response, Router } from "express";
import rootRouter from "./routes/rootRouter.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import mongoose from "mongoose";
import { checkUser, requireAuth } from "./utils/middleware/middleware.mjs";

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

Jameela_dev

app.set("view engine", "ejs");

app.use(cookieParser());
 master
app.use(
  session({
    secret: "secretPassword",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2, secure: true, httpOnly: true }, //set cookie to 2 hour
  })
);

Jameela_dev
// Registering passport
app.use(passport.initialize());
app.use(passport.session());

app.use("*", checkUser);
app.get("/", (request, response) => {
  response.status(403).send({ msg: "Hello World" }); //this should render the landing page
});

app.get("/landing", requireAuth, (request, response) => {
  response.status(403).send({ msg: "privilaged page" }); //this should render the pages with higher access rights e.g educator/moderator/admin
});
master

// Root route which contains other routes
app.use(rootRouter);

Jameela_dev
// Simple route for testing
app.get("/", (request, response) => {
  response.status(403).send({ msg: "Hello World" });
});

// Starting the express server

//starting the express server
 master
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

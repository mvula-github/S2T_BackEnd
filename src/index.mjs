import express, { json, response, Router } from "express";
import rootRouter from "./routes/rootRouter.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import "./strategies/local-strategy.mjs";
//import { createApp } from "./createApp.mjs";


//Initialize the express app
const app = express();
//const app = createApp();


mongoose
  .connect("mongodb://localhost:27017/share2teach")
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(`Error: ${err}`));

// Parsing JSON request bodies
app.use(express.json());

app.set("view engine", "ejs");

app.use(cookieParser());
app.use(
  session({
    secret: "secretPassword",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2, secure: true, httpOnly: true }, //set cookie to 2 hour
  })
);

//registering passport
app.use(passport.initialize());
app.use(passport.session());

//route which contains all my other routes
app.use(rootRouter);

app.get("/", (request, response) => {
  response.status(403).send({ msg: "Hello World" }); //this should render the landing page
});

//starting the express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

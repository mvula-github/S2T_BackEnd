import express, { json, response, Router } from "express";
import rootRouter from "./routes/rootRouter.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import "./strategies/local-strategy.mjs";

//Initialize the express app
const app = express();

mongoose
  .connect("mongodb://localhost:27017/share2teach")
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(`Error: ${err}`));

// Parsing JSON request bodies
app.use(express.json());

app.use(cookieParser());
app.use(
  session({
    secret: "secretPassword",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 60000 * 60 }, //set cookie to 1 hour
  })
);

//registering passport
app.use(passport.initialize());
app.use(passport.session());

//route which contains all my other routes
app.use(rootRouter);

app.post("/api/auth", passport.authenticate("local"), (request, response) => {
  response.sendStatus(200);
});

app.get("/", (request, response) => {
  //recieving the cookie from the server but doing nothing with it
  console.log(request.session);
  console.log(request.session.id);
  request.session.visited = true;
  response.cookie("hello", "world", { maxAge: 60000 * 60 });
  response.status(403).send({ msg: "Hello World" });
});

//starting the express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

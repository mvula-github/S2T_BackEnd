import express, { json, Router } from "express";
import rootRouter from "./routes/rootRouter.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";

//Initialize the express app
const app = express();

// Parsing JSON request bodies
app.use(express.json());

app.use(cookieParser());
app.use(
  session({
    secret: "secretPassword",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 60000 * 60 },
  })
);

app.use(passport.initialize());
app.use(passport.session());
//route which contains all my other routes
app.use(rootRouter);

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

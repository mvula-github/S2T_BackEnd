import express, { json } from "express";
import rootRouter from "./routes/rootRouter.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import mongoose from "mongoose";
import { checkUser, requireAuth } from "./utils/middleware/middleware.mjs";

// Initialize the express app
const app = express();

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/share2teach")
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(`Error: ${err}`));

// Middleware Setup
app.use(express.json()); // Parsing JSON request bodies
app.use(cookieParser()); // Parse cookies

app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");

app.use(cookieParser());

app.use(
  session({
    secret: "secretPassword",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2, secure: true, httpOnly: true },
  })
);

// Serve static files from 'uploads' folder (for accessing uploaded files)
app.use("/uploads", express.static("uploads"));

// User authentication check
app.use("*", checkUser);

// Test routes
app.get("/", (req, res) => {
  res.status(403).send({ msg: "Hello World" });
});

app.get("/landing", requireAuth, (req, res) => {
  res.status(403).send({ msg: "privileged page" });
});

// Root route for other routes
app.use(rootRouter);

// Simple route for testing
app.get("/", (request, response) => {
  response.status(403).send({ msg: "Hello World" });
});

// Starting the express server

//starting the express server

// Start the express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

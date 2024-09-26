import express, { json } from "express";
import rootRouter from "./routes/rootRouter.mjs";
import fileUploadRouter from "./routes/fileUpload.mjs"; // Import file upload route
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
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");

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

// **Add the file upload route here**
app.use("/api/files", fileUploadRouter);  // File upload route

// Start the express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

import express from "express";
import rootRouter from "./routes/rootRouter.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { checkUser, requireAuth } from "./utils/middleware/middleware.mjs";
import dotenv from "dotenv";

export function createApp() {
  dotenv.config();

  const app = express();

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
    res.status(200).send({ msg: "Hello World" });
  });

  // Root route for other routes
  app.use(rootRouter);

  return app;
}

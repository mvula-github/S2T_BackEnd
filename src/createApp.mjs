import express from "express";
import rootRouter from "./routes/rootRouter.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { checkUser } from "./utils/middleware/middleware.mjs";
import dotenv from "dotenv";
import cors from "cors";

export function createApp() {
  dotenv.config();

  const app = express();
  app.use(cors({ credentials: true }));

  // Middleware Setup
  app.use(express.json()); // Parsing JSON request bodies
  app.use(cookieParser()); // Parse cookies
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
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "PUT, POST, GET, DELETE, PATCH, OPTIONS"
    );
    res.status(200).send({ msg: "Hello World" });
  });

  // Root route for other routes
  app.use(rootRouter);

  return app;
}

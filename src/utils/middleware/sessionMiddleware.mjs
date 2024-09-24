import session from "express-session";
import cookieParser from "cookie-parser";

// Session middleware
export const sessionMiddleware = session({
  secret: "secretPassword",
  saveUninitialized: false,
  resave: false,
  cookie: { maxAge: 60000 * 60 * 5 }, // 5 hours
});

// Cookie parser middleware
export const cookieMiddleware = cookieParser();

//export { sessionMiddleware, cookieMiddleware };

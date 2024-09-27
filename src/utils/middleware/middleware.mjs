import jwt from "jsonwebtoken";
import { User } from "../../mongoose/schemas/user.mjs";

// errorHandler.js
const errorHandler = async (err, request, response, next) => {
  console.error(err.stack);

  if (err.isOperational) {
    return response.status(err.statusCode).send({ error: err.message });
  }

  // For unhandled errors, return a generic message
  return response.status(500).send({ error: "An unexpected error occurred!" });

  next();
};

//AUTHENTICATION OF jwt

const requireAuth = (request, response, next) => {
  const token = request.cookies.jwt;

  //check if web token exist
  if (!token) return response.send("redirect user to login page");

  jwt.verify(token, "secret signature", (err, decodedToken) => {
    if (err) {
      console.log(err.message);
      return response.send("redirect user to login page");
    } else {
      console.log(decodedToken);
      next();
    }
  });
};

//check current user

const checkUser = (request, response, next) => {
  const token = request.cookies.jwt;

  //check if web token exist
  if (token) {
    jwt.verify(token, "secret signature", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        next();
      } else {
        console.log(decodedToken);
        let user = await User.findByI(decodedToken.id);
        response.locals.user = user; // injecting it to views for some get methods
        next();
      }
    });
  } else {
    response.locals.user = null;
    next();
  }
};

export { errorHandler, requireAuth, checkUser };

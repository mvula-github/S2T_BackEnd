import jwt from "jsonwebtoken";

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

export default errorHandler;

//AUTHENTICATION OF jwt

const requireAuth = (request, response, next) => {
  const token = request.cookies.jwt;

  //check if web token exist
  if (!token) return response.send("redirect user to login page");

  jwt.verify(token, "");
  next();
};

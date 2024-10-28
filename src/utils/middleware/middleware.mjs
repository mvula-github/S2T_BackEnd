import jwt from "jsonwebtoken";
import { User } from "../../mongoose/schemas/user.mjs";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

//AUTHENTICATION OF jwt
const requireAuth = (roles = []) => {
  return (request, response, next) => {
    const token = request.cookies.jwt;

    // Check if web token exists
    if (!token) return response.status(401).send("User needs to login");

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        return response.status(401).send("Redirect user to login page");
      } else {
        try {
          const user = await User.findById(decodedToken.id);
          if (!user) return response.status(401).send("User not found");

          // Check if user's role is allowed
          if (roles.length && !roles.includes(user.role)) {
            return response.status(403).send("Access denied");
          }

          // Attach user to request and proceed
          request.user = user;
          next();
        } catch (error) {
          console.error(error);
          response.status(500).send("Internal Server Error");
        }
      }
    });
  };
};

//check current user
const checkUser = (request, response, next) => {
  const token = request.cookies.jwt;

  //check if web token exist
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        next();
      } else {
        console.log(decodedToken);
        let user = await User.findById(decodedToken.id);
        response.locals.user = user; // injecting it to views for some get methods
        next();
      }
    });
  } else {
    response.locals.user = null;
    next();
  }
};

const errorFileHandler = (err, request, response, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === "LIMIT_FILE_SIZE") {
      return response
        .status(400)
        .json({ message: "File is too large. Maximum file size is 15MB." });
    }
  } else if (err.message === "Incorrect file type") {
    return response.status(400).json({
      message:
        "Incorrect file type. Allowed types are PDF, DOC, DOCX, JPEG, PNG.",
    });
  }
  return response
    .status(500)
    .json({ message: "An error occurred", error: err.message });
};

export { requireAuth, checkUser, errorFileHandler };

import jwt from "jsonwebtoken";
import { User } from "../../mongoose/schemas/user.mjs";
import multer from "multer";

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

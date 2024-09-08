import {
  query,
  body,
  validationResult,
  matchedData,
  checkSchema,
} from "express-validator";

export const postFAQvalidation = {
  //Validation handling for incorrect Category input
  category: {
    isLength: {
      options: {
        min: 3,
        max: 10,
      },
      errorMessage:
        "Category name must be at least 3 characters with a max of 15 characters",
    },
    notEmpty: { errorMessage: "Category name must not be empty" },
    isString: { errorMessage: "Category must only letters " },
  },
  //Validation handling for incorrect Question input
  question: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage:
        "The question must be at least 5 characters with a max of 32 characters",
    },
    notEmpty: { errorMessage: "Question name must not be empty" },
    isString: {
      errorMessage: "Question must include letters and numbers ",
    },
  },
  //Validation handling for incorrect Answer input
  answer: {
    isLength: {
      options: {
        min: 5,
        max: 500,
      },
      errorMessage:
        "The answer name must be at least 5 characters with a max of 500 characters",
    },
    notEmpty: { errorMessage: "Answer name must not be empty" },
  },
};

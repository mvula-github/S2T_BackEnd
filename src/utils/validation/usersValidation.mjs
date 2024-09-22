import {
  query,
  body,
  validationResult,
  matchedData,
  checkSchema,
} from "express-validator";

export const addUserValidation = {
  fName: {
    notEmpty: { errorMessage: "First name is required" },
    isLength: {
      options: { min: 2, max: 30 },
      errorMessage: "First name must be between 2 to 30 characters",
    },
    trim: true,
    isAlpha: { errorMessage: "First name must contain only letters" },
  },
  lName: {
    notEmpty: { errorMessage: "Last name is required" },
    isLength: {
      options: { min: 2, max: 30 },
      errorMessage: "Last name must be between 2 to 30 characters",
    },
    trim: true, // Removes leading and trailing spaces
    isAlpha: { errorMessage: "Last name must contain only letters" },
  },
  email: {
    isEmail: { errorMessage: "Please provide a valid email address" },
    normalizeEmail: true,
    isLength: {
      options: {
        max: 50,
      },
      errorMessage: "Email address cannot be longer than 50 characters",
    },
  },
  password: {
    notEmpty: { errorMessage: "Password is required" },
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
    matches: {
      options: /\d/, // Check for at least one number
      errorMessage: "Password must contain at least one number",
    },
    matches: {
      options: /[A-Z]/, // Check for at least one uppercase letter
      errorMessage: "Password must contain at least one uppercase letter",
    },
    matches: {
      options: /[a-z]/, // Check for at least one lowercase letter
      errorMessage: "Password must contain at least one lowercase letter",
    },
    matches: {
      options: /[\W_]/, // Check for at least one special character or underscore
      errorMessage: "Password must contain at least one special character",
    },
  },
  affiliation: {
    optional: true,
    trim: true,
    isLength: {
      options: { min: 5 },
      errorMessage: "Affiliation must be at least 5 characters long",
    },
  },
  credentials: {
    optional: true,
    trim: true,
    isLength: {
      options: { min: 5 },
      errorMessage: "Credentials must be at least 5 characters long",
    },
  },
  role: {
    optional: { options: { nullable: true } }, // Role is optional but has a default
    isIn: {
      options: [["educator", "moderator", "admin"]], // Allowed values
      errorMessage: "Role must be either 'educator', 'moderator', or 'admin'",
    },
    default: "educator", // Set default value as 'educator'
  },
};

export const updateUserValidation = {
  fName: {
    notEmpty: { errorMessage: "First name is required" },
    isLength: {
      options: { min: 2, max: 30 },
      errorMessage: "First name must be between 2 to 30 characters",
    },
    trim: true,
    isAlpha: { errorMessage: "First name must contain only letters" },
    optional: true,
  },
  lName: {
    notEmpty: { errorMessage: "Last name is required" },
    isLength: {
      options: { min: 2, max: 30 },
      errorMessage: "Last name must be between 2 to 30 characters",
    },
    trim: true, // Removes leading and trailing spaces
    isAlpha: { errorMessage: "Last name must contain only letters" },
    optional: true,
  },
  email: {
    isEmail: { errorMessage: "Please provide a valid email address" },
    normalizeEmail: true,
    isLength: {
      options: {
        max: 50,
      },
      errorMessage: "Email address cannot be longer than 50 characters",
    },
    optional: true,
  },
  password: {
    notEmpty: { errorMessage: "Password is required" },
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
    optional: true,
    matches: {
      options: /\d/, // Check for at least one number
      errorMessage: "Password must contain at least one number",
    },
    matches: {
      options: /[A-Z]/, // Check for at least one uppercase letter
      errorMessage: "Password must contain at least one uppercase letter",
    },
    matches: {
      options: /[a-z]/, // Check for at least one lowercase letter
      errorMessage: "Password must contain at least one lowercase letter",
    },
    matches: {
      options: /[\W_]/, // Check for at least one special character or underscore
      errorMessage: "Password must contain at least one special character",
    },
  },
  affiliation: {
    optional: true,
    isLength: {
      options: { min: 5 },
      errorMessage: "Affiliation must be at least 5 characters long",
    },
  },
  credentials: {
    optional: true,
    isLength: {
      options: { min: 5 },
      errorMessage: "Credentials must be at least 5 characters long",
    },
  },
  role: {
    optional: { options: { nullable: true } }, // Role is optional but has a default
    isIn: {
      options: [["educator", "moderator", "admin"]], // Allowed values
      errorMessage: "Role must be either 'educator', 'moderator', or 'admin'",
    },
    default: "educator", // Set default value as 'educator'
  },
};

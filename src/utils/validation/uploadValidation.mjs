export const addFileValidation = {
  fileName: {
    notEmpty: { errorMessage: "File name is required" },
    isLength: {
      options: { min: 5, max: 50 },
      errorMessage: "File name must be bewteeen 5 and 50 characters",
    },
    trim: true,
  },
  subject: {
    notEmpty: { errorMessage: "Subject name is required" },
    isLength: {
      options: { min: 2, max: 25 },
      errorMessage: "Subject must be bewteeen 5 and 50 characters",
    },
    trim: true,
  },
  grade: {
    notEmpty: { errorMessage: "Grade is required" },
    isInt: {
      option: { min: 1, max: 12 },
      errorMessage: "Grade is a number between 1 and 12",
    },
  },
  year: {
    notEmpty: { errorMessage: "Year is required" },
    isInt: {
      option: { min: 2000, max: new Date().getFullYear() },
      errorMessage:
        "Year is a 4-digit number between 2000 and the current year",
    },
  },
  description: {
    notEmpty: { errorMessage: "Description is required" },
    isLength: {
      options: { max: 300 },
      errorMessage: "Description must be less that 300 characters",
    },
    trim: true,
  },
  category: {
    notEmpty: { errorMessage: "Category is required" },
    isLength: {
      options: { min: 5, max: 20 },
      errorMessage: "Category must be between 5 and 20 characters",
    },
    trim: true,
  },
};

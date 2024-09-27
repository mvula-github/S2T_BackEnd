// Validation rules for file rating
export const validateFileRating = {
  rating: {
    isInt: { min: 1, max: 5 },
    errorMessage: "Rating must be between 1 and 5",
  },
  comment: {
    optional: true,
    isLength: { max: 500 },
    errorMessage: "Comment cannot exceed 500 characters.",
  },
};

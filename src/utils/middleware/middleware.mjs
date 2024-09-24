// errorHandler.js
const errorHandler = (err, request, response, next) => {
  console.error(err.stack);

  if (err.isOperational) {
    return response.status(err.statusCode).json({ error: err.message });
  }

  // For unhandled errors, return a generic message
  response.status(500).json({ error: "An unexpected error occurred!" });
};

export default errorHandler;

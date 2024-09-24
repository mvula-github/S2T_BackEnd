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

// errors.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message, statusCode);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(`${message}`, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = "Bad Request") {
    super(`${message}`, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access") {
    super(`${message}`, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Forbidden access") {
    super(`${message}`, 403);
  }
}

class ServerError extends AppError {
  constructor(message = "Internal server error") {
    super(`${message}`, 500);
  }
}

class GatewayError extends AppError {
  constructor(message = "Bad Gateway") {
    super(`${message}`, 502);
  }
}

class ServiceError extends AppError {
  constructor(message = "Service Unavailable") {
    super(`${message}`, 503);
  }
}

export {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ServerError,
  GatewayError,
  ServiceError,
};

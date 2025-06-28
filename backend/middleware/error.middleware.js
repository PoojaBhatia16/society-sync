// backend/middleware/error.middleware.js
import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  console.error("Error:", err);

  // Handle ApiError instances
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  // Handle other types of errors
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export { errorHandler };

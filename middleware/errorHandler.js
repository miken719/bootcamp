const ErrorResponse = require("./error");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  if (err.name === "CastError") {
    const message = `Resource not found on this ${err.value}`;
    error = new ErrorResponse(message, 404);
  }
  if (err.code === 11000) {
    const message = "Duplicate Bootcamp Found";
    error = new ErrorResponse(message, 400);
  }
  console.log(`Error: ${error.message}`);
  res.status(error.statusCode || 500).json({
    error: error.message || "Server Error",
    status: false,
  });
};
module.exports = errorHandler;

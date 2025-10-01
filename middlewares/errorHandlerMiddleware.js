export const errorHandlerMiddleware = (err, req, res, next) => {
  const errorMsg = err.message || "Internal server error";
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ success: false, error: errorMsg });
};

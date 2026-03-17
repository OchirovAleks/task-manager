function errorHandler(err, req, res, next) {
  const status = err.status || 500;

  if (status >= 500) {
    console.error(err);
  }

  if (res.headersSent) {
    return next(err);
  }

  res.status(status).json({
    error: err.message || "Internal server error",
  });
}

module.exports = { errorHandler };
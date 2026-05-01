module.exports = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error("[error]", err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
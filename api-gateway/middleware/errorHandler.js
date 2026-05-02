const { v4: uuidv4 } = require('uuid');

const requestLogger = (req, res, next) => {
  req.id = uuidv4();
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log({
      requestId: req.id,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
  });

  next();
};

const errorHandler = (err, req, res, next) => {
  console.error({
    requestId: req.id,
    error: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    requestId: req.id,
  });
};

const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
};

module.exports = {
  requestLogger,
  errorHandler,
  notFound,
};

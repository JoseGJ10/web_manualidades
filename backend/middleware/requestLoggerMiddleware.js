const { requestLogger } = require('../helpers/logger'); // Importa el logger

// Middleware para registrar las peticiones HTTP
const requestLoggerMiddleware = (req, res, next) => {
  const logMessage = `${req.method} ${req.url} ${res.statusCode}`;
  console.log(logMessage);
  requestLogger.info(logMessage); // Log de peticiones HTTP
  next();
};

module.exports = requestLoggerMiddleware;

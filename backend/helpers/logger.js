const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;
const DailyRotateFile = require('winston-daily-rotate-file');

// Formato personalizado para los logs
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Configuración de transporte común para DailyRotateFile
const dailyRotateTransport = (filename) => new DailyRotateFile({
  filename: `backend/logs/${filename}-%DATE%.log`, // Define el formato del nombre del archivo
  datePattern: 'YYYY-MM-DD',               // Define el patrón de la fecha
  zippedArchive: true,                      // Comprimir archivos antiguos
  maxSize: '20m',                           // Máximo tamaño del archivo antes de rotar
  maxFiles: '14d'                           // Mantener archivos por 14 días
});

// Logger para las conexiones
const connectionLogger = createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    dailyRotateTransport('connections')
  ]
});

// Logger para los errores
const errorLogger = createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),  // Incluir stack trace en caso de error
    logFormat
  ),
  transports: [
    dailyRotateTransport('errors')
  ]
});

// Logger para las peticiones HTTP
const requestLogger = createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    dailyRotateTransport('requests')
  ]
});

module.exports = {
  connectionLogger,
  errorLogger,
  requestLogger
};


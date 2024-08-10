const { ErrorHandler } = require('../helpers/customErrors');
const logger = require('../helpers/logger');

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    logger.errorLogger.info(`Status: ${err.statusCode} - ${err.message} - Stack: ${err.stack}`);
    
    res.status(err.statusCode || 500 ).json({
        status: err.status,
        type: err.name,
        message: err.message
    });
};

module.exports = errorHandler;
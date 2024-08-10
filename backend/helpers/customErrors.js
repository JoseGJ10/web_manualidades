// errors/customErrors.js

class validateError extends Error {
    constructor(message,statusCode) {
        super(message);
        this.name = 'validateError';
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
};

class userError extends Error {
    constructor(message,statusCode) {
        super(message);
        this.name = 'userError';
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
};

class craftError extends Error {
    constructor(message,statusCode) {
        super(message);
        this.name = 'craftError';
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
};

class connectionError extends Error {
    constructor(message,statusCode) {
        super(message);
        this.name = 'connectionError';
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

class serverError extends Error {
    constructor(message,statusCode) {
        super(message);
        this.name = 'connectionError';
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {serverError, connectionError, craftError, userError, validateError};
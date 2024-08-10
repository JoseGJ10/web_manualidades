// responses/responses.js

class SuccessResponseHandler {
    static sendSuccess(res, data, message = 'Request successful', statusCode = 200) {
      res.status(statusCode).json({
        status: 'success',
        message,
        data
      });
    }
  }

module.exports = SuccessResponseHandler;
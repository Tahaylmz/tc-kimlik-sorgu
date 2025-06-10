const { ERROR_MESSAGES, HTTP_STATUS } = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
    console.error('Hata:', err);

    const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = err.message || ERROR_MESSAGES.SERVER_ERROR;

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler; 
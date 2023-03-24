const ErrorHandler = require('../utils/errorHandler')

module.exports = (err, req, res, next) => {
    err.statuCode = err.statuCode || 500
    err.message = err.message || "Internal Server Error"

    res.status(err.statuCode).json({
        success: false,
        // error: err.stack
        message: err.message
    })

}
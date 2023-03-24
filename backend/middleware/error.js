const ErrorHandler = require('../utils/errorHandler')

module.exports = (err, req, res, next) => {
    err.statuCode = err.statuCode || 500
    err.message = err.message || "Internal Server Error"

    //wrong mongodb Id error
    if(err.name === "CastError"){
        const message = `resource not found. Invalid: ${err.path}`
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statuCode).json({
        success: false,
        // error: err.stack
        message: err.message
    })

}
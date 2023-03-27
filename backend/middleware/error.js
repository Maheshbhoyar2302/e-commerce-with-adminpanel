const ErrorHandler = require('../utils/errorHandler')

module.exports = (err, req, res, next) => {
    err.statuCode = err.statuCode || 500
    err.message = err.message || "Internal Server Error"

    //wrong mongodb Id error
    if(err.name === "CastError"){
        const message = `resource not found. Invalid: ${err.path}`
        err = new ErrorHandler(message, 400)
    }

    //mongoose duplicate key error
    if(err.code === 11000) {
        const message = `duplicate ${Object.keys(err.keyValue)} entered`

        err = new ErrorHandler(message, 400)
    }

    //wrong jwt error
    if (err.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid, Try again `;
        err = new ErrorHandler(message, 400);
      }
    

    // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again `;
    err = new ErrorHandler(message, 400);
  }

  
    res.status(err.statuCode).json({
        success: false,
        error: err.stack
        // message: err.message
    })

}
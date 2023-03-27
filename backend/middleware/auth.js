const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('./catchAsyncErrors')
const jwt = require('jsonwebtoken')
const User = require('../models/userModels')


exports.isAuthenticatedUser = catchAsyncErrors(
    async (req, res, next) => {
        const {token} = req.cookies

        if(!token) {
            return next(new ErrorHandler("please login this to access this resource", 401))
        }

        const decodedData = jwt.verify(token, "secrtkey")

        req.user = await User.findById(decodedData.id)

        next()
    }
)

exports.authorizeRoles = (...roles) => {

    return (req, res, next) => {

        if(!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403))
        }

        next()
    }
}
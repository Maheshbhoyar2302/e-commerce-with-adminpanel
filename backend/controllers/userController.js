const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const User = require('../models/userModels')
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail.js')
const crypto = require('crypto')

//registration of user

exports.registerUser = catchAsyncErrors(
    async (req, res, next) => {
        const {name, email, password} = req.body
        
        const user = await User.create({
            name, email, password, 
            avatar : {
                public_id : 'this is a sample id',
                url : "profilepicurl"
            }
        })

        //this is repeating in both register and login so making in utils folder
        
        // const token = user.getJWTToken()
        // res.status(201).json({
        //     success: true,
        //     token  
        // })

        sendToken(user, 201, res)
        
    }
)

//login user
exports.loginUser = catchAsyncErrors(

    async (req, res, next) => {


        const {email, password} = req.body

        //checking if user has given password and email both

        if(!email || !password) {
            return next(new ErrorHandler("please enter email and password", 400))
        }

        //in userModel we have done select for password as false so while finding the user we need both email and password so we add the password
        const user = await User.findOne({email}).select("+password")

        if(!user) {
            return next(new ErrorHandler("invalid email or password", 401))
        }

        const isPasswordMatched =  user.comparePassword(password)

        if(!isPasswordMatched) {
            return next(new ErrorHandler("invalid email or password", 401))
        }

        // const token = user.getJWTToken()

        //     res.status(200).json({
        //         success:true,
        //         token
        //     })

        sendToken(user, 200, res )
        
    }
)

//logout user

exports.logout = catchAsyncErrors(
    async (req, res, next) => {

        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })

        res.status(200).json({
            success: true,
            message:"logged out"
        })
    }
)

//forgot password

exports.forgotPassword = catchAsyncErrors(
    async (req, res, next) => {
        const user = await User.findOne({email: req.body.email})

        if(!user) {
            return next(new ErrorHandler("user not found", 404))
        }

        //get resetPassword token
        const resetToken = user.getResetPasswordToken()

        await user.save({validateBeforeSave: false})

        // const resetPasswordUrl = `http://localhost/api/v1/password/reset/${resetToken}`

        const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

        const message = `Your password reset token is :- \n\n ${resetPasswordUrl}  \n\nIf you have not requested this email then, please ignore it.`

        try {
            
            await sendEmail({
                email: user.email,
                subject: `Ecommerce password recovery`,
                message
            })

            res.status(200).json({
                success:true,
                message:`Email sent to ${user.email} successfully`
            })
        } catch (error) {
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined

            await user.save({ validateBeforeSave: false})

            return next(new ErrorHandler(error.message, 500))
        }
    }
)

//reset password
exports.resetPassword = catchAsyncErrors(
    async (req, res, next) => {

        //creating token hash
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

        //find user based on the token
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: {$gt: Date.now()}
        })

        if(!user) {
            return next(new ErrorHandler('reset password token is invalid or has been expired', 400))
        }

        if(req.body.password !== req.body.confirmPassword) {
            return next(new ErrorHandler("password does not match", 400))
        }

        user.password = req.body.password

        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save()

        sendToken(user, 200, res)
    }
)
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const User = require('../models/userModels')
const sendToken = require('../utils/jwtToken')

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
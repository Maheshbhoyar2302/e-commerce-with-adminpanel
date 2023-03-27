const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter your name"],
        maxLength: [30, "name cannot exceed 30 char"],
        minLength: [4, "name should have more than 4 char"]
    },
    email: {
        type: String,
        required: [true, "please enter a email id"],
        unique: true,
        validator: [validator.isEmail, "please enter valid email"]
    },
    password: {
        type: String,
        required: [true, "please enter your password"],
        minLength:  [8, "password should be greater than 8 char"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
           type: String,
           tequired: true 
        }
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date

})

//hash the password
//event before saving the user
userSchema.pre("save", async function(next){
    //if password is changed by user then dont hash again just change the password
    if(!this.isModified("password")){
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

//jwt token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id}, "secrtkey", {
        expiresIn: '1d'
    })
}

//compare password 
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

//generating password reset token
userSchema.methods.getResetPasswordToken = function(){
    //generating token
    const resetToken = crypto.randomBytes(20).toString('hex')

    //hashing and adding to user schema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest('hex')

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000

    return resetToken
}


module.exports = mongoose.model("User", userSchema)
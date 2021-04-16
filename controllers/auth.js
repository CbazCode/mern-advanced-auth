const User = require('../models/User')

const ErrorResponse = require('../utils/errorResponse');


exports.register = async(req, res, next) => {
   
    const { username, email, password } = req.body;
    try{
        const user = await User.create({
            username, email, password
        });

        sendToken(user, 201, res);

    } catch(error){
        next(error);
    }
}

exports.login = async(req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password){
        return next(new ErrorResponse("Please provide an email or password",400))
    }
    try {
        const user = await User.findOne({ email }).select('+password');

        if(!user){
            return next(new ErrorResponse("Invalid credentials", 401))
        }

        const isMatch = await user.matchPasswords(password);

        if(!isMatch){
            return next(new ErrorResponse("Invalid credentials", 401))
        }

        sendToken(user, 201, res);
        
    } catch (error) {
        res.status(500).json({
            success:false,
            error:error.message
        })
    }

}

exports.forgotpassword = async(req, res, next) => {
    const {email} = req.body;
    try {
        const user = await User.findOne({email: email});
        if(!user){
            return next(new ErrorResponse("Email could not be sent",404))
        }

        const resetToken = user.getResetPasswordToken()

        await user.save();
    } catch (error) {
        
    }

}

exports.resetpassword = (req, res, next) => {
    res.send("Reset password route");
}

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({ 
        success: true,
        token
    })
}
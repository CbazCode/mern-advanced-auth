const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.protect = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        // Bearer 424a54d5as4d6ads
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token){
        return next(new ErrorResponse("Not authorized to access this route", 401))
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decode.id);

        if(!user){
            next(new ErrorResponse("No user found with this id", 404));
        }

        req.user = user;

        next();
    } catch (error) {
        return next(new ErrorResponse("Not authorized to access this route", 401))        
    }
}
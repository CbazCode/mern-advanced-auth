const crypto = require('crypto');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"]
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
        //Regex for validate an email
        match: [
            /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
            "Please provide a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength:6,
        //Evita que traiga al password cada vez q se le haga una query al modelo a menos q le indiquemos espeficamente que traiga al password
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date

});

UserSchema.pre("save", async function(next){ 
    //Por si hacen un save y el password no esta modificado no hace nada mongoosse
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();

})

UserSchema.methods.matchPasswords = async function(password){
    return await bcryptjs.compare(password, this.password);
}

UserSchema.methods.getSignedToken = function(){ 
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES});
}

UserSchema.methods.getResetPasswordToken= function(){
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * (60*1000);

    return resetToken;

}

const User = mongoose.model("User", UserSchema); 

module.exports = User;
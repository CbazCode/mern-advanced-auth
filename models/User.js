const mongoose = require('mongoose');

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

})

const User = mongoose.model("User", UserSchema);

module.exports = User;
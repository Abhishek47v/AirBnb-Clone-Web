const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required : true,
    }
});

userSchema.plugin(passportLocalMongoose); // automatically implement username and password with salting and hashed form
module.exports = mongoose.model("User", userSchema); 
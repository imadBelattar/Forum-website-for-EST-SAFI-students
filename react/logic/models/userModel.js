const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    full_name : {
        type : String,
        required : true
    },
    login : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
})
const userModel = mongoose.model("user", userSchema)
module.exports = userModel
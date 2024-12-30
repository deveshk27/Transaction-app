const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:admin123@cluster0.8fgtt.mongodb.net/paytm');

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        minLength : 4,
        maxLength : 20
    }, 
    password : {
        type : String,
        required : true ,
        minLength : 6
    },
    firstName : {
        type : String,
        required : true ,
    },
    lastName : {
        type : String,
        required : true 
    }
})

const User = mongoose.model('User' , userSchema) ;

module.exports = {
    User
}




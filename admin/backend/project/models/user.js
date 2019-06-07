const Joi = require('joi');
const mongoose = require('mongoose');

const User = mongoose.model('user', new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        minlength:3,
        maxlength:50
    },
    lastname:{
        type:String,
        required:true,
        minlength:3,
        maxlength:50
    },
    email:{
        type:String,
        required:true,
        minlength:5,
        maxlength:255,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:5,
        maxlength:1024
    },
    isAdmin:{type: Boolean, default:false},
    date:{type: Date, default:Date.now},
    profileImg: { type: String, required: true }
}));

function validateUser(user) {
    const schema = {
      firstname: Joi.string().min(3).max(50).required(),
      lastname: Joi.string().min(3).max(50).required(),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    };
  
    return Joi.validate(user, schema);
  }

exports.User = User;
exports.validate = validateUser;
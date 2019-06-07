const Joi = require('joi');
const mongoose = require('mongoose');

const Login = mongoose.model('login', new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minlength:3
    },
    userpwd:{
        type:String,
        required:true,
        minlength:3
    },
    date:{type: Date, default:Date.now}
}));

function validateLogin(login) {
    const schema = {
      username: Joi.string().min(3).required(),
      userpwd: Joi.string().min(3).required()
    };
  
    return Joi.validate(login, schema);
  }

exports.Login = Login;
exports.validate = validateLogin;
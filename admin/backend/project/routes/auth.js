const config = require('config');
const {User} = require('../models/user');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');


router.post('/', async(req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({"error": error.details[0].message});

    let user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send({"error": "Invalid email or password"});
  
    const vaildPassword = await bcrypt.compareSync(req.body.password, user.password);
    if(!vaildPassword) return res.status(400).send({"error": "Invalid email or password"});

    const token = jwt.sign({_id:user._id, isAdmin:user.isAdmin}, config.get('jwtPrivateKey'));

    res.send({"token":token, "statusCode":200, 'username':user.firstname, "userimg": user.profileImg});
});

function validate(req) {
    const schema = {
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    };
  
    return Joi.validate(req, schema);
  }

module.exports = router;
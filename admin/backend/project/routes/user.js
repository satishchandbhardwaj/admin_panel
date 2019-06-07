const {User , validate} = require('../models/user');
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname)
  }
})
 
var upload = multer({ storage: storage });

router.get('/', auth, async(req, res) => {
    const users = await User.find();
    //res.send(users);
    // const model = {
    //     _id:null,
    //     firstname:null,
    //     lastname:null,
    //     email:null
    //  };
     const mapKeys = users.map(person => {
        return _.pick(person, ['_id','firstname','lastname','email']);
     });
    
   // res.send(_.pick(users, ['_id','firstname','lastname','email']))
   res.send(mapKeys);
});

router.post('/',[auth, admin], upload.single('profileImg'), async(req, res, next) => {
  //console.log(req);
    const { error } = validate(req.body);
    if (error) return res.status(400).send({"error": error.details[0].message});

    let user = await User.findOne({email:req.body.email});
    if(user) return res.status(400).send({"error": "User Already Registered"});
  
    // user = new User({
    //     name: req.body.name,
    //     email:req.body.email,
    //     password:req.body.password
    // });

    //using lodash(underscore)
    let userdata = _.pick(req.body, ['firstname', 'lastname', 'email', 'password']);
    let filedata = {profileImg: req.file.path};
    
    user = new User(_.merge({}, userdata, filedata));
    const salt = await bcrypt.genSaltSync(10);
    user.password = await bcrypt.hashSync(user.password, salt);

    await user.save();

    const token = jwt.sign({_id:user._id, isAdmin:user.isAdmin }, config.get('jwtPrivateKey'));
   // res.header('x-auth-token', token).send(_.pick(user, ['_id','firstname','email']));
   res.header('x-auth-token', token).send({"statusCode":200, "message":"User Added Successfully"})
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const userdel = await User.findByIdAndRemove(req.params.id);
  
    if (!userdel) return res.status(404).send({"error": "The login with the given ID was not found."});
  
    //res.send(_.pick(userdel, ['_id','firstname','email']));
    res.send({"firstname":userdel.firstname, "email":userdel.email, "statusCode":200, "message":"User Deleted Successfully"})
  });

router.put('/:id',[auth, admin], async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    //let data = _.pick(req.body, ['firstname', 'lastname', 'email', 'password'])
    const user = await User.findByIdAndUpdate(req.params.id, {firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, password: req.body.password}, {
      new: true
    });
  
    if (!user) return res.status(404).send({"error": "The user with the given ID was not found."});
    
    res.send({"statusCode":200, "message":"User Updated Successfully"});
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
  
    if (!user) return res.status(404).send({"error": "The login with the given ID was not found."});
  
    res.send(_.pick(user, ['firstname', 'lastname', 'email']));
  });

module.exports = router;
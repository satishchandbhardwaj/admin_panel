const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Login , validate} = require('../models/login');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async(req, res, next) => {
  //throw new Error('Could not get the login details.');
    const login = await Login.find();
    res.send(login); 
});

router.post('/', auth,  async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let login = new Login({ username: req.body.username, userpwd: req.body.userpwd });
    login = await login.save();
    
    res.send(login);
  });

  router.put('/:id', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const login = await Login.findByIdAndUpdate(req.params.id, { username: req.body.username, userpwd: req.body.userpwd }, {
      new: true
    });
  
    if (!login) return res.status(404).send('The login with the given ID was not found.');
    
    res.send(login);
  });

  router.delete('/:id', [auth, admin], async (req, res) => {
    const login = await Login.findByIdAndRemove(req.params.id);
  
    if (!login) return res.status(404).send('The login with the given ID was not found.');
  
    res.send(login);
  });

  router.get('/:id', async (req, res) => {
    const login = await Login.findById(req.params.id);
  
    if (!login) return res.status(404).send('The login with the given ID was not found.');
  
    res.send(login);
  });



  module.exports = router;


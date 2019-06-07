const express = require('express');
const login = require('../routes/login');
const users = require('../routes/user');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function(app){

    app.use(express.json());

    app.use('/uploads', express.static('uploads'));

    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token");
      next();
    });

  //   app.use((req, res, next) => {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header("Access-Control-Allow-Credentials", "true");
  //   res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  //   );
  //   if (req.method === 'OPTIONS') {
  //       res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
  //       return res.status(200).json({});
  //   }
  //   next();
  // });
    app.use('/api/login', login);
    app.use('/api/users', users);
    app.use('/api/auth', auth);

    app.use(error);
}
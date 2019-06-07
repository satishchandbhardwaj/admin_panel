const mongoose = require('mongoose');

module.exports = function(){
    const uri= 'mongodb+srv://satish:yE3bxbXqnefQG54M@scb-rh5i4.mongodb.net/merisawaari?retryWrites=true';
    mongoose.set('useCreateIndex', true);
    mongoose.connect(uri,{ useNewUrlParser: true })
    .then(() => console.log('connect with mongoDB'))
    .catch(err => console.log('Could not connect with mongoDB', err));
}
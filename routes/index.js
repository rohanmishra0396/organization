var express = require('express');
var app = express();
const passport = require('passport');

let login = require('./login');
let register = require('./register');
let accountDetails = require('./account');

app.use(login);
app.use(register);

//authentication of request before fetching user data
app.use(passport.authenticate('jwt',{
    session : false,
    failWithError : true
}));


app.use(accountDetails);

module.exports = app;
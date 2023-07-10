const express = require('express');
const path = require('path');
const user_route = express();

user_route.set('view engine', 'ejs');    
user_route.set('views', __dirname + '/views');
user_route.use(express.static('public'));

const userController = require('../controllers/userController')

user_route.get('/mail-verification', userController.verifyMail);
user_route.get('/reset-password', userController.resetPasswordLoad);
user_route.post('/reset-password', userController.resetPassword);

module.exports = user_route;
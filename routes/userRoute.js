const authController = require('../controllers/authController');
const express = require('express');
const route = express.Router();

route.post('/signup', authController.signup);
route.get('/getalluser', authController.getAllUser);
route.post('/login', authController.login);
route.post('/forgotPassword', authController.forgotPassword);
route.patch('/resetPassword/:token', authController.resetPassword);
route.patch('/update', authController.protect, authController.updatePassword);
route.patch('/userUpdate', authController.protect, authController.updateMe);
route.delete('/delete', authController.protect, authController.deleteUser);

module.exports = route;

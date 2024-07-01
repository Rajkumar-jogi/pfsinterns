const express = require('express');
const router = express.Router();
const { registerUser, LoginUser } = require('../controllers/userController');

// console.log(registerUser)

// Define POST route for user registration
router.post('/register', registerUser);

// Define POST route for user login
router.post('/login', LoginUser)

module.exports = router;

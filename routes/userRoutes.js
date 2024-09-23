const express = require('express');
const { register } = require('../controllers/userController');
const router = express.Router();

// create all routes like register, login, logout, delete, update user etc

router.post('/register', register);

module.exports = router;
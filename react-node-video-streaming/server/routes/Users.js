const express = require('express');
const userController = require('../controllers/Users');
const { asyncWrapper } = require('../utils/asyncWrapper');

const userRoutes = express.Router();

userRoutes.post('/register', asyncWrapper(userController.register));

userRoutes.post('/login', asyncWrapper(userController.login));

module.exports = userRoutes;

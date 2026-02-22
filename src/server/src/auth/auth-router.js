const express = require('express');
const authController = require('./auth-controller');
const { body } = require('express-validator');

const router = express.Router();

router.post(
  '/register',
  body('username').isString().notEmpty().isLength({ min: 3, max: 32 }),
  body('password').isString().notEmpty().isLength({ min: 8, max: 32 }),
  authController.register
);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.post('/refresh', authController.refresh);

module.exports = router;

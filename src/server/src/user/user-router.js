const express = require('express');
const userController = require('./user-controller');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');

const router = express.Router();

router.get('/users', authMiddleware, userController.fetchAllUsers);
router.get('/users/info', authMiddleware, adminMiddleware, userController.fetchUsersInfoForAdmin);
router.patch('/users/role', authMiddleware, adminMiddleware, userController.setUserRole);

module.exports = router;

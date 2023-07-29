export {};
const express = require('express');

const userController = require('../controllers/user');

const checkAuth = require('../middleware/checkAuth');

const router = express.Router();

router.get('/', userController.getAllUsers);

router.get('/:id', userController.getUserById);

router.post('/signup', userController.signup);

router.post('/login', userController.loginUser);

router.put('/:id', checkAuth, userController.editUserProfile);

router.delete('/:id', checkAuth, userController.deleteUser);

router.post('/request-password-reset', userController.requestPasswordReset);

router.post('/password-reset', userController.resetPassword);

module.exports = router;
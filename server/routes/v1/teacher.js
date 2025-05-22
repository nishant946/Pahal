const express = require('express');
const router = express.Router();
const teacherController = require('../../controllers/teacher.controller');
const { authenticate, requireAdmin } = require('../../middlewares/auth.middleware');

// Public routes
router.post('/login', teacherController.login);

// Protected routes
router.post('/register', authenticate, requireAdmin, teacherController.register);
router.get('/profile', authenticate, teacherController.getProfile);

module.exports = router;

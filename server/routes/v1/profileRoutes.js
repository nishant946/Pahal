import express from 'express';
import profileController from '../../controllers/profileController.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Teacher Profile Routes
router.get('/teacher/profile', authenticateToken, profileController.getTeacherProfile);
router.put('/teacher/profile', authenticateToken, profileController.updateTeacherProfile);
router.post('/teacher/upload-avatar', authenticateToken, profileController.uploadTeacherAvatar);

// Admin Profile Routes
router.get('/admin/profile', authenticateToken, profileController.getAdminProfile);
router.put('/admin/profile', authenticateToken, profileController.updateAdminProfile);
router.post('/admin/upload-avatar', authenticateToken, profileController.uploadAdminAvatar);

// Common Routes
router.put('/change-password', authenticateToken, profileController.changePassword);

export default router;
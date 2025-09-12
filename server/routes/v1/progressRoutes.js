import express from 'express';
import { getStudentProgress, addProgressLog } from '../../controllers/progressController.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Get all progress logs for a student
router.get('/:studentId', authenticateToken, getStudentProgress);
// Add a new progress log for a student
router.post('/:studentId', authenticateToken, addProgressLog);

export default router;

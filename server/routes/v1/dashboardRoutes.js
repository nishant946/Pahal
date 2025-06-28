import express from 'express';
import { 
  getDashboardStats,
  getStudentStats,
  getAttendanceStats
} from '../../controllers/dashboardController.js';

const dashboardRoutes = express.Router();

// Get comprehensive dashboard statistics
dashboardRoutes.get('/stats', getDashboardStats);

// Get student statistics
dashboardRoutes.get('/students', getStudentStats);

// Get attendance statistics
dashboardRoutes.get('/attendance', getAttendanceStats);

export default dashboardRoutes; 
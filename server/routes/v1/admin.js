import express from 'express';
import { 
  getAllTeachers, 
  getTeacherById, 
  verifyTeacher, 
  getTeacherStats,
  getUnverifiedTeachers,
  deactivateTeacher
} from '../../controllers/teacherController.js';
import {
  getDashboardStats,
  getAllTeachersForAdmin,
  getTeacherStatsByDepartment,
  getAttendanceOverview,
  getHomeworkOverview,
  getAttendanceAnalytics,
  getStudentsByDate,
  getTeacherAttendanceOverview,
  getTeacherAttendanceAnalytics,
  getTeachersByDate
} from '../../controllers/adminController.js';
import { requireAdminAccess } from '../../middlewares/auth.middleware.js';

const adminRoutes = express.Router();

// Dashboard routes
adminRoutes.get('/dashboard/stats', requireAdminAccess, getDashboardStats);

// Teacher management routes
adminRoutes.get('/teachers', requireAdminAccess, getAllTeachersForAdmin);
adminRoutes.get('/teachers/unverified', requireAdminAccess, getUnverifiedTeachers);
adminRoutes.get('/teachers/:id', requireAdminAccess, getTeacherById);
adminRoutes.patch('/teachers/:id/verify', requireAdminAccess, verifyTeacher);
adminRoutes.patch('/teachers/:id/deactivate', requireAdminAccess, deactivateTeacher);
adminRoutes.get('/teachers/stats', requireAdminAccess, getTeacherStats);
adminRoutes.get('/teachers/stats/department', requireAdminAccess, getTeacherStatsByDepartment);

// Overview routes
adminRoutes.get('/attendance/overview', requireAdminAccess, getAttendanceOverview);
adminRoutes.get('/attendance/analytics', requireAdminAccess, getAttendanceAnalytics);
adminRoutes.get('/attendance/students', requireAdminAccess, getStudentsByDate);
adminRoutes.get('/teacher-attendance/overview', requireAdminAccess, getTeacherAttendanceOverview);
adminRoutes.get('/teacher-attendance/analytics', requireAdminAccess, getTeacherAttendanceAnalytics);
adminRoutes.get('/teacher-attendance/teachers', requireAdminAccess, getTeachersByDate);
adminRoutes.get('/homework/overview', requireAdminAccess, getHomeworkOverview);

export default adminRoutes;

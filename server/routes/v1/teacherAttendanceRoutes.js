import express from 'express';
import { 
  markTeacherAttendance, 
  getTeacherAttendance, 
  getPresentTeachersByDate, 
  unmarkTeacherAttendance, 
  updateTeacherAttendance, 
  getTeacherAttendanceStats,
  getAllTeachersAttendanceReport
} from '../../controllers/teacherAttendanceController.js';

const teacherAttendanceRoutes = express.Router();

// Mark teacher attendance
teacherAttendanceRoutes.post('/mark', markTeacherAttendance);

// Get teacher attendance by date
teacherAttendanceRoutes.get('/date', getPresentTeachersByDate);

// Get all teachers attendance report
teacherAttendanceRoutes.get('/report', getAllTeachersAttendanceReport);

// Get teacher attendance by teacher ID
teacherAttendanceRoutes.get('/:teacherId', getTeacherAttendance);

// Get teacher attendance stats
teacherAttendanceRoutes.get('/stats/:teacherId', getTeacherAttendanceStats);

// Unmark teacher attendance
teacherAttendanceRoutes.put('/unmark', unmarkTeacherAttendance);

// Update teacher attendance
teacherAttendanceRoutes.put('/:attendanceId', updateTeacherAttendance);

export default teacherAttendanceRoutes; 
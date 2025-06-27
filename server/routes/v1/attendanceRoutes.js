import express from 'express';
import { getAttendance, getPresentStudentsByDate, markAttendance, unmarkAttendance, updateAttendance } from '../../controllers/attendanceController.js';
const attendanceRoutes = express.Router();
attendanceRoutes.post('/mark', markAttendance);
attendanceRoutes.get('/date', getPresentStudentsByDate); 
attendanceRoutes.post('/', markAttendance);
attendanceRoutes.get('/:userId', getAttendance); 
attendanceRoutes.put('/unmark', unmarkAttendance);
export default attendanceRoutes;


import express from 'express';
import { getAttendance, markAttendance, updateAttendance } from '../../controllers/attendanceController.js';
const attendanceRoutes = express.Router();
attendanceRoutes.post('/mark', markAttendance);
attendanceRoutes.post('/', markAttendance);
attendanceRoutes.get('/:userId', getAttendance); 
attendanceRoutes.put('/:attendanceId', updateAttendance);
export default attendanceRoutes;


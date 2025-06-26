import express from 'express';
import { markAttendance } from '../../controllers/attendanceController.js';
const attendanceRoutes = express.Router();
attendanceRoutes.post('/mark', markAttendance);
export default attendanceRoutes;


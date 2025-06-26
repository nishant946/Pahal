import express, { Router } from 'express';
import authRoutes from './authRoutes.js';
import attendanceRoutes from './attendanceRoutes.js';

const v1Routes = Router();

v1Routes.use('/auth', authRoutes); // http://localhost:3000/api/v1/auth
v1Routes.use('/attendance', attendanceRoutes); // http://localhost:3000/api/v1/attendance

export default v1Routes;

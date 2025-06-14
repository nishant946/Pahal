import express, { Router } from 'express';
import authRoutes from './authRoutes.js';

const v1Routes = Router();

v1Routes.use('/auth', authRoutes);

export default v1Routes;

import express, { Router } from 'express';
import v1Routes from './v1/index.js';

const ApiRoutes = Router();

ApiRoutes.use('/v1', v1Routes);

export default ApiRoutes;

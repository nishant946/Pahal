import express, { Router } from 'express';
import v1Routes from './v1/index.js';

const ApiRoutes = Router(); //http://localhost:3000/api/v1

ApiRoutes.use('/v1', v1Routes);

export default ApiRoutes;





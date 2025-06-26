import express, { Router } from 'express';
import { loginUser, registerUser } from '../../controllers/authController.js';

const authRoutes = Router();

authRoutes.post('/login',loginUser);
authRoutes.post('/register',registerUser);

export default authRoutes;

/*
    Types of requests:
    1. GET: Retrieve data from the server.
    2. POST: Send data to the server to create a new resource.
    3. PUT: Update an existing resource on the server.
    4. DELETE: Remove a resource from the server.
    5. PATCH: Partially update an existing resource on the server.
*/
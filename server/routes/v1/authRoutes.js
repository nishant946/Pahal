import express, { Router } from 'express';

const authRoutes = Router();

authRoutes.post('/login', (req, res) => {
    res.send('Login endpoint');
});

export default authRoutes;
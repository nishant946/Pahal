import express, { Router } from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import apiRouter from './routes/index.js';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', apiRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});




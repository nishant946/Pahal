import express from 'express';
import { addStudent, updateStudent, deleteStudent, getAllStudents } from '../../controllers/studentController.js';

const studentRouter = express.Router();

studentRouter.post('/add', addStudent);
studentRouter.get('/all', getAllStudents);
studentRouter.put('/:id', updateStudent); // singular: /student/:id in main route
studentRouter.delete('/:id', deleteStudent); // singular: /student/:id in main route

export default studentRouter;
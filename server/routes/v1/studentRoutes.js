import express from 'express';
import { addStudent, updateStudent, deleteStudent, getAllStudents } from '../../controllers/studentController.js';

const studentRouter = express.Router();

studentRouter.post('/add', addStudent);
studentRouter.get('/all', getAllStudents);
studentRouter.put('/:id', updateStudent);
studentRouter.delete('/:id', deleteStudent);

export default studentRouter;
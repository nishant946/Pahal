import express from 'express';
import { 
  registerTeacher,
  loginTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  verifyTeacher,
  getTeachersByDepartment,
  getTeacherStats
} from '../../controllers/teacherController.js';

const teacherRoutes = express.Router();

// Teacher authentication routes
teacherRoutes.post('/register', registerTeacher);
teacherRoutes.post('/login', loginTeacher);

// Teacher management routes
teacherRoutes.get('/', getAllTeachers);
teacherRoutes.get('/stats', getTeacherStats);
teacherRoutes.get('/department/:department', getTeachersByDepartment);
teacherRoutes.get('/:id', getTeacherById);
teacherRoutes.put('/:id', updateTeacher);
teacherRoutes.delete('/:id', deleteTeacher);
teacherRoutes.patch('/:id/verify', verifyTeacher);

export default teacherRoutes; 
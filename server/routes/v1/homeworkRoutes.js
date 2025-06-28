import express from 'express';
import { 
  createHomework, 
  getAllHomework, 
  getHomeworkByGroup, 
  getHomeworkByTeacher,
  getRecentHomework,
  getYesterdayHomework,
  updateHomework,
  deleteHomework,
  getHomeworkStats
} from '../../controllers/homeworkController.js';

const homeworkRoutes = express.Router();

// Create new homework
homeworkRoutes.post('/', createHomework);

// Get all homework
homeworkRoutes.get('/', getAllHomework);

// Get homework by group
homeworkRoutes.get('/group/:group', getHomeworkByGroup);

// Get homework by teacher
homeworkRoutes.get('/teacher/:teacherId', getHomeworkByTeacher);

// Get recent homework (today)
homeworkRoutes.get('/recent', getRecentHomework);

// Get yesterday's homework
homeworkRoutes.get('/yesterday', getYesterdayHomework);

// Get homework statistics
homeworkRoutes.get('/stats', getHomeworkStats);

// Update homework
homeworkRoutes.put('/:id', updateHomework);

// Delete homework
homeworkRoutes.delete('/:id', deleteHomework);

export default homeworkRoutes; 
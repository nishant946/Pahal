import express from 'express';
import {
  getAllContributors,
  getAllContributorsAdmin,
  getContributorById,
  createContributor,
  updateContributor,
  deleteContributor,
  toggleContributorStatus
} from '../../controllers/contributorController.js';
import { authenticateToken, requireAdminAccess } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllContributors);
router.get('/:id', getContributorById);

// Admin routes (require authentication and admin privileges)
router.get('/admin/all', requireAdminAccess, getAllContributorsAdmin);
router.post('/', requireAdminAccess, createContributor);
router.put('/:id', requireAdminAccess, updateContributor);
router.delete('/:id', requireAdminAccess, deleteContributor);
router.patch('/:id/toggle-status', requireAdminAccess, toggleContributorStatus);

export default router;
import express from 'express';
import { auth, checkRole, checkPermission } from '../middleware/auth.js';
import {
  register,
  login,
  getProfile,
  updateProfile,
  updateSkills,
  updateResources,
  updateVerificationStatus,
  getVerificationHistory
} from '../controllers/userController.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/skills', auth, updateSkills);
router.put('/resources', auth, updateResources);
router.get('/verification-history', auth, getVerificationHistory);

// Admin routes
router.put(
  '/verification/:userId',
  auth,
  checkRole(['admin']),
  checkPermission('verify_users'),
  updateVerificationStatus
);

export default router; 
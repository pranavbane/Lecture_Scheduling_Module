import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
} from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all users (admin only)
router.get('/', authorize('admin'), getUsers);

// Get single user (admin only)
router.get('/:id', authorize('admin'), getUserById);

// Update user (self or admin)
router.put('/:id', upload.single('profilePhoto'), updateUser);

// Update user role (admin only)
router.put('/:id/role', authorize('admin'), updateUserRole);

// Toggle user status (admin only)
router.put('/:id/toggle-status', authorize('admin'), toggleUserStatus);

// Delete user (admin only)
router.delete('/:id', authorize('admin'), deleteUser);

export default router;
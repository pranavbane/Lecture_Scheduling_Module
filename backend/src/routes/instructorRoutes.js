import express from 'express';
import {
  createInstructor,
  getInstructors,
  getInstructor,
  updateInstructor,
  deleteInstructor,
  getInstructorDashboard,
} from '../controllers/instructorController.js';
import { protect, authorize } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin only routes
router.route('/')
  .get(authorize('admin'), getInstructors) // Get all instructors - admin only
  .post(authorize('admin'), upload.single('profilePhoto'), createInstructor); // Create instructor - admin only

// ✅ FIX: Allow instructors to update their own profile
router.route('/:id')
  .get(authorize('admin'), getInstructor) // Get single instructor - admin only
  .put(upload.single('profilePhoto'), updateInstructor) // ✅ Remove admin restriction
  .delete(authorize('admin'), deleteInstructor); // Delete instructor - admin only

// Instructor dashboard - accessible by instructor or admin
router.get('/dashboard/:id?', getInstructorDashboard);

export default router;
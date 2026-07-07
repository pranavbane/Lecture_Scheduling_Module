// backend/src/routes/instructorRoutes.js
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

router.use(protect);

router.route('/')
  .get(authorize('admin'), getInstructors)
  .post(authorize('admin'), upload.single('profilePhoto'), createInstructor);

router.route('/:id')
  .get(authorize('admin'), getInstructor)
  .put(authorize('admin'), upload.single('profilePhoto'), updateInstructor)
  .delete(authorize('admin'), deleteInstructor);

// ✅ Make sure this route is defined correctly
router.get('/dashboard/:id?', getInstructorDashboard);

export default router;
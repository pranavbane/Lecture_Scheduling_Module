import express from 'express';
import {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js';
import { protect, authorize } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getCourses)
  .post(authorize('admin'), upload.single('thumbnail'), createCourse);

router.route('/:id')
  .get(getCourse)
  .put(authorize('admin'), upload.single('thumbnail'), updateCourse)
  .delete(authorize('admin'), deleteCourse);

export default router;
import express from 'express';
import {
  createLecture,
  getLectures,
  getLecture,
  updateLecture,
  cancelLecture,
  deleteLecture,
} from '../controllers/lectureController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getLectures)
  .post(authorize('admin'), createLecture);

router.route('/:id')
  .get(getLecture)
  .put(authorize('admin'), updateLecture)
  .delete(authorize('admin'), deleteLecture);

router.put('/:id/cancel', authorize('admin'), cancelLecture);

export default router;
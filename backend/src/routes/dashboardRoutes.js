import express from 'express';
import {
  getAdminDashboard,
  getCalendarEvents,
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.get('/admin', authorize('admin'), getAdminDashboard);
router.get('/calendar', getCalendarEvents);

export default router;
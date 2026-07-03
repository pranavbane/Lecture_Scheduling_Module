import Course from '../models/Course.js';
import User from '../models/User.js';
import Lecture from '../models/Lecture.js';
import Notification from '../models/Notification.js';

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Private/Admin
export const getAdminDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const totalCourses = await Course.countDocuments();
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalLectures = await Lecture.countDocuments();
    const upcomingLectures = await Lecture.countDocuments({
      status: 'upcoming',
      lectureDate: { $gte: today },
    });

    const recentLectures = await Lecture.find()
      .populate('course', 'name')
      .populate('instructor', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const todayLectures = await Lecture.find({
      lectureDate: { $gte: today, $lt: tomorrow },
      status: { $ne: 'cancelled' },
    })
    .populate('course', 'name')
    .populate('instructor', 'name');

    const recentActivities = await Notification.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        statistics: {
          totalCourses,
          totalInstructors,
          totalLectures,
          upcomingLectures,
        },
        recentLectures,
        todayLectures,
        recentActivities,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get calendar events
// @route   GET /api/dashboard/calendar
// @access  Private
export const getCalendarEvents = async (req, res) => {
  try {
    const query = {};
    
    if (req.user.role === 'instructor') {
      query.instructor = req.user.id;
    }

    const lectures = await Lecture.find(query)
      .populate('course', 'name')
      .populate('instructor', 'name');

    const events = lectures.map(lecture => {
      const startDateTime = new Date(lecture.lectureDate);
      const [startHours, startMinutes] = lecture.startTime.split(':');
      startDateTime.setHours(parseInt(startHours), parseInt(startMinutes));

      const endDateTime = new Date(lecture.lectureDate);
      const [endHours, endMinutes] = lecture.endTime.split(':');
      endDateTime.setHours(parseInt(endHours), parseInt(endMinutes));

      let color = '#3B82F6';
      if (lecture.status === 'completed') {
        color = '#10B981';
      } else if (lecture.status === 'cancelled') {
        color = '#EF4444';
      }

      return {
        id: lecture._id,
        title: `${lecture.batchName} - ${lecture.course.name}`,
        start: startDateTime,
        end: endDateTime,
        color: color,
        extendedProps: {
          batchName: lecture.batchName,
          course: lecture.course.name,
          instructor: lecture.instructor.name,
          roomNumber: lecture.roomNumber,
          meetingLink: lecture.meetingLink,
          status: lecture.status,
        },
      };
    });

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
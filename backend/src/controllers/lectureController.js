import Lecture from '../models/Lecture.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import transporter from '../config/email.js';

// Helper function to check overlapping lectures
const checkOverlappingLecture = async (instructorId, lectureDate, startTime, endTime, excludeId = null) => {
  const query = {
    instructor: instructorId,
    lectureDate: new Date(lectureDate),
    status: { $ne: 'cancelled' },
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const overlapping = await Lecture.findOne({
    ...query,
    $or: [
      { startTime: { $lte: startTime }, endTime: { $gt: startTime } },
      { startTime: { $lt: endTime }, endTime: { $gte: endTime } },
      { startTime: { $gte: startTime }, endTime: { $lte: endTime } },
    ],
  });

  return overlapping;
};

// @desc    Create lecture
// @route   POST /api/lectures
// @access  Private/Admin
export const createLecture = async (req, res) => {
  try {
    const {
      batchName,
      course,
      instructor,
      startDate,
      endDate,
      lectureDate,
      startTime,
      endTime,
      roomNumber,
      meetingLink,
    } = req.body;

    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    const instructorExists = await User.findById(instructor);
    if (!instructorExists || instructorExists.role !== 'instructor') {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found',
      });
    }

    const overlapping = await checkOverlappingLecture(instructor, lectureDate, startTime, endTime);
    if (overlapping) {
      return res.status(400).json({
        success: false,
        message: `Instructor already has a lecture at this time (${overlapping.batchName})`,
      });
    }

    const lecture = await Lecture.create({
      batchName,
      course,
      instructor,
      startDate,
      endDate,
      lectureDate,
      startTime,
      endTime,
      roomNumber,
      meetingLink: meetingLink || null,
      createdBy: req.user.id,
    });

    await Notification.create({
      user: instructor,
      type: 'lecture_assigned',
      message: `You have been assigned to teach "${batchName}" for ${courseExists.name}`,
      relatedId: lecture._id,
    });

    const populatedLecture = await Lecture.findById(lecture._id)
      .populate('course', 'name')
      .populate('instructor', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedLecture,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all lectures
// @route   GET /api/lectures
// @access  Private
export const getLectures = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const course = req.query.course || '';
    const instructor = req.query.instructor || '';
    const status = req.query.status || '';
    const startDate = req.query.startDate || '';
    const endDate = req.query.endDate || '';

    const query = {};
    if (search) {
      query.batchName = { $regex: search, $options: 'i' };
    }
    if (course) {
      query.course = course;
    }
    if (instructor) {
      query.instructor = instructor;
    }
    if (status) {
      query.status = status;
    }
    if (startDate && endDate) {
      query.lectureDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (req.user.role === 'instructor') {
      query.instructor = req.user.id;
    }

    const lectures = await Lecture.find(query)
      .populate('course', 'name level')
      .populate('instructor', 'name email')
      .populate('createdBy', 'name email')
      .sort({ lectureDate: 1, startTime: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Lecture.countDocuments(query);

    res.status(200).json({
      success: true,
      data: lectures,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single lecture
// @route   GET /api/lectures/:id
// @access  Private
export const getLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id)
      .populate('course', 'name level')
      .populate('instructor', 'name email')
      .populate('createdBy', 'name email');

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found',
      });
    }

    if (req.user.role === 'instructor' && lecture.instructor._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this lecture',
      });
    }

    res.status(200).json({
      success: true,
      data: lecture,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update lecture
// @route   PUT /api/lectures/:id
// @access  Private/Admin
export const updateLecture = async (req, res) => {
  try {
    let lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found',
      });
    }

    if (req.body.instructor || req.body.lectureDate || req.body.startTime || req.body.endTime) {
      const instructorId = req.body.instructor || lecture.instructor;
      const lectureDate = req.body.lectureDate || lecture.lectureDate;
      const startTime = req.body.startTime || lecture.startTime;
      const endTime = req.body.endTime || lecture.endTime;

      const overlapping = await checkOverlappingLecture(
        instructorId,
        lectureDate,
        startTime,
        endTime,
        lecture._id
      );

      if (overlapping) {
        return res.status(400).json({
          success: false,
          message: `Instructor already has a lecture at this time (${overlapping.batchName})`,
        });
      }
    }

    lecture = await Lecture.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    .populate('course', 'name')
    .populate('instructor', 'name email')
    .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      data: lecture,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Cancel lecture
// @route   PUT /api/lectures/:id/cancel
// @access  Private/Admin
export const cancelLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id)
      .populate('course', 'name')
      .populate('instructor', 'name email');

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found',
      });
    }

    if (lecture.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Lecture is already cancelled',
      });
    }

    lecture.status = 'cancelled';
    await lecture.save();

    await Notification.create({
      user: lecture.instructor._id,
      type: 'lecture_cancelled',
      message: `Lecture "${lecture.batchName}" for ${lecture.course.name} has been cancelled`,
      relatedId: lecture._id,
    });

    res.status(200).json({
      success: true,
      message: 'Lecture cancelled successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete lecture
// @route   DELETE /api/lectures/:id
// @access  Private/Admin
export const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found',
      });
    }

    await lecture.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Lecture deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
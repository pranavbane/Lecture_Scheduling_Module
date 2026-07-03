import Course from '../models/Course.js';
import Lecture from '../models/Lecture.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req, res) => {
  try {
    const { name, level, description, duration, status } = req.body;

    let thumbnail = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      thumbnail = result.secure_url;
    }

    const course = await Course.create({
      name,
      level,
      description,
      duration,
      status: status || 'active',
      thumbnail,
      createdBy: req.user.id,
    });

    const populatedCourse = await Course.findById(course._id)
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedCourse,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
export const getCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || '';

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (status) {
      query.status = status;
    }

    const courses = await Course.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Course.countDocuments(query);

    const coursesWithCount = await Promise.all(courses.map(async (course) => {
      const lectureCount = await Lecture.countDocuments({ course: course._id });
      return {
        ...course.toObject(),
        lectureCount,
      };
    }));

    res.status(200).json({
      success: true,
      data: coursesWithCount,
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

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Private
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    if (req.file) {
      if (course.thumbnail) {
        const publicId = course.thumbnail.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      const result = await cloudinary.uploader.upload(req.file.path);
      req.body.thumbnail = result.secure_url;
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    const lectureCount = await Lecture.countDocuments({ course: course._id });
    if (lectureCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete course with ${lectureCount} existing lectures. Delete the lectures first.`,
      });
    }

    if (course.thumbnail) {
      const publicId = course.thumbnail.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
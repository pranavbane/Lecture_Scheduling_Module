import User from '../models/User.js';
import Lecture from '../models/Lecture.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Create instructor
// @route   POST /api/instructors
// @access  Private/Admin
export const createInstructor = async (req, res) => {
  try {
    const { name, email, password, phone, qualification, department, availability } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    let profilePhoto = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      profilePhoto = result.secure_url;
    }

    const instructor = await User.create({
      name,
      email,
      password,
      role: 'instructor',
      profilePhoto,
      phone,
      qualification,
      department,
      availability: availability || 'available',
    });

    res.status(201).json({
      success: true,
      data: instructor,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all instructors
// @route   GET /api/instructors
// @access  Private/Admin
export const getInstructors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const availability = req.query.availability || '';
    const department = req.query.department || '';

    const query = { role: 'instructor' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (availability) {
      query.availability = availability;
    }
    if (department) {
      query.department = { $regex: department, $options: 'i' };
    }

    const instructors = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    const instructorsWithCount = await Promise.all(instructors.map(async (instructor) => {
      const lectureCount = await Lecture.countDocuments({ instructor: instructor._id });
      return {
        ...instructor.toObject(),
        lectureCount,
      };
    }));

    res.status(200).json({
      success: true,
      data: instructorsWithCount,
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

// @desc    Get single instructor
// @route   GET /api/instructors/:id
// @access  Private/Admin
export const getInstructor = async (req, res) => {
  try {
    const instructor = await User.findById(req.params.id)
      .select('-password');

    if (!instructor || instructor.role !== 'instructor') {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found',
      });
    }

    res.status(200).json({
      success: true,
      data: instructor,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update instructor
// @route   PUT /api/instructors/:id
// @access  Private/Admin
export const updateInstructor = async (req, res) => {
  try {
    let instructor = await User.findById(req.params.id);

    if (!instructor || instructor.role !== 'instructor') {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found',
      });
    }

    if (req.file) {
      if (instructor.profilePhoto) {
        const publicId = instructor.profilePhoto.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      const result = await cloudinary.uploader.upload(req.file.path);
      req.body.profilePhoto = result.secure_url;
    }

    delete req.body.password;

    instructor = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.status(200).json({
      success: true,
      data: instructor,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete instructor
// @route   DELETE /api/instructors/:id
// @access  Private/Admin
export const deleteInstructor = async (req, res) => {
  try {
    const instructor = await User.findById(req.params.id);

    if (!instructor || instructor.role !== 'instructor') {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found',
      });
    }

    const lectureCount = await Lecture.countDocuments({ instructor: instructor._id });
    if (lectureCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete instructor with ${lectureCount} assigned lectures.`,
      });
    }

    if (instructor.profilePhoto) {
      const publicId = instructor.profilePhoto.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await instructor.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Instructor deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get instructor dashboard stats
// @route   GET /api/instructors/dashboard/:id
// @access  Private
export const getInstructorDashboard = async (req, res) => {
  try {
    const instructorId = req.params.id || req.user.id;
    
    const instructor = await User.findById(instructorId);
    if (!instructor || instructor.role !== 'instructor') {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found',
      });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const lectures = await Lecture.find({ 
      instructor: instructorId,
      status: { $ne: 'cancelled' }
    }).populate('course', 'name');

    const todayLectures = lectures.filter(lecture => {
      const lectureDate = new Date(lecture.lectureDate);
      return lectureDate >= today && lectureDate < tomorrow;
    });

    const upcomingLectures = lectures.filter(lecture => {
      const lectureDate = new Date(lecture.lectureDate);
      return lectureDate >= tomorrow && lecture.status === 'upcoming';
    });

    const pastLectures = lectures.filter(lecture => {
      const lectureDate = new Date(lecture.lectureDate);
      return lectureDate < today || lecture.status === 'completed';
    });

    res.status(200).json({
      success: true,
      data: {
        totalLectures: lectures.length,
        todayLectures: todayLectures.length,
        upcomingLectures: upcomingLectures.length,
        pastLectures: pastLectures.length,
        todayLecturesList: todayLectures,
        upcomingLecturesList: upcomingLectures.slice(0, 5),
        pastLecturesList: pastLectures.slice(0, 5),
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
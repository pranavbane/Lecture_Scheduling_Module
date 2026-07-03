import { body, validationResult } from 'express-validator';

// Validate email
export const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  // At least 6 characters, contains at least one letter and one number
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return re.test(password);
};

// Validate phone number
export const validatePhone = (phone) => {
  const re = /^\+?[\d\s-]{10,}$/;
  return re.test(phone);
};

// Validate URL
export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate date format YYYY-MM-DD
export const validateDate = (date) => {
  const re = /^\d{4}-\d{2}-\d{2}$/;
  if (!re.test(date)) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

// Validate time format HH:MM
export const validateTime = (time) => {
  const re = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return re.test(time);
};

// Validation middleware
export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  };
};

// Custom validators for specific fields
export const userValidationRules = {
  register: [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['admin', 'instructor']).withMessage('Invalid role'),
  ],
  login: [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  updateProfile: [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  ],
  changePassword: [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
};

export const courseValidationRules = {
  create: [
    body('name').notEmpty().withMessage('Course name is required'),
    body('level').isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert']).withMessage('Invalid level'),
    body('description').notEmpty().withMessage('Description is required'),
    body('duration').notEmpty().withMessage('Duration is required'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
  ],
  update: [
    body('name').optional().notEmpty().withMessage('Course name cannot be empty'),
    body('level').optional().isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert']).withMessage('Invalid level'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
  ],
};

export const lectureValidationRules = {
  create: [
    body('batchName').notEmpty().withMessage('Batch name is required'),
    body('course').isMongoId().withMessage('Invalid course ID'),
    body('instructor').isMongoId().withMessage('Invalid instructor ID'),
    body('startDate').isISO8601().withMessage('Invalid start date'),
    body('endDate').isISO8601().withMessage('Invalid end date'),
    body('lectureDate').isISO8601().withMessage('Invalid lecture date'),
    body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid start time format'),
    body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid end time format'),
    body('roomNumber').notEmpty().withMessage('Room number is required'),
    body('meetingLink').optional().isURL().withMessage('Invalid meeting link URL'),
  ],
};
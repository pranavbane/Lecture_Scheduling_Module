import { validationResult, body, query, param } from 'express-validator';

// Validation middleware
export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
    }));

    res.status(400).json({
      success: false,
      errors: extractedErrors,
    });
  };
};

// Common validations
export const commonValidations = {
  id: param('id').isMongoId().withMessage('Invalid ID format'),
  page: query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  limit: query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  search: query('search').optional().isString().trim().escape(),
};

// Auth validations
export const authValidations = {
  register: [
    body('name').notEmpty().withMessage('Name is required').trim().escape(),
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['admin', 'instructor']).withMessage('Invalid role'),
  ],
  login: [
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  changePassword: [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  resetPassword: [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
};

// Course validations
export const courseValidations = {
  create: [
    body('name').notEmpty().withMessage('Course name is required').trim().escape(),
    body('level').isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert']).withMessage('Invalid level'),
    body('description').notEmpty().withMessage('Description is required').trim().escape(),
    body('duration').notEmpty().withMessage('Duration is required').trim().escape(),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
  ],
  update: [
    body('name').optional().notEmpty().withMessage('Name cannot be empty').trim().escape(),
    body('level').optional().isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert']).withMessage('Invalid level'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
  ],
};

// Instructor validations
export const instructorValidations = {
  create: [
    body('name').notEmpty().withMessage('Name is required').trim().escape(),
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
    body('qualification').optional().trim().escape(),
    body('department').optional().trim().escape(),
    body('availability').optional().isIn(['available', 'unavailable']).withMessage('Invalid availability'),
  ],
  update: [
    body('name').optional().notEmpty().withMessage('Name cannot be empty').trim().escape(),
    body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
    body('qualification').optional().trim().escape(),
    body('department').optional().trim().escape(),
    body('availability').optional().isIn(['available', 'unavailable']).withMessage('Invalid availability'),
  ],
};

// Lecture validations
export const lectureValidations = {
  create: [
    body('batchName').notEmpty().withMessage('Batch name is required').trim().escape(),
    body('course').isMongoId().withMessage('Invalid course ID'),
    body('instructor').isMongoId().withMessage('Invalid instructor ID'),
    body('startDate').isISO8601().withMessage('Invalid start date'),
    body('endDate').isISO8601().withMessage('Invalid end date'),
    body('lectureDate').isISO8601().withMessage('Invalid lecture date'),
    body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid start time'),
    body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid end time'),
    body('roomNumber').notEmpty().withMessage('Room number is required').trim().escape(),
    body('meetingLink').optional().isURL().withMessage('Invalid meeting link'),
  ],
  update: [
    body('batchName').optional().notEmpty().withMessage('Batch name cannot be empty').trim().escape(),
    body('course').optional().isMongoId().withMessage('Invalid course ID'),
    body('instructor').optional().isMongoId().withMessage('Invalid instructor ID'),
    body('status').optional().isIn(['upcoming', 'completed', 'cancelled']).withMessage('Invalid status'),
  ],
};
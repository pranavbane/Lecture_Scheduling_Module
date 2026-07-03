// User roles
export const ROLES = {
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor',
};

// User availability
export const AVAILABILITY = {
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable',
};

// Course levels
export const COURSE_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  EXPERT: 'Expert',
};

// Course status
export const COURSE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

// Lecture status
export const LECTURE_STATUS = {
  UPCOMING: 'upcoming',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Notification types
export const NOTIFICATION_TYPES = {
  LECTURE_ASSIGNED: 'lecture_assigned',
  LECTURE_UPDATED: 'lecture_updated',
  LECTURE_CANCELLED: 'lecture_cancelled',
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// File upload limits
export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
};

// Email templates paths
export const EMAIL_TEMPLATES = {
  LECTURE_ASSIGNED: 'lecture-assigned',
  LECTURE_UPDATED: 'lecture-updated',
  LECTURE_CANCELLED: 'lecture-cancelled',
  PASSWORD_RESET: 'password-reset',
  WELCOME: 'welcome',
};

// API endpoints (for frontend reference)
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    CHANGE_PASSWORD: '/api/auth/change-password',
    ME: '/api/auth/me',
  },
  COURSES: {
    BASE: '/api/courses',
    GET_ALL: '/api/courses',
    CREATE: '/api/courses',
    GET_ONE: '/api/courses/:id',
    UPDATE: '/api/courses/:id',
    DELETE: '/api/courses/:id',
  },
  INSTRUCTORS: {
    BASE: '/api/instructors',
    GET_ALL: '/api/instructors',
    CREATE: '/api/instructors',
    GET_ONE: '/api/instructors/:id',
    UPDATE: '/api/instructors/:id',
    DELETE: '/api/instructors/:id',
    DASHBOARD: '/api/instructors/dashboard/:id',
  },
  LECTURES: {
    BASE: '/api/lectures',
    GET_ALL: '/api/lectures',
    CREATE: '/api/lectures',
    GET_ONE: '/api/lectures/:id',
    UPDATE: '/api/lectures/:id',
    DELETE: '/api/lectures/:id',
    CANCEL: '/api/lectures/:id/cancel',
  },
  DASHBOARD: {
    ADMIN: '/api/dashboard/admin',
    CALENDAR: '/api/dashboard/calendar',
  },
};

// Error messages
export const ERROR_MESSAGES = {
  // Auth errors
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  USER_EXISTS: 'User already exists',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  INVALID_TOKEN: 'Invalid or expired token',
  TOKEN_REQUIRED: 'Authentication token is required',
  
  // Validation errors
  INVALID_INPUT: 'Invalid input data',
  INVALID_EMAIL: 'Please provide a valid email address',
  INVALID_PASSWORD: 'Password must be at least 6 characters',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  
  // Course errors
  COURSE_NOT_FOUND: 'Course not found',
  COURSE_EXISTS: 'Course already exists',
  COURSE_HAS_LECTURES: 'Cannot delete course with existing lectures',
  
  // Instructor errors
  INSTRUCTOR_NOT_FOUND: 'Instructor not found',
  INSTRUCTOR_HAS_LECTURES: 'Cannot delete instructor with assigned lectures',
  INSTRUCTOR_UNAVAILABLE: 'Instructor is currently unavailable',
  
  // Lecture errors
  LECTURE_NOT_FOUND: 'Lecture not found',
  LECTURE_OVERLAP: 'Instructor already has a lecture at this time',
  LECTURE_CONFLICT: 'Lecture time conflicts with existing schedule',
  LECTURE_ALREADY_CANCELLED: 'Lecture is already cancelled',
  
  // Database errors
  DB_CONNECTION_FAILED: 'Database connection failed',
  DB_OPERATION_FAILED: 'Database operation failed',
  
  // File upload errors
  FILE_UPLOAD_FAILED: 'File upload failed',
  FILE_TOO_LARGE: 'File size exceeds limit',
  FILE_TYPE_NOT_ALLOWED: 'File type not allowed',
  
  // Email errors
  EMAIL_SEND_FAILED: 'Failed to send email',
  EMAIL_TEMPLATE_ERROR: 'Email template error',
};

// Success messages
export const SUCCESS_MESSAGES = {
  // Auth
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Registration successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  PASSWORD_RESET_SENT: 'Password reset email sent',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  
  // Courses
  COURSE_CREATED: 'Course created successfully',
  COURSE_UPDATED: 'Course updated successfully',
  COURSE_DELETED: 'Course deleted successfully',
  
  // Instructors
  INSTRUCTOR_CREATED: 'Instructor created successfully',
  INSTRUCTOR_UPDATED: 'Instructor updated successfully',
  INSTRUCTOR_DELETED: 'Instructor deleted successfully',
  
  // Lectures
  LECTURE_CREATED: 'Lecture scheduled successfully',
  LECTURE_UPDATED: 'Lecture updated successfully',
  LECTURE_CANCELLED: 'Lecture cancelled successfully',
  LECTURE_DELETED: 'Lecture deleted successfully',
  
  // Email
  EMAIL_SENT: 'Email sent successfully',
  EMAIL_VERIFIED: 'Email verified successfully',
};

// Export all constants
export default {
  ROLES,
  AVAILABILITY,
  COURSE_LEVELS,
  COURSE_STATUS,
  LECTURE_STATUS,
  NOTIFICATION_TYPES,
  HTTP_STATUS,
  PAGINATION,
  UPLOAD,
  EMAIL_TEMPLATES,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};
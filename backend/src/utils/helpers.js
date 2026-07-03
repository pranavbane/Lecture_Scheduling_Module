import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Generate random token
export const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Hash data
export const hashData = async (data) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(data, salt);
};

// Compare hashed data
export const compareData = async (data, hashedData) => {
  return await bcrypt.compare(data, hashedData);
};

// Format date to readable string
export const formatDate = (date, format = 'MM/DD/YYYY') => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  switch (format) {
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'full':
      return `${month}/${day}/${year} ${hours}:${minutes}`;
    default:
      return `${month}/${day}/${year}`;
  }
};

// Check if two time ranges overlap
export const isTimeOverlapping = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

// Get time difference in minutes
export const getTimeDifference = (start, end) => {
  const [startHours, startMinutes] = start.split(':').map(Number);
  const [endHours, endMinutes] = end.split(':').map(Number);
  const startTotal = startHours * 60 + startMinutes;
  const endTotal = endHours * 60 + endMinutes;
  return endTotal - startTotal;
};

// Validate lecture time
export const isValidLectureTime = (startTime, endTime) => {
  const diff = getTimeDifference(startTime, endTime);
  return diff > 0 && diff <= 480; // Max 8 hours
};

// Pagination helper
export const paginate = (page = 1, limit = 10) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// Build search query
export const buildSearchQuery = (search, fields) => {
  if (!search) return {};
  const searchRegex = { $regex: search, $options: 'i' };
  const query = [];
  fields.forEach(field => {
    query.push({ [field]: searchRegex });
  });
  return { $or: query };
};

// Sanitize input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

// Generate random password
export const generateRandomPassword = (length = 10) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

// Mask email
export const maskEmail = (email) => {
  const [username, domain] = email.split('@');
  if (username.length <= 3) return email;
  const masked = username.slice(0, 2) + '***' + username.slice(-1);
  return `${masked}@${domain}`;
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Get current date range
export const getDateRange = (range) => {
  const now = new Date();
  const start = new Date();
  const end = new Date();

  switch (range) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
      break;
    default:
      return { start: null, end: null };
  }

  return { start, end };
};

// Export as object
export default {
  generateToken,
  hashData,
  compareData,
  formatDate,
  isTimeOverlapping,
  getTimeDifference,
  isValidLectureTime,
  paginate,
  buildSearchQuery,
  sanitizeInput,
  generateRandomPassword,
  maskEmail,
  truncateText,
  getDateRange
};
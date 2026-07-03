import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Verify connection
const verifyCloudinary = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connected successfully');
    return result;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    throw error;
  }
};

// Upload image
const uploadImage = async (file, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: options.folder || 'college-lecture-scheduler',
      transformation: options.transformation || [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ],
      ...options
    });
    return result;
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    throw error;
  }
};

// Delete image
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error);
    throw error;
  }
};

// Get image URL with transformations
const getImageUrl = (publicId, transformations = {}) => {
  return cloudinary.url(publicId, {
    transformation: transformations,
    secure: true,
  });
};

// Upload multiple images
const uploadMultipleImages = async (files, options = {}) => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, options));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('❌ Cloudinary multiple upload error:', error);
    throw error;
  }
};

export {
  cloudinary,
  verifyCloudinary,
  uploadImage,
  deleteImage,
  getImageUrl,
  uploadMultipleImages,
};

export default cloudinary;
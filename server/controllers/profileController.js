import Teacher from '../models/teacher.model.js';
import Student from '../models/studentModel.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for avatar upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads/avatars');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Teacher Profile Controllers
const updateTeacherProfile = async (req, res) => {
  try {
    console.log('=== Update Teacher Profile Called ===');
    console.log('req.teacher:', req.teacher);
    console.log('req.body:', req.body);
    
    const teacherId = req.teacher._id; // Use _id directly since req.teacher is the full document
    console.log('teacherId:', teacherId);
    
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated via profile
    delete updateData.password;
    delete updateData.isVerified;
    delete updateData.isAdmin;
    delete updateData.rollNo; // Don't allow rollNo to be updated
    delete updateData._id; // Don't allow _id to be updated
    delete updateData.id; // Don't allow id to be updated

    console.log('updateData after cleanup:', updateData);

    console.log('updateData after cleanup:', updateData);

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    console.log('updatedTeacher:', updatedTeacher);

    if (!updatedTeacher) {
      console.log('Teacher not found for ID:', teacherId);
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    console.log('Profile update successful');
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedTeacher
    });
  } catch (error) {
    console.error('Update teacher profile error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

const uploadTeacherAvatar = async (req, res) => {
  try {
    const teacherId = req.teacher._id;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    
    // Update teacher record with avatar URL
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { $set: { avatar: avatarUrl } },
      { new: true }
    ).select('-password');

    if (!updatedTeacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatarUrl: avatarUrl,
      data: updatedTeacher
    });
  } catch (error) {
    console.error('Upload teacher avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload avatar',
      error: error.message
    });
  }
};

const getTeacherProfile = async (req, res) => {
  try {
    const teacherId = req.teacher._id;
    
    const teacher = await Teacher.findById(teacherId).select('-password');
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.json({
      success: true,
      data: teacher
    });
  } catch (error) {
    console.error('Get teacher profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

// Admin Profile Controllers
const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.teacher._id;
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated via profile
    delete updateData.password;
    delete updateData.isVerified;
    delete updateData.isAdmin;

    const updatedAdmin = await Teacher.findByIdAndUpdate(
      adminId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      message: 'Admin profile updated successfully',
      data: updatedAdmin
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update admin profile',
      error: error.message
    });
  }
};

const uploadAdminAvatar = async (req, res) => {
  try {
    const adminId = req.teacher._id;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    
    // Update admin record with avatar URL
    const updatedAdmin = await Teacher.findByIdAndUpdate(
      adminId,
      { $set: { avatar: avatarUrl } },
      { new: true }
    ).select('-password');

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      message: 'Admin avatar uploaded successfully',
      avatarUrl: avatarUrl,
      data: updatedAdmin
    });
  } catch (error) {
    console.error('Upload admin avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload admin avatar',
      error: error.message
    });
  }
};

const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.teacher._id;
    
    const admin = await Teacher.findById(adminId).select('-password');
    
    if (!admin || !admin.isAdmin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get admin profile',
      error: error.message
    });
  }
};

// Change Password (for both teacher and admin)
const changePassword = async (req, res) => {
  try {
    const userId = req.teacher._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    const user = await Teacher.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};

export default {
  // Teacher profile methods
  updateTeacherProfile,
  uploadTeacherAvatar: [upload.single('avatar'), uploadTeacherAvatar],
  getTeacherProfile,
  
  // Admin profile methods
  updateAdminProfile,
  uploadAdminAvatar: [upload.single('avatar'), uploadAdminAvatar],
  getAdminProfile,
  
  // Common methods
  changePassword
};
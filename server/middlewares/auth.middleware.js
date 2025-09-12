import jwt from 'jsonwebtoken';
import Teacher from '../models/teacher.model.js';

// Middleware to verify JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      console.error('JWT Middleware: No token found in Authorization header');
      return res.status(401).json({ message: 'Access token required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('JWT Middleware: Token verification failed:', err.message);
      return res.status(401).json({ message: 'Invalid token', error: err.message });
    }

    const teacher = await Teacher.findById(decoded.id).select('-password');
    if (!teacher) {
      console.error('JWT Middleware: No teacher found for decoded id', decoded.id);
      return res.status(401).json({ message: 'Invalid token: teacher not found', decoded });
    }

    if (!teacher.isActive) {
      console.error('JWT Middleware: Teacher account is deactivated', teacher._id);
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    req.teacher = teacher;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if teacher is verified
export const requireVerification = async (req, res, next) => {
  try {
    if (!req.teacher.isVerified) {
      return res.status(403).json({ 
        message: 'Account not verified. Please wait for admin verification.' 
      });
    }
    next();
  } catch (error) {
    console.error('Verification middleware error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to check if teacher is admin
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.teacher.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Combined middleware for verified teachers
export const requireVerifiedTeacher = [authenticateToken, requireVerification];

// Combined middleware for admin access
export const requireAdminAccess = [authenticateToken, requireAdmin];

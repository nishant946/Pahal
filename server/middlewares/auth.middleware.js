const jwt = require('jsonwebtoken');
const config = require('../config/db');
const Teacher = require('../models/teacher.model');

exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    const teacher = await Teacher.findById(decoded.id);

    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token'
      });
    }

    // Add teacher info to request
    req.user = {
      id: teacher._id,
      employeeId: teacher.employeeId,
      isAdmin: teacher.isAdmin
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid authentication token'
    });
  }
};

exports.requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

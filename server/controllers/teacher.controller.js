const Teacher = require('../models/teacher.model');
const jwt = require('jsonwebtoken');
const config = require('../config/db');

exports.login = async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    // Find teacher by employee ID
    const teacher = await Teacher.findOne({ employeeId });
    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: 'Invalid employee ID or password'
      });
    }

    // Check password
    const isPasswordValid = await teacher.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid employee ID or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: teacher._id,
        employeeId: teacher.employeeId,
        isAdmin: teacher.isAdmin 
      },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        employeeId: teacher.employeeId,
        department: teacher.department,
        email: teacher.email,
        designation: teacher.designation,
        isAdmin: teacher.isAdmin
      }
    });
  } catch (error) {
    console.error('Teacher login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.register = async (req, res) => {
  try {
    // Only admin teachers can register new teachers
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can register new teachers'
      });
    }

    const {
      name,
      employeeId,
      password,
      department,
      designation,
      email,
      phone,
      subjects,
      qualification,
      joiningDate,
      isAdmin
    } = req.body;

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({
      $or: [{ employeeId }, { email }]
    });

    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: 'Teacher with this employee ID or email already exists'
      });
    }

    // Create new teacher
    const teacher = new Teacher({
      name,
      employeeId,
      password,
      department,
      designation,
      email,
      phone,
      subjects,
      qualification,
      joiningDate,
      isAdmin: isAdmin || false
    });

    await teacher.save();

    res.status(201).json({
      success: true,
      message: 'Teacher registered successfully',
      teacher: {
        id: teacher._id,
        name: teacher.name,
        employeeId: teacher.employeeId,
        department: teacher.department,
        email: teacher.email,
        designation: teacher.designation
      }
    });
  } catch (error) {
    console.error('Teacher registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.json({
      success: true,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        employeeId: teacher.employeeId,
        department: teacher.department,
        email: teacher.email,
        designation: teacher.designation,
        phone: teacher.phone,
        subjects: teacher.subjects,
        qualification: teacher.qualification,
        joiningDate: teacher.joiningDate,
        isAdmin: teacher.isAdmin
      }
    });
  } catch (error) {
    console.error('Get teacher profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

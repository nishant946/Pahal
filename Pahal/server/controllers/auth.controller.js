const Teacher = require('../models/teacher.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find teacher by email
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, teacher.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if teacher is verified (except for admin)
    if (!teacher.isAdmin && !teacher.isVerified) {
      return res.status(403).json({ message: 'Account pending verification' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: teacher._id,
        isAdmin: teacher.isAdmin 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user info and token
    res.json({
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        isAdmin: teacher.isAdmin,
        isVerified: teacher.isVerified
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add an admin user (use this only once to create the first admin)
exports.createAdmin = async (req, res) => {
  try {
    const adminExists = await Teacher.findOne({ isAdmin: true });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    const admin = new Teacher({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      isAdmin: true,
      isVerified: true
    });

    await admin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

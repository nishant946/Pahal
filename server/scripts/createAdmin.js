import mongoose from 'mongoose';
import Teacher from '../models/teacher.model.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Teacher.findOne({ email: 'admin@school.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
      console.log('Email: admin@school.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create admin teacher
    const adminTeacher = new Teacher({
      rollNo: 'ADMIN001',
      name: 'System Administrator',
      mobileNo: '1234567890',
      email: 'admin@school.com',
      department: 'Administration',
      preferredDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      subjectChoices: ['Administration'],
      designation: 'Administrator',
      password: 'admin123',
      isVerified: true,
      isAdmin: true,
      isActive: true
    });

    await adminTeacher.save();
    console.log('Admin teacher created successfully');
    console.log('Email: admin@school.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    
    // If it's a duplicate key error, the admin might already exist
    if (error.code === 11000) {
      console.log('Admin might already exist. Trying to find existing admin...');
      try {
        const existingAdmin = await Teacher.findOne({ email: 'admin@school.com' });
        if (existingAdmin) {
          console.log('Admin found in database:');
          console.log('Email: admin@school.com');
          console.log('Password: admin123');
        }
      } catch (findError) {
        console.error('Error finding existing admin:', findError.message);
      }
    }
    
    process.exit(1);
  }
};

createAdmin();

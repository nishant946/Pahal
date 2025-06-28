import mongoose from 'mongoose';
import Teacher from '../models/teacher.model.js';
import dotenv from 'dotenv';

dotenv.config();

const createVerifiedTeacher = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if verified teacher already exists
    const existingTeacher = await Teacher.findOne({ email: 'teacher@example.com' });
    if (existingTeacher) {
      console.log('Verified teacher already exists');
      console.log('Email: teacher@example.com');
      console.log('Password: password123');
      console.log('isVerified:', existingTeacher.isVerified);
      console.log('isAdmin:', existingTeacher.isAdmin);
      process.exit(0);
    }

    // Create new verified teacher
    const verifiedTeacher = new Teacher({
      rollNo: 'TEACHER001',
      name: 'John Doe',
      mobileNo: '9876543210',
      email: 'teacher@example.com',
      department: 'Computer Science',
      preferredDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      subjectChoices: ['Programming', 'Data Structures'],
      designation: 'Assistant Professor',
      password: 'password123',
      isVerified: true,
      isAdmin: false,
      isActive: true
    });

    await verifiedTeacher.save();
    console.log('Verified teacher created successfully');
    console.log('Email: teacher@example.com');
    console.log('Password: password123');
    console.log('isVerified: true');
    console.log('isAdmin: false');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating verified teacher:', error.message);
    process.exit(1);
  }
};

createVerifiedTeacher(); 
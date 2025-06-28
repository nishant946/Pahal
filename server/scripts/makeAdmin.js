import mongoose from 'mongoose';
import Teacher from '../models/teacher.model.js';
import dotenv from 'dotenv';

dotenv.config();

const makeAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find the existing teacher
    const teacher = await Teacher.findOne({ email: 'aarti.sharma@college.edu' });
    if (!teacher) {
      console.log('Teacher not found');
      process.exit(1);
    }

    // Update to admin
    teacher.isAdmin = true;
    teacher.isVerified = true;
    await teacher.save();

    console.log('Teacher updated to admin successfully');
    console.log(`Email: ${teacher.email}`);
    console.log('Name:', teacher.name);
    console.log('Admin: true');
    console.log('Verified: true');
    
    process.exit(0);
  } catch (error) {
    console.error('Error making admin:', error.message);
    process.exit(1);
  }
};

makeAdmin(); 
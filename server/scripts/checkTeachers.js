import mongoose from 'mongoose';
import Teacher from '../models/teacher.model.js';
import dotenv from 'dotenv';

dotenv.config();

const checkTeachers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all teachers
    const teachers = await Teacher.find({});
    console.log(`Found ${teachers.length} teachers in database:`);
    
    teachers.forEach((teacher, index) => {
      console.log(`${index + 1}. ${teacher.name} (${teacher.email}) - Admin: ${teacher.isAdmin}, Verified: ${teacher.isVerified}`);
    });

    // Check for admin
    const admin = await Teacher.findOne({ isAdmin: true });
    if (admin) {
      console.log('\nAdmin found:');
      console.log(`Email: ${admin.email}`);
      console.log('Password: admin123 (if this is the default admin)');
    } else {
      console.log('\nNo admin found in database');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking teachers:', error.message);
    process.exit(1);
  }
};

checkTeachers(); 
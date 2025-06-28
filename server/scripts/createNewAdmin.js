import mongoose from 'mongoose';
import Teacher from '../models/teacher.model.js';
import dotenv from 'dotenv';

dotenv.config();

const createNewAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Teacher.findOne({ email: 'ridernishant946@gmail.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
      console.log('Email: ridernishant946@gmail.com');
      console.log('Password: whothehellareyou');
      process.exit(0);
    }

    // Create new admin teacher
    const adminTeacher = new Teacher({
      rollNo: 'ADMIN002',
      name: 'Nishant Rider',
      mobileNo: '1234567890',
      email: 'ridernishant946@gmail.com',
      department: 'Administration',
      preferredDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      subjectChoices: ['Administration'],
      designation: 'Administrator',
      password: 'whothehellareyou',
      isVerified: true,
      isAdmin: true,
      isActive: true
    });

    await adminTeacher.save();
    console.log('New admin teacher created successfully');
    console.log('Email: ridernishant946@gmail.com');
    console.log('Password: whothehellareyou');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

createNewAdmin(); 
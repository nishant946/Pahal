import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import Teacher from "./models/teacher.model.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Simple test route to check database connection
app.get('/test', async (req, res) => {
  try {
    const teacherCount = await Teacher.countDocuments();
    res.json({ 
      success: true, 
      message: 'Database connected',
      teacherCount 
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Test profile update without authentication
app.put('/test-profile/:id', async (req, res) => {
  try {
    console.log('=== Test Profile Update ===');
    console.log('Params:', req.params);
    console.log('Body:', req.body);
    
    const teacherId = req.params.id;
    const updateData = { ...req.body };
    
    // Remove sensitive fields
    delete updateData.password;
    delete updateData.isVerified;
    delete updateData.isAdmin;
    delete updateData.rollNo;
    delete updateData._id;
    delete updateData.id;
    
    console.log('Final updateData:', updateData);
    
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');
    
    console.log('Updated teacher:', updatedTeacher);
    
    if (!updatedTeacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedTeacher
    });
  } catch (error) {
    console.error('Test profile update error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

const PORT = 3001; // Use different port for testing

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
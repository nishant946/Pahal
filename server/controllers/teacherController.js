import Teacher from "../models/teacher.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Teacher registration
export const registerTeacher = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      department, 
      rollNumber, 
      mobile, 
      preferredDays, 
      subjectChoices 
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !department || !rollNumber || !mobile || !preferredDays || !subjectChoices) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Ensure arrays are properly formatted
    const preferredDaysArray = Array.isArray(preferredDays) ? preferredDays : [];
    const subjectChoicesArray = Array.isArray(subjectChoices) ? subjectChoices : [];

    if (preferredDaysArray.length === 0) {
      return res.status(400).json({ message: "At least one preferred day must be provided" });
    }

    if (subjectChoicesArray.length === 0) {
      return res.status(400).json({ message: "At least one subject choice must be provided" });
    }

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ 
      $or: [{ email }, { rollNo: rollNumber }] 
    });

    if (existingTeacher) {
      return res.status(409).json({ 
        message: "Teacher with this email or roll number already exists" 
      });
    }

    // Create new teacher with default values
    const teacher = new Teacher({
      rollNo: rollNumber,
      name,
      mobileNo: mobile,
      email,
      department,
      preferredDays: preferredDaysArray,
      subjectChoices: subjectChoicesArray,
      designation: 'Teacher',
      password,
      isVerified: false, // Default to unverified
      isAdmin: false, // Default to regular teacher
      isActive: true
    });

    await teacher.save();

    // Remove password from response
    const teacherResponse = teacher.toObject();
    delete teacherResponse.password;

    res.status(201).json({
      message: "Teacher registered successfully. Please wait for admin verification.",
      teacher: teacherResponse
    });
  } catch (error) {
    console.error("Teacher registration error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      message: "Server error", 
      details: error.message 
    });
  }
};

// Teacher login
export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt with email:", email);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find teacher by email
    const teacher = await Teacher.findOne({ email }).select("+password");
    
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Check if teacher is active
    if (!teacher.isActive) {
      return res.status(401).json({ message: "Teacher account is deactivated" });
    }

    // Verify password
    const isMatch = await teacher.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: teacher._id, 
        rollNo: teacher.rollNo,
        email: teacher.email,
        isTeacher: true,
        isAdmin: teacher.isAdmin,
        isVerified: teacher.isVerified
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Remove password from response
    const teacherResponse = teacher.toObject();
    delete teacherResponse.password;

    res.status(200).json({
      message: teacher.isAdmin 
        ? "Admin login successful" 
        : teacher.isVerified 
          ? "Login successful" 
          : "Login successful. Account pending verification.",
      teacher: teacherResponse,
      token
    });
  } catch (error) {
    console.error("Teacher login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const teacher = await Teacher.findById(id).select('-password');
    
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error("Error fetching teacher:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update teacher
export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Don't allow updating rollNo as it's the primary key
    delete updateData.rollNo;

    const teacher = await Teacher.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({
      message: "Teacher updated successfully",
      teacher
    });
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete teacher (soft delete)
export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify teacher
export const verifyTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    ).select('-password');

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({
      message: "Teacher verified successfully",
      teacher
    });
  } catch (error) {
    console.error("Error verifying teacher:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get teachers by department
export const getTeachersByDepartment = async (req, res) => {
  try {
    const { department } = req.params;

    const teachers = await Teacher.find({ 
      department: { $regex: department, $options: 'i' },
      isActive: true 
    }).select('-password');

    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching teachers by department:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get teacher statistics
export const getTeacherStats = async (req, res) => {
  try {
    const totalTeachers = await Teacher.countDocuments({ isActive: true });
    const verifiedTeachers = await Teacher.countDocuments({ isActive: true, isVerified: true });
    const unverifiedTeachers = await Teacher.countDocuments({ isActive: true, isVerified: false });

    const departmentStats = await Teacher.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      total: totalTeachers,
      verified: verifiedTeachers,
      unverified: unverifiedTeachers,
      departmentStats
    });
  } catch (error) {
    console.error("Error fetching teacher stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get unverified teachers
export const getUnverifiedTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ 
      isVerified: false, 
      isActive: true 
    }).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      message: "Unverified teachers retrieved successfully",
      teachers
    });
  } catch (error) {
    console.error("Error fetching unverified teachers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Deactivate teacher (soft delete)
export const deactivateTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({
      message: "Teacher deactivated successfully",
      teacher
    });
  } catch (error) {
    console.error("Error deactivating teacher:", error);
    res.status(500).json({ message: "Server error" });
  }
};
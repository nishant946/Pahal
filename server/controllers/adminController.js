import Teacher from "../models/teacher.model.js";
import Student from "../models/studentModel.js";
import Attendance from "../models/attendanceModel.js";
import Homework from "../models/homeworkModel.js";

// Get admin dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get teacher statistics
    const totalTeachers = await Teacher.countDocuments({ isActive: true });
    const verifiedTeachers = await Teacher.countDocuments({ isActive: true, isVerified: true });
    const unverifiedTeachers = await Teacher.countDocuments({ isActive: true, isVerified: false });

    // Get student statistics
    const totalStudents = await Student.countDocuments({ isActive: true });

    // Get course statistics (using subjectChoices from teachers)
    const teachersWithSubjects = await Teacher.find({ isActive: true, isVerified: true });
    const allSubjects = new Set();
    teachersWithSubjects.forEach(teacher => {
      teacher.subjectChoices.forEach(subject => allSubjects.add(subject));
    });
    const totalCourses = allSubjects.size;

    // Get recent activities
    const recentTeachers = await Teacher.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name createdAt isVerified');

    const recentActivities = recentTeachers.map(teacher => ({
      action: teacher.isVerified ? "Teacher Verified" : "Teacher Registration",
      name: teacher.name,
      time: formatTimeAgo(teacher.createdAt)
    }));

    res.status(200).json({
      totalTeachers,
      verifiedTeachers,
      unverifiedTeachers,
      totalStudents,
      totalCourses,
      recentActivities
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all teachers for admin management
export const getAllTeachersForAdmin = async (req, res) => {
  try {
    const teachers = await Teacher.find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Teachers retrieved successfully",
      teachers
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get teacher statistics by department
export const getTeacherStatsByDepartment = async (req, res) => {
  try {
    const departmentStats = await Teacher.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$department',
          total: { $sum: 1 },
          verified: { $sum: { $cond: ['$isVerified', 1, 0] } },
          unverified: { $sum: { $cond: ['$isVerified', 0, 1] } }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.status(200).json({
      message: "Department statistics retrieved successfully",
      departmentStats
    });
  } catch (error) {
    console.error("Error fetching department stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get attendance overview
export const getAttendanceOverview = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAttendance = await Attendance.countDocuments({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    const totalStudents = await Student.countDocuments({ isActive: true });
    const attendancePercentage = totalStudents > 0 ? (todayAttendance / totalStudents) * 100 : 0;

    res.status(200).json({
      todayAttendance,
      totalStudents,
      attendancePercentage: Math.round(attendancePercentage * 100) / 100
    });
  } catch (error) {
    console.error("Error fetching attendance overview:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get homework overview
export const getHomeworkOverview = async (req, res) => {
  try {
    const totalHomework = await Homework.countDocuments();
    const recentHomework = await Homework.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('assignedBy', 'name');

    res.status(200).json({
      totalHomework,
      recentHomework
    });
  } catch (error) {
    console.error("Error fetching homework overview:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper function to format time ago
function formatTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
} 
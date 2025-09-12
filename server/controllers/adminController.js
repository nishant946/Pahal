import Teacher from "../models/teacher.model.js";
import Student from "../models/studentModel.js";
import Attendance from "../models/attendanceModel.js";
import Homework from "../models/homeworkModel.js";
import TeacherAttendance from "../models/teacherAttendanceModel.js";

// Get admin dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get teacher statistics
    const totalTeachers = await Teacher.countDocuments({ isActive: true });
    const verifiedTeachers = await Teacher.countDocuments({ isActive: true, isVerified: true });
    const unverifiedTeachers = await Teacher.countDocuments({ isActive: true, isVerified: false });

    // Get student statistics
    const totalStudents = await Student.countDocuments();

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
    const todayEnd = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    // Today's attendance
    const todayAttendance = await Attendance.countDocuments({
      date: { $gte: today, $lt: todayEnd },
      status: 'present'
    });

    // Total students
    const totalStudents = await Student.countDocuments();
    
    // Today's attendance percentage
    const todayAttendancePercentage = totalStudents > 0 ? (todayAttendance / totalStudents) * 100 : 0;

    // Weekly attendance (last 7 days)
    const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyAttendance = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: last7Days, $lt: todayEnd },
          status: 'present'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Monthly statistics
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyAttendance = await Attendance.countDocuments({
      date: { $gte: monthStart, $lt: todayEnd },
      status: 'present'
    });

    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const workingDaysInMonth = Math.floor(daysInMonth * 5/7); // Approximate working days
    const expectedMonthlyAttendance = totalStudents * workingDaysInMonth;
    const monthlyAttendancePercentage = expectedMonthlyAttendance > 0 ? 
      (monthlyAttendance / expectedMonthlyAttendance) * 100 : 0;

    // Grade-wise attendance
    const gradeWiseAttendance = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: today, $lt: todayEnd },
          status: 'present'
        }
      },
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      { $unwind: '$studentInfo' },
      {
        $group: {
          _id: '$studentInfo.grade',
          present: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Get total students by grade for percentage calculation
    const studentsByGrade = await Student.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$grade',
          total: { $sum: 1 }
        }
      }
    ]);

    const gradeWiseStats = gradeWiseAttendance.map(grade => {
      const totalInGrade = studentsByGrade.find(g => g._id === grade._id)?.total || 0;
      return {
        grade: grade._id,
        present: grade.present,
        total: totalInGrade,
        percentage: totalInGrade > 0 ? (grade.present / totalInGrade) * 100 : 0
      };
    });

    res.status(200).json({
      todayAttendance,
      totalStudents,
      todayAttendancePercentage: Math.round(todayAttendancePercentage * 100) / 100,
      weeklyAttendance,
      monthlyAttendance,
      monthlyAttendancePercentage: Math.round(monthlyAttendancePercentage * 100) / 100,
      gradeWiseStats,
      absentToday: totalStudents - todayAttendance
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

// Get detailed attendance analytics
export const getAttendanceAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, grade } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    // Build match criteria
    const matchCriteria = {
      date: { $gte: start, $lte: end }
    };

    // Daily attendance trend
    const dailyTrend = await Attendance.aggregate([
      { $match: matchCriteria },
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      { $unwind: '$studentInfo' },
      ...(grade ? [{ $match: { 'studentInfo.grade': grade } }] : []),
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            status: "$status"
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.date",
          present: {
            $sum: { $cond: [{ $eq: ["$_id.status", "present"] }, "$count", 0] }
          },
          absent: {
            $sum: { $cond: [{ $eq: ["$_id.status", "absent"] }, "$count", 0] }
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Low attendance students (below 75%)
    const lowAttendanceStudents = await Attendance.aggregate([
      { $match: matchCriteria },
      {
        $group: {
          _id: "$student",
          totalDays: { $sum: 1 },
          presentDays: {
            $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] }
          }
        }
      },
      {
        $addFields: {
          attendancePercentage: {
            $multiply: [{ $divide: ["$presentDays", "$totalDays"] }, 100]
          }
        }
      },
      { $match: { attendancePercentage: { $lt: 75 } } },
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      { $unwind: '$studentInfo' },
      {
        $project: {
          studentName: '$studentInfo.name',
          rollNumber: '$studentInfo.rollNumber',
          grade: '$studentInfo.grade',
          totalDays: 1,
          presentDays: 1,
          attendancePercentage: { $round: ["$attendancePercentage", 2] }
        }
      },
      { $sort: { attendancePercentage: 1 } }
    ]);

    res.status(200).json({
      dailyTrend,
      lowAttendanceStudents,
      dateRange: { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] }
    });
  } catch (error) {
    console.error("Error fetching attendance analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get students present on a specific date
export const getStudentsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Date parameter is required" });
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);

    const attendanceRecords = await Attendance.find({
      date: { $gte: targetDate, $lt: nextDay }
    }).populate('student', 'name rollNumber grade group');

    const presentStudents = attendanceRecords
      .filter(record => record.status === 'present' && record.student)
      .map(record => ({
        id: record.student._id,
        name: record.student.name,
        rollNumber: record.student.rollNumber,
        grade: record.student.grade,
        group: record.student.group,
        timeMarked: record.timeMarked
      }));

    const absentStudents = attendanceRecords
      .filter(record => record.status === 'absent' && record.student)
      .map(record => ({
        id: record.student._id,
        name: record.student.name,
        rollNumber: record.student.rollNumber,
        grade: record.student.grade,
        group: record.student.group
      }));

    res.status(200).json({
      date: date,
      present: presentStudents,
      absent: absentStudents,
      summary: {
        totalPresent: presentStudents.length,
        totalAbsent: absentStudents.length,
        total: presentStudents.length + absentStudents.length
      }
    });
  } catch (error) {
    console.error("Error fetching students by date:", error);
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

// Get teacher attendance overview
export const getTeacherAttendanceOverview = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's teacher attendance
    const todayAttendance = await TeacherAttendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      status: 'present'
    });

    // Get total active teachers
    const totalTeachers = await Teacher.countDocuments({ isActive: true });

    // Calculate today's attendance percentage
    const todayAttendancePercentage = totalTeachers > 0 ? Math.round((todayAttendance / totalTeachers) * 100) : 0;

    // Get absent teachers today
    const absentToday = totalTeachers - todayAttendance;

    // Get weekly attendance trend
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyAttendance = await TeacherAttendance.aggregate([
      {
        $match: {
          date: { $gte: sevenDaysAgo, $lt: tomorrow },
          status: 'present'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get monthly attendance
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyAttendance = await TeacherAttendance.countDocuments({
      date: { $gte: firstDayOfMonth, $lt: tomorrow },
      status: 'present'
    });

    // Calculate monthly attendance percentage
    const daysInMonth = today.getDate();
    const expectedMonthlyAttendance = totalTeachers * daysInMonth;
    const monthlyAttendancePercentage = expectedMonthlyAttendance > 0 ? 
      Math.round((monthlyAttendance / expectedMonthlyAttendance) * 100) : 0;

    // Get department-wise stats
    const departmentWiseStats = await TeacherAttendance.aggregate([
      {
        $match: {
          date: { $gte: today, $lt: tomorrow },
          status: 'present'
        }
      },
      {
        $lookup: {
          from: 'teachers',
          localField: 'teacher',
          foreignField: '_id',
          as: 'teacherInfo'
        }
      },
      { $unwind: '$teacherInfo' },
      {
        $group: {
          _id: '$teacherInfo.department',
          present: { $sum: 1 }
        }
      }
    ]);

    // Get total teachers by department
    const teachersByDepartment = await Teacher.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$department',
          total: { $sum: 1 }
        }
      }
    ]);

    // Combine department stats
    const departmentStats = teachersByDepartment.map(dept => {
      const presentData = departmentWiseStats.find(p => p._id === dept._id);
      const present = presentData ? presentData.present : 0;
      return {
        department: dept._id || 'Not Specified',
        present,
        total: dept.total,
        percentage: dept.total > 0 ? Math.round((present / dept.total) * 100) : 0
      };
    });

    res.json({
      todayAttendance,
      totalTeachers,
      todayAttendancePercentage,
      weeklyAttendance,
      monthlyAttendance,
      monthlyAttendancePercentage,
      departmentWiseStats: departmentStats,
      absentToday
    });
  } catch (error) {
    console.error('Error fetching teacher attendance overview:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get teacher attendance analytics
export const getTeacherAttendanceAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, department, status } = req.query;

    let matchConditions = {};

    // Date filtering
    if (startDate && endDate) {
      matchConditions.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      matchConditions.date = { $gte: thirtyDaysAgo };
    }

    // Status filtering
    if (status && status !== 'all') {
      matchConditions.status = status;
    }

    // Get daily attendance trend
    const dailyTrend = await TeacherAttendance.aggregate([
      { $match: matchConditions },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            status: "$status"
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.date",
          present: {
            $sum: { $cond: [{ $eq: ["$_id.status", "present"] }, "$count", 0] }
          },
          absent: {
            $sum: { $cond: [{ $eq: ["$_id.status", "absent"] }, "$count", 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get teachers with low attendance
    const lowAttendanceTeachers = await TeacherAttendance.aggregate([
      { $match: matchConditions },
      {
        $group: {
          _id: "$teacher",
          totalDays: { $sum: 1 },
          presentDays: {
            $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] }
          }
        }
      },
      {
        $addFields: {
          attendancePercentage: {
            $multiply: [
              { $divide: ["$presentDays", "$totalDays"] },
              100
            ]
          }
        }
      },
      { $match: { attendancePercentage: { $lt: 80 } } },
      {
        $lookup: {
          from: 'teachers',
          localField: '_id',
          foreignField: '_id',
          as: 'teacherInfo'
        }
      },
      { $unwind: '$teacherInfo' },
      {
        $project: {
          name: '$teacherInfo.name',
          department: '$teacherInfo.department',
          employeeId: '$teacherInfo.rollNo',
          attendancePercentage: { $round: ['$attendancePercentage', 1] },
          presentDays: 1,
          totalDays: 1
        }
      },
      { $sort: { attendancePercentage: 1 } },
      { $limit: 10 }
    ]);

    // Get department-wise statistics
    let departmentStats = [];
    if (department && department !== 'all') {
      // Filter by specific department
      const deptMatchConditions = {
        ...matchConditions,
        'teacherInfo.department': department
      };

      departmentStats = await TeacherAttendance.aggregate([
        {
          $lookup: {
            from: 'teachers',
            localField: 'teacher',
            foreignField: '_id',
            as: 'teacherInfo'
          }
        },
        { $unwind: '$teacherInfo' },
        { $match: deptMatchConditions },
        {
          $group: {
            _id: '$teacherInfo.department',
            totalRecords: { $sum: 1 },
            presentCount: {
              $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }
            }
          }
        },
        {
          $addFields: {
            attendanceRate: {
              $multiply: [
                { $divide: ['$presentCount', '$totalRecords'] },
                100
              ]
            }
          }
        }
      ]);
    } else {
      // Get all departments
      departmentStats = await TeacherAttendance.aggregate([
        { $match: matchConditions },
        {
          $lookup: {
            from: 'teachers',
            localField: 'teacher',
            foreignField: '_id',
            as: 'teacherInfo'
          }
        },
        { $unwind: '$teacherInfo' },
        {
          $group: {
            _id: '$teacherInfo.department',
            totalRecords: { $sum: 1 },
            presentCount: {
              $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }
            }
          }
        },
        {
          $addFields: {
            attendanceRate: {
              $multiply: [
                { $divide: ['$presentCount', '$totalRecords'] },
                100
              ]
            }
          }
        },
        { $sort: { attendanceRate: -1 } }
      ]);
    }

    res.json({
      dailyTrend,
      lowAttendanceTeachers,
      departmentStats: departmentStats.map(dept => ({
        department: dept._id || 'Not Specified',
        attendanceRate: Math.round(dept.attendanceRate),
        totalRecords: dept.totalRecords,
        presentCount: dept.presentCount
      }))
    });
  } catch (error) {
    console.error('Error fetching teacher attendance analytics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get teachers by date
export const getTeachersByDate = async (req, res) => {
  try {
    const { date, status } = req.query;
    
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    let matchConditions = {
      date: { $gte: targetDate, $lt: nextDate }
    };

    if (status && status !== 'all') {
      matchConditions.status = status;
    }

    const teacherAttendance = await TeacherAttendance.find(matchConditions)
      .populate('teacher', 'name rollNo department designation')
      .sort({ timeMarked: 1 });

    const teachers = teacherAttendance.map(record => ({
      id: record.teacher._id,
      name: record.teacher.name,
      employeeId: record.teacher.rollNo,
      department: record.teacher.department,
      designation: record.teacher.designation,
      status: record.status,
      timeMarked: record.timeMarked,
      timeIn: record.timeIn,
      timeOut: record.timeOut
    }));

    // Also get teachers who didn't mark attendance (if status is 'all' or 'absent')
    if (!status || status === 'all' || status === 'absent') {
      const attendedTeacherIds = teacherAttendance.map(record => record.teacher._id);
      const absentTeachers = await Teacher.find({
        _id: { $nin: attendedTeacherIds },
        isActive: true
      }).select('name rollNo department designation');

      const absentTeacherRecords = absentTeachers.map(teacher => ({
        id: teacher._id,
        name: teacher.name,
        employeeId: teacher.rollNo,
        department: teacher.department,
        designation: teacher.designation,
        status: 'absent',
        timeMarked: null,
        timeIn: null,
        timeOut: null
      }));

      if (status === 'absent') {
        teachers.splice(0, teachers.length, ...absentTeacherRecords);
      } else if (!status || status === 'all') {
        teachers.push(...absentTeacherRecords);
      }
    }

    res.json({ teachers });
  } catch (error) {
    console.error('Error fetching teachers by date:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
} 
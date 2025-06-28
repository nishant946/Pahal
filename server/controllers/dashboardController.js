import Student from "../models/studentModel.js";
import Teacher from "../models/teacher.model.js";
import Attendance from "../models/attendanceModel.js";
import TeacherAttendance from "../models/teacherAttendanceModel.js";
import Homework from "../models/homeworkModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Student statistics
    const totalStudents = await Student.countDocuments({ isActive: true });
    const presentStudentsToday = await Attendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      status: 'present'
    });
    const absentStudentsToday = await Attendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      status: 'absent'
    });

    // Teacher statistics
    const totalTeachers = await Teacher.countDocuments({ isActive: true });
    const verifiedTeachers = await Teacher.countDocuments({ isActive: true, isVerified: true });
    const presentTeachersToday = await TeacherAttendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      status: 'present'
    });

    // Homework statistics
    const totalHomework = await Homework.countDocuments();
    const pendingHomework = await Homework.countDocuments({ status: 'pending' });
    const completedHomework = await Homework.countDocuments({ status: 'completed' });

    // Recent activity
    const recentAttendance = await Attendance.find({
      date: { $gte: today, $lt: tomorrow }
    }).populate('student', 'name rollNumber').limit(5);

    const recentTeacherAttendance = await TeacherAttendance.find({
      date: { $gte: today, $lt: tomorrow }
    }).populate('teacher', 'name rollNo').limit(5);

    const recentHomework = await Homework.find()
      .populate('assignedBy', 'name rollNo')
      .sort({ createdAt: -1 })
      .limit(5);

    // Department-wise student count
    const departmentStats = await Student.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Weekly attendance trend (last 7 days)
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyAttendance = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: weekAgo, $lt: tomorrow }
        }
      },
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
            $sum: {
              $cond: [{ $eq: ["$_id.status", "present"] }, "$count", 0]
            }
          },
          absent: {
            $sum: {
              $cond: [{ $eq: ["$_id.status", "absent"] }, "$count", 0]
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      students: {
        total: totalStudents,
        presentToday: presentStudentsToday,
        absentToday: absentStudentsToday,
        attendancePercentage: totalStudents > 0 ? ((presentStudentsToday / totalStudents) * 100).toFixed(1) : 0
      },
      teachers: {
        total: totalTeachers,
        verified: verifiedTeachers,
        presentToday: presentTeachersToday,
        verificationPercentage: totalTeachers > 0 ? ((verifiedTeachers / totalTeachers) * 100).toFixed(1) : 0
      },
      homework: {
        total: totalHomework,
        pending: pendingHomework,
        completed: completedHomework,
        completionPercentage: totalHomework > 0 ? ((completedHomework / totalHomework) * 100).toFixed(1) : 0
      },
      recentActivity: {
        studentAttendance: recentAttendance,
        teacherAttendance: recentTeacherAttendance,
        homework: recentHomework
      },
      departmentStats,
      weeklyAttendance
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({ isActive: true });
    const maleStudents = await Student.countDocuments({ isActive: true, gender: 'male' });
    const femaleStudents = await Student.countDocuments({ isActive: true, gender: 'female' });

    const departmentStats = await Student.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const classStats = await Student.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$class',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      total: totalStudents,
      male: maleStudents,
      female: femaleStudents,
      departmentStats,
      classStats
    });
  } catch (error) {
    console.error("Error fetching student stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAttendanceStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const presentStudents = await Attendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      status: 'present'
    });

    const absentStudents = await Attendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      status: 'absent'
    });

    const presentTeachers = await TeacherAttendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      status: 'present'
    });

    const absentTeachers = await TeacherAttendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      status: 'absent'
    });

    res.status(200).json({
      students: {
        present: presentStudents,
        absent: absentStudents,
        total: presentStudents + absentStudents
      },
      teachers: {
        present: presentTeachers,
        absent: absentTeachers,
        total: presentTeachers + absentTeachers
      }
    });
  } catch (error) {
    console.error("Error fetching attendance stats:", error);
    res.status(500).json({ message: "Server error" });
  }
}; 
import TeacherAttendance from "../models/teacherAttendanceModel.js";
import Teacher from "../models/teacher.model.js";

export const markTeacherAttendance = async (req, res) => {
  console.log("Mark teacher attendance request received:", req.body);
  const { teacherId, date, status, timeMarked, timeIn, timeOut, notes } = req.body;
  
  // Validate required fields
  if (!teacherId || !date || !status || !timeMarked) {
    return res.status(400).json({ message: "Teacher ID, date, status, and timeMarked are required" });
  }

  // Convert date string to Date object and set to start of day
  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  // Check if attendance for the teacher on the given date already exists
  const existingAttendance = await TeacherAttendance.findOne({ 
    teacher: teacherId, 
    date: {
      $gte: attendanceDate,
      $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000)
    }
  });
  console.log("Checking for existing teacher attendance:", existingAttendance);
  
  if (existingAttendance) {
    return res
      .status(400)
      .json({ message: "Attendance for this teacher on this date already exists" });
  }

  try {
    const attendance = await TeacherAttendance.create({
      teacher: teacherId,
      date: attendanceDate,
      status,
      timeMarked,
      timeIn,
      timeOut,
      notes
    });
    
    const populatedAttendance = await TeacherAttendance.findById(attendance._id).populate('teacher', 'name rollNo department');
    res.status(201).json(populatedAttendance);
  } catch (error) {
    console.error("Error marking teacher attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTeacherAttendance = async (req, res) => {
  const { teacherId } = req.params;
  try {
    const attendanceRecords = await TeacherAttendance.find({ teacher: teacherId })
      .populate('teacher', 'name employeeId department')
      .sort({ date: -1 });
    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching teacher attendance records:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPresentTeachersByDate = async (req, res) => {
  console.log("Get present teachers by date request received:", req.query);
  const { date } = req.query;
  if (!date) {
    return res
      .status(400)
      .json({ message: "Date query parameter is required" });
  }
  
  try {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const attendanceRecords = await TeacherAttendance.find({
      date: { $gte: dayStart, $lte: dayEnd },
      status: "present",
    }).populate("teacher", "name rollNo department designation");

    // Map to frontend format
    const presentTeachers = attendanceRecords
      .filter((record) => record.teacher)
      .map((record) => ({
        id: record.teacher._id,
        name: record.teacher.name,
        employeeId: record.teacher.rollNo,
        department: record.teacher.department,
        designation: record.teacher.designation,
        timeMarked: record.timeMarked,
        timeIn: record.timeIn,
      }));

      console.log("Present teachers on", date, ":", presentTeachers);

    res.status(200).json({
      date,
      presentTeachers,
    });
  } catch (error) {
    console.error("Error fetching present teachers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const unmarkTeacherAttendance = async (req, res) => {
  console.log("Unmark teacher attendance request received:", req.body);
  const { teacherId, date } = req.body;
  
  // Convert date string to Date object and set to start of day
  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);
  
  try {
    const attendanceRecord = await TeacherAttendance.findOneAndDelete({
      teacher: teacherId,
      date: {
        $gte: attendanceDate,
        $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (!attendanceRecord) {
      return res.status(404).json({ message: "Teacher attendance record not found" });
    }
    
    res.status(200).json({ message: "Teacher attendance record deleted successfully" });
  } catch (error) {
    console.error("Error unmarking teacher attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTeacherAttendance = async (req, res) => {
  const { attendanceId } = req.params;
  const { status, timeIn, timeOut, notes } = req.body;
  
  try {
    const updatedAttendance = await TeacherAttendance.findByIdAndUpdate(
      attendanceId,
      { status, timeIn, timeOut, notes },
      { new: true }
    ).populate('teacher', 'name employeeId department');
    
    if (!updatedAttendance) {
      return res.status(404).json({ message: "Teacher attendance record not found" });
    }
    
    res.status(200).json(updatedAttendance);
  } catch (error) {
    console.error("Error updating teacher attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTeacherAttendanceStats = async (req, res) => {
  const { teacherId } = req.params;
  const { startDate, endDate } = req.query;

  if (!teacherId || !startDate || !endDate) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    const attendanceRecords = await TeacherAttendance.find({
      teacher: teacherId,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    const stats = attendanceRecords.reduce(
      (acc, record) => {
        acc.total++;
        if (record.status === "present") acc.present++;
        else if (record.status === "absent") acc.absent++;
        return acc;
      },
      { total: 0, present: 0, absent: 0 }
    );

    // Calculate attendance percentage
    stats.attendancePercentage = stats.total > 0 ? (stats.present / stats.total) * 100 : 0;

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching teacher attendance stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllTeachersAttendanceReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Start date and end date are required" });
  }

  try {
    // Get all teachers
    const teachers = await Teacher.find({ isActive: true });
    
    // Get attendance records for all teachers in the date range
    const attendanceRecords = await TeacherAttendance.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).populate('teacher', 'name employeeId department designation');

    // Group attendance by teacher
    const teacherAttendanceMap = {};
    attendanceRecords.forEach(record => {
      if (!teacherAttendanceMap[record.teacher._id]) {
        teacherAttendanceMap[record.teacher._id] = [];
      }
      teacherAttendanceMap[record.teacher._id].push(record);
    });

    // Calculate stats for each teacher
    const teacherStats = teachers.map(teacher => {
      const attendance = teacherAttendanceMap[teacher._id] || [];
      const stats = attendance.reduce(
        (acc, record) => {
          acc.total++;
          if (record.status === "present") acc.present++;
          else if (record.status === "absent") acc.absent++;
          return acc;
        },
        { total: 0, present: 0, absent: 0 }
      );
      
      stats.attendancePercentage = stats.total > 0 ? (stats.present / stats.total) * 100 : 0;
      
      return {
        id: teacher._id,
        name: teacher.name,
        employeeId: teacher.employeeId,
        department: teacher.department,
        designation: teacher.designation,
        ...stats
      };
    });

    res.status(200).json({
      startDate,
      endDate,
      teachers: teacherStats
    });
  } catch (error) {
    console.error("Error fetching all teachers attendance report:", error);
    res.status(500).json({ message: "Server error" });
  }
}; 
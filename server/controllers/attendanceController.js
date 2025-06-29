import Attendance from "../models/attendanceModel.js";

export const markAttendance = async (req, res) => {
  console.log("Mark attendance request received:", req.body);
  const { userId, date, status, timeMarked } = req.body;
  // Validate required fields
  if (!userId || !date || !status || !timeMarked) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Convert date string to Date object and set to start of day
  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  const nextDay = new Date(attendanceDate);
  nextDay.setDate(nextDay.getDate() + 1);

  // Check if attendance for the user on the given date already exists
  const existingAttendance = await Attendance.findOne({
    student: userId,
    date: {
      $gte: attendanceDate,
      $lt: nextDay,
    },
  });
  console.log("Checking for existing attendance:", existingAttendance);
  if (existingAttendance) {
    return res
      .status(400)
      .json({ message: "Attendance for this date already exists" });
  }

  try {
    const attendance = await Attendance.create({
      student: userId,
      date: attendanceDate,
      status,
      timeMarked,
    });
    res.status(201).json(attendance);
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAttendance = async (req, res) => {
  // params example:
  const { userId } = req.params;
  try {
    const attendanceRecords = await Attendance.find({ student: userId });
    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// get all the attendance records for a specific date
export const getPresentStudentsByDate = async (req, res) => {
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

    const attendanceRecords = await Attendance.find({
      date: { $gte: dayStart, $lte: dayEnd },
      status: "present",
    }).populate("student", "name rollNumber grade group");

    // Map to frontend format
    const presentStudents = attendanceRecords
      .filter((record) => record.student)
      .map((record) => ({
        id: record.student._id,
        name: record.student.name,
        rollNumber: record.student.rollNumber,
        grade: record.student.grade,
        group: record.student.group,
        timeMarked: record.timeMarked,
      }));

    res.status(200).json({
      date,
      presentStudents,
    });
  } catch (error) {
    console.error("Error fetching present students:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const unmarkAttendance = async (req, res) => {
  try {
    const { userId, date } = req.body;
    if (!userId || !date) {
      return res.status(400).json({ message: "userId and date are required" });
    }
    // Find the attendance record for the student and date
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(attendanceDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const attendance = await Attendance.findOne({
      student: userId,
      date: {
        $gte: attendanceDate,
        $lt: nextDay,
      },
    });
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    // Remove the attendance record
    await Attendance.deleteOne({ _id: attendance._id });
    res.json({ message: "Attendance unmarked", attendance });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateAttendance = async (req, res) => {
  const { attendanceId } = req.params;
  const { status } = req.body;
  try {
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      attendanceId,
      { status },
      { new: true }
    );
    if (!updatedAttendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.status(200).json(updatedAttendance);
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentAttendanceStats = async (req, res) => {
  const { studentId } = req.params;
  const { startDate, endDate } = req.query;

  if (!studentId || !startDate || !endDate) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    const today = new Date(); // local time
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const attendanceRecords = await Attendance.find({
      student: studentId,
      date: {
        $gte: start,
        $lte: end,
      },
    });

    const stats = attendanceRecords.reduce(
      (acc, record) => {
        acc.totalDays++;
        if (record.status === "present") acc.presentDays++;
        else if (record.status === "absent") acc.absentDays++;
        return acc;
      },
      {
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
      }
    );

    const attendancePercentage =
      stats.totalDays > 0 ? (stats.presentDays / stats.totalDays) * 100 : 0;

    res.status(200).json({
      ...stats,
      attendancePercentage: parseFloat(attendancePercentage.toFixed(2)),
    });
  } catch (error) {
    console.error("Error fetching student attendance stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

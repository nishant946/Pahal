import Attendance from "../models/attendanceModel.js";

export const markAttendance = async (req, res) => {
    console.log("Mark attendance request received:", req.body);
    const { userId, date, status, timeMarked } = req.body;
    // Validate required fields
    if (!userId || !date || !status || !timeMarked) {
        return res.status(400).json({ message: "All fields are required" });
    }
    // Check if attendance for the user on the given date already exists
    const existingAttendance = await Attendance.findOne({ user: userId, date });
    console.log("Checking for existing attendance:", existingAttendance);
    if (existingAttendance) {
        return res.status(400).json({ message: "Attendance for this date already exists" });
    }   

    try {
        const attendance = await Attendance.create({ user: userId, date, status, timeMarked });
        res.status(201).json(attendance);
    } catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).json({ message: "Server error" });
    }
};



export const getAttendance = async (req, res) => { // params example:
    const { userId } = req.params;
    try {
        const attendanceRecords = await Attendance.find({ user: userId });
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
        return res.status(400).json({ message: "Date query parameter is required" });
    }
    try {
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        const attendanceRecords = await Attendance.find({
            date: { $gte: dayStart, $lte: dayEnd },
            status: "present"
        }).populate('user', 'name rollNumber grade group');

        // Map to frontend format
        const presentStudents = attendanceRecords
            .filter(record => record.user)
            .map(record => ({
                id: record.user._id,
                name: record.user.name,
                rollNumber: record.user.rollNumber,
                grade: record.user.grade,
                group: record.user.group,
                timeMarked: record.timeMarked
            }));

        res.status(200).json({
            date,
            presentStudents
        });
    } catch (error) {
        console.error("Error fetching present students:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const unmarkAttendance = async (req, res) => {
    const { userId, date } = req.body;
    try {
        const attendanceRecord = await Attendance.findOneAndDelete({ user: userId, date });
        if (!attendanceRecord) {
            return res.status(404).json({ message: "Attendance record not found" });
        }
        res.status(200).json({ message: "Attendance record deleted successfully" });
    } catch (error) {
        console.error("Error unmarking attendance:", error);
        res.status(500).json({ message: "Server error" });
    }
}

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
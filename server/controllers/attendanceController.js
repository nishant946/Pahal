import Attendance from "../models/attendanceModel.js";

export const markAttendance = async (req, res) => {
    console.log("Mark attendance request received:", req.body);
    const { userId, date, status } = req.body;
    try {
        const attendance = await Attendance.create({ user: userId, date, status });
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
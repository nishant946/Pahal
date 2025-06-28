import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  status: {
    type: String,
    enum: ["present", "absent"],
    default: "present",
  },
  timeMarked: {
    type: String,
    required: true,
  },
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);
export default Attendance;

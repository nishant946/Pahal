import mongoose from "mongoose";

const TeacherAttendanceSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  status: {
    type: String,
    enum: ["present", "absent"],
    default: "present"
  },
  timeMarked: {
    type: String,
    required: true
  },
  timeIn: {
    type: String,
    required: false
  },
  timeOut: {
    type: String,
    required: false
  },
  // notes: {
  //   type: String,
  //   trim: true
  // }
});

// Compound index to ensure one attendance record per teacher per date
TeacherAttendanceSchema.index({ teacher: 1, date: 1 }, { unique: true });

const TeacherAttendance = mongoose.model("TeacherAttendance", TeacherAttendanceSchema);
export default TeacherAttendance; 
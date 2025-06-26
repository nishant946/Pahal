import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
    }
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);
export default Attendance;

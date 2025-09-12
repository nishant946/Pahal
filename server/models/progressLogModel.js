import mongoose from 'mongoose';

const ProgressLogSchema = new mongoose.Schema({
	studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
	teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
	teacherName: { type: String, required: true },
	progress: { type: String, required: true },
	timestamp: { type: Date, default: Date.now },
	mentor: { type: String }, // Set on first update
});

const ProgressLog = mongoose.model('ProgressLog', ProgressLogSchema);
export default ProgressLog;

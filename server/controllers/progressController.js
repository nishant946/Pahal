import ProgressLog from '../models/progressLogModel.js';
import Student from '../models/studentModel.js';
import Teacher from '../models/teacher.model.js';

// Get all progress logs for a student (latest first)
export const getStudentProgress = async (req, res) => {
	try {
		const { studentId } = req.params;
		const logs = await ProgressLog.find({ studentId }).sort({ timestamp: -1 });
		res.json(logs);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Add a new progress log for a student
export const addProgressLog = async (req, res) => {
	try {
		const { studentId } = req.params;
		const { progress, mentor: mentorInput } = req.body;
		const teacherId = req.teacher?._id;
		console.log('ProgressLog Debug: studentId received:', studentId);
		const teacher = await Teacher.findById(teacherId);
		console.log('ProgressLog Debug: teacherId received:', teacherId);
		console.log('ProgressLog Debug: teacher query result:', teacher);
		const student = await Student.findById(studentId);
		console.log('ProgressLog Debug: student query result:', student);
		if (!teacher || !student) return res.status(404).json({ error: 'Teacher or Student not found' });

		// Set mentor from input if provided, else keep existing or default to teacher name
		let mentor = student.mentor;
		if (mentorInput && mentorInput.trim()) {
			// If a new mentor is explicitly provided, update it
			mentor = mentorInput.trim();
			student.mentor = mentor;
			await student.save();
		} else if (!mentor) {
			// If no mentor exists and none provided, default to teacher name
			mentor = teacher.name;
			student.mentor = mentor;
			await student.save();
		}

		const log = new ProgressLog({
			studentId,
			teacherId,
			teacherName: teacher.name,
			progress,
			mentor,
		});
		await log.save();
		res.status(201).json(log);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  group: { type: String, enum: ['A', 'B', 'C'] }, // Group A/B/C
  contact: { type: String },
  parentName: { type: String },
  address: { type: String },
  joinDate: { type: Date, default: Date.now },
  grade: { type: String, required: true }, // Class name or identifier
  mentor: { type: String, default: '' }, // Mentor name
});

const Student = mongoose.model('Student', StudentSchema);
export default Student;
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const TeacherSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    match: /^[A-Za-z\s]+$/, // allows spaces in names
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
  department: { type: String, required: true },
  rollNumber: { type: String, required: true },
  mobile: {
    type: String,
    required: true,
    match: /^[0-9]{10,15}$/, // allows 10-15 digits, including leading zero
  },
  isAdmin: { type: Boolean, default: false }
});

// Pre-save hook to hash the password before saving
TeacherSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const User = mongoose.model('User', TeacherSchema);
export default User;

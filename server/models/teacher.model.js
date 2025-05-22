const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  subjects: [{
    type: String,
    required: true
  }],
  qualification: {
    type: String,
    required: true
  },
  joiningDate: {
    type: Date,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
teacherSchema.pre('save', async function(next) {
  const teacher = this;
  if (teacher.isModified('password')) {
    teacher.password = await bcrypt.hash(teacher.password, 10);
  }
  next();
});

// Compare password method
teacherSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive information when converting to JSON
teacherSchema.methods.toJSON = function() {
  const teacher = this.toObject();
  delete teacher.password;
  return teacher;
};

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;

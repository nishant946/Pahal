import mongoose from "mongoose";

const HomeworkSchema = new mongoose.Schema({
  group: {
    type: String,
    enum: ["A", "B", "C"],
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  dateAssigned: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending"
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
HomeworkSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Homework = mongoose.model("Homework", HomeworkSchema);
export default Homework; 
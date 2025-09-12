import mongoose from 'mongoose';

const contributorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: null // URL or path to the contributor's image
  },
  linkedinUrl: {
    type: String,
    default: null,
    trim: true
  },
  githubUrl: {
    type: String,
    default: null,
    trim: true
  },
  websiteUrl: {
    type: String,
    default: null,
    trim: true
  },
  email: {
    type: String,
    default: null,
    trim: true
  },
  batch: {
    type: String,
    default: null,
    trim: true // e.g., "2021-2025", "2020-2024"
  },
  branch: {
    type: String,
    default: null,
    trim: true // e.g., "Computer Science", "Electronics", "Mechanical"
  },
  order: {
    type: Number,
    default: 0 // For ordering contributors on the frontend
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for ordering
contributorSchema.index({ order: 1, createdAt: 1 });

const Contributor = mongoose.model('Contributor', contributorSchema);

export default Contributor;
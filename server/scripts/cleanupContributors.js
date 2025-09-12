// Script to clean up test contributors
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const contributorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: null },
  linkedinUrl: { type: String, default: null },
  githubUrl: { type: String, default: null },
  websiteUrl: { type: String, default: null },
  email: { type: String, default: null },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Contributor = mongoose.model('Contributor', contributorSchema);

async function cleanupContributors() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Remove all existing contributors
    const result = await Contributor.deleteMany({});
    console.log(`✅ Removed ${result.deletedCount} test contributors`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    console.log('🧹 Database cleaned up successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

cleanupContributors();
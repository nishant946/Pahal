import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get the database
    const db = mongoose.connection.db;
    
    // Drop the problematic index
    try {
      await db.collection('teachers').dropIndex('employeeId_1');
      console.log('Successfully dropped employeeId index');
    } catch (indexError) {
      console.log('Index might not exist or already dropped:', indexError.message);
    }

    // List all indexes to verify
    const indexes = await db.collection('teachers').indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));

    console.log('Database fix completed');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing database:', error.message);
    process.exit(1);
  }
};

fixDatabase(); 
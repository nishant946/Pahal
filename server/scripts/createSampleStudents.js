import mongoose from 'mongoose';
import Student from '../models/studentModel.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pahal';

const students = [
  {
    name: 'Amit Sharma',
    rollNumber: '101',
    group: 'A',
    contact: '9876543210',
    parentName: 'Sunil Sharma',
    address: '123 Main St',
    joinDate: new Date('2025-09-01'),
    grade: '5',
  },
  {
    name: 'Priya Singh',
    rollNumber: '102',
    group: 'B',
    contact: '9876543211',
    parentName: 'Ravi Singh',
    address: '456 Park Ave',
    joinDate: new Date('2025-09-02'),
    grade: '6',
  },
  {
    name: 'Rahul Verma',
    rollNumber: '103',
    group: 'C',
    contact: '9876543212',
    parentName: 'Meena Verma',
    address: '789 Lake Rd',
    joinDate: new Date('2025-09-03'),
    grade: '7',
  },
];

async function main() {
  await mongoose.connect(MONGO_URI);
  await Student.deleteMany({});
  await Student.insertMany(students);
  console.log('Sample students added!');
  mongoose.disconnect();
}

main();

import mongoose from 'mongoose';
import Teacher from '../models/teacher.model.js';
import Homework from '../models/homeworkModel.js';

const sampleTeachers = [
  {
    rollNo: 'T001',
    name: 'Nishant Kumar',
    mobileNo: '+91 98765 43210',
    email: 'nishant@pahal.edu',
    department: 'Mathematics',
    preferredDays: ['Monday', 'Wednesday', 'Friday'],
    subjectChoices: ['Mathematics', 'Statistics', 'Advanced Calculus'],
    designation: 'Senior Teacher',
    qualification: 'M.Sc. Mathematics',
    joiningDate: '2023-01-15',
    password: 'password123',
    isVerified: true
  },
  {
    rollNo: 'T002',
    name: 'Somesh Sharma',
    mobileNo: '+91 98765 43211',
    email: 'somesh@pahal.edu',
    department: 'Science',
    preferredDays: ['Tuesday', 'Thursday', 'Saturday'],
    subjectChoices: ['Physics', 'Mathematics', 'Chemistry'],
    designation: 'Physics Teacher',
    qualification: 'M.Sc. Physics',
    joiningDate: '2023-02-01',
    password: 'password123',
    isVerified: true
  },
  {
    rollNo: 'T003',
    name: 'Pratyaksh Singh',
    mobileNo: '+91 98765 43212',
    email: 'pratyaksh@pahal.edu',
    department: 'English',
    preferredDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    subjectChoices: ['English Literature', 'Grammar', 'Creative Writing'],
    designation: 'Language Teacher',
    qualification: 'M.A. English',
    joiningDate: '2023-03-15',
    password: 'password123',
    isVerified: true
  },
  {
    rollNo: 'T004',
    name: 'Priya Patel',
    mobileNo: '+91 98765 43213',
    email: 'priya@pahal.edu',
    department: 'Computer Science',
    preferredDays: ['Wednesday', 'Friday', 'Saturday'],
    subjectChoices: ['Computer Science', 'Programming', 'Web Development'],
    designation: 'Computer Teacher',
    qualification: 'B.Tech Computer Science',
    joiningDate: '2023-04-01',
    password: 'password123',
    isVerified: true
  },
  {
    rollNo: 'T005',
    name: 'Amit Kumar',
    mobileNo: '+91 98765 43214',
    email: 'amit@pahal.edu',
    department: 'History',
    preferredDays: ['Monday', 'Thursday', 'Friday'],
    subjectChoices: ['History', 'Geography', 'Social Studies'],
    designation: 'History Teacher',
    qualification: 'M.A. History',
    joiningDate: '2023-05-01',
    password: 'password123',
    isVerified: false
  }
];

const createSampleData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://nishantkumarsingh946:D6PncmqVRjMQuzC0@cluster0.6rhmemq.mongodb.net/pahal?retryWrites=true&w=majority');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Teacher.deleteMany({});
    await Homework.deleteMany({});
    console.log('Cleared existing data');

    // Create teachers
    const createdTeachers = await Teacher.insertMany(sampleTeachers);
    console.log(`Created ${createdTeachers.length} teachers`);

    // Create sample homework
    const sampleHomework = [
      {
        group: 'A',
        subject: 'Mathematics',
        description: 'Complete exercises 1-10 from Chapter 5 on Algebra. Show all your work and submit by the due date.',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        dateAssigned: new Date(),
        status: 'pending',
        assignedBy: createdTeachers[0]._id // Nishant
      },
      {
        group: 'B',
        subject: 'Science',
        description: 'Read Chapter 3 on Plant Life Cycle and answer questions 1-15. Include diagrams where necessary.',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        dateAssigned: new Date(),
        status: 'pending',
        assignedBy: createdTeachers[1]._id // Somesh
      },
      {
        group: 'C',
        subject: 'English',
        description: 'Write a 500-word essay on "Environmental Conservation". Follow proper essay structure with introduction, body, and conclusion.',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        dateAssigned: new Date(),
        status: 'pending',
        assignedBy: createdTeachers[2]._id // Pratyaksh
      },
      {
        group: 'A',
        subject: 'Computer Science',
        description: 'Create a simple calculator program using Python. Include basic operations: addition, subtraction, multiplication, and division.',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        dateAssigned: new Date(),
        status: 'pending',
        assignedBy: createdTeachers[3]._id // Priya
      },
      {
        group: 'B',
        subject: 'Mathematics',
        description: 'Solve geometry problems from worksheet pages 45-50. Use proper formulas and show calculations.',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        dateAssigned: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        status: 'completed',
        assignedBy: createdTeachers[0]._id // Nishant
      },
      {
        group: 'C',
        subject: 'Physics',
        description: 'Complete the lab report on "Simple Pendulum Experiment". Include observations, calculations, and conclusions.',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        dateAssigned: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        status: 'completed',
        assignedBy: createdTeachers[1]._id // Somesh
      }
    ];

    const createdHomework = await Homework.insertMany(sampleHomework);
    console.log(`Created ${createdHomework.length} homework assignments`);

    console.log('Sample data created successfully!');
    console.log('\nSample Teachers:');
    createdTeachers.forEach(teacher => {
      console.log(`- ${teacher.name} (${teacher.rollNo}) - ${teacher.department}`);
      console.log(`  Preferred Days: ${teacher.preferredDays.join(', ')}`);
      console.log(`  Subjects: ${teacher.subjectChoices.join(', ')}`);
    });

    console.log('\nSample Homework:');
    createdHomework.forEach(hw => {
      console.log(`- ${hw.subject} for Group ${hw.group} (${hw.status})`);
    });

  } catch (error) {
    console.error('Error creating sample data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createSampleData(); 
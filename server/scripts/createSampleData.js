import mongoose from "mongoose";
import Teacher from "../models/teacher.model.js";
import Homework from "../models/homeworkModel.js";

const sampleTeachers = [
  {
    rollNo: "TCH1001",
    name: "Dr. Aarti Sharma",
    mobileNo: "9876543210",
    email: "aarti.sharma@college.edu",
    department: "Computer Science",
    preferredDays: ["Monday", "Wednesday", "Friday"],
    subjectChoices: ["Data Structures", "Algorithms"],
    designation: "Assistant Professor",
    qualification: "PhD in Computer Science",
    joiningDate: new Date("2018-07-10"),
    password: "Aarti@123", // will be hashed
    isVerified: true,
  },
  {
    rollNo: "TCH1002",
    name: "Prof. Rahul Mehta",
    mobileNo: "9123456780",
    email: "rahul.mehta@college.edu",
    department: "Information Technology",
    preferredDays: ["Tuesday", "Thursday"],
    subjectChoices: ["Database Systems", "Operating Systems"],
    designation: "Professor",
    qualification: "M.Tech in IT",
    joiningDate: new Date("2015-06-01"),
    password: "Rahul@456",
    isVerified: true,
  },
  {
    rollNo: "TCH1003",
    name: "Ms. Neha Verma",
    mobileNo: "9988776655",
    email: "neha.verma@college.edu",
    department: "Electronics",
    preferredDays: ["Monday", "Thursday"],
    subjectChoices: ["Digital Electronics", "Microprocessors"],
    designation: "Lecturer",
    qualification: "M.Sc in Electronics",
    joiningDate: new Date("2020-01-15"),
    password: "Neha@789",
    isVerified: false,
  },
  {
    rollNo: "TCH1004",
    name: "Dr. Mohan Iyer",
    mobileNo: "9001122334",
    email: "mohan.iyer@college.edu",
    department: "Mathematics",
    preferredDays: ["Wednesday", "Friday"],
    subjectChoices: ["Discrete Mathematics", "Linear Algebra"],
    designation: "Associate Professor",
    qualification: "PhD in Mathematics",
    joiningDate: new Date("2012-03-20"),
    password: "Mohan@321",
    isVerified: true,
  },
  {
    rollNo: "TCH1005",
    name: "Mrs. Kavita Joshi",
    mobileNo: "9776655443",
    email: "kavita.joshi@college.edu",
    department: "Physics",
    preferredDays: ["Tuesday", "Saturday"],
    subjectChoices: ["Quantum Mechanics", "Thermodynamics"],
    designation: "Senior Lecturer",
    qualification: "M.Sc in Physics",
    joiningDate: new Date("2019-08-05"),
    password: "Kavita@654",
    isVerified: false,
  },
];

export default sampleTeachers;

const createSampleData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      "mongodb+srv://nishantkumarsingh946:D6PncmqVRjMQuzC0@cluster0.6rhmemq.mongodb.net/pahal?retryWrites=true&w=majority"
    );
    console.log("Connected to MongoDB");

    // Clear existing data
    await Teacher.deleteMany({});
    await Homework.deleteMany({});
    console.log("Cleared existing data");

    // Create teachers
    const createdTeachers = await Teacher.insertMany(sampleTeachers);
    console.log(`Created ${createdTeachers.length} teachers`);

    // Create sample homework
    // const sampleHomework = [
    // {
    //   group: "A",
    //   subject: "Mathematics",
    //   description:
    //     "Complete exercises 1-10 from Chapter 5 on Algebra. Show all your work and submit by the due date.",
    //   dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    //   dateAssigned: new Date(),
    //   status: "pending",
    //   assignedBy: createdTeachers[0]._id, // Nishant
    // },
    // {
    //   group: "B",
    //   subject: "Science",
    //   description:
    //     "Read Chapter 3 on Plant Life Cycle and answer questions 1-15. Include diagrams where necessary.",
    //   dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    //   dateAssigned: new Date(),
    //   status: "pending",
    //   assignedBy: createdTeachers[1]._id, // Somesh
    // },
    // {
    //   group: "C",
    //   subject: "English",
    //   description:
    //     'Write a 500-word essay on "Environmental Conservation". Follow proper essay structure with introduction, body, and conclusion.',
    //   dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    //   dateAssigned: new Date(),
    //   status: "pending",
    //   assignedBy: createdTeachers[2]._id, // Pratyaksh
    // },
    // {
    //   group: "A",
    //   subject: "Computer Science",
    //   description:
    //     "Create a simple calculator program using Python. Include basic operations: addition, subtraction, multiplication, and division.",
    //   dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    //   dateAssigned: new Date(),
    //   status: "pending",
    //   assignedBy: createdTeachers[3]._id, // Priya
    // },
    // {
    //   group: "B",
    //   subject: "Mathematics",
    //   description:
    //     "Solve geometry problems from worksheet pages 45-50. Use proper formulas and show calculations.",
    //   dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    //   dateAssigned: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    //   status: "completed",
    //   assignedBy: createdTeachers[0]._id, // Nishant
    // },
    // {
    //   group: "C",
    //   subject: "Physics",
    //   description:
    //     'Complete the lab report on "Simple Pendulum Experiment". Include observations, calculations, and conclusions.',
    //   dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    //   dateAssigned: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    //   status: "completed",
    //   assignedBy: createdTeachers[1]._id, // Somesh
    // },
    // ];

    //   const createdHomework = await Homework.insertMany(sampleHomework);
    //   console.log(`Created ${createdHomework.length} homework assignments`);

    //   console.log("Sample data created successfully!");
    //   console.log("\nSample Teachers:");
    //   createdTeachers.forEach((teacher) => {
    //     console.log(
    //       `- ${teacher.name} (${teacher.rollNo}) - ${teacher.department}`
    //     );
    //     console.log(`  Preferred Days: ${teacher.preferredDays.join(", ")}`);
    //     console.log(`  Subjects: ${teacher.subjectChoices.join(", ")}`);
    //   });
    //
    //   console.log("\nSample Homework:");
    //   createdHomework.forEach((hw) => {
    //     console.log(`- ${hw.subject} for Group ${hw.group} (${hw.status})`);
    //   });
    // } catch (error) {
    //   console.error("Error creating sample data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

createSampleData();

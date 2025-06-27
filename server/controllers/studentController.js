import Student from '../models/studentModel.js';


// add student
export const addStudent = async (req, res) => {
  try {
    const { name, joinDate, grade, rollNumber, group, parentName, address, contact } = req.body;

    console.log("Adding student with details:", req.body);  
    // Validate required fields
    if (!name || !joinDate || !grade || !rollNumber || !group || !parentName || !address || !contact) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // check if student already exists
    const student= await Student.findOne({ rollNumber });
    if (student) {
      return res.status(400).json({ message: 'Student with this roll number already exists' });
    }
    const newStudent = new Student({ name, joinDate, grade, rollNumber, group, parentName, address, contact });
    await newStudent.save();
    res.status(201).json({ message: 'Student added successfully', student: newStudent });
  } catch (error) {
    res.status(500).json({ message: 'Error adding student', error: error.message });
  }
};
// get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    // Map _id to id for frontend compatibility
    res.status(200).json(students.map(s => ({ ...s.toObject(), id: s._id })));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};

// update student
export const updateStudent = async (req, res) => {
  try {
    const { name, rollNumber, group, parentName, address, contact } = req.body;
    // Check if roll number is already taken by another student
    const existingStudent = await Student.findOne({ rollNumber, _id: { $ne: req.params.id } });
    if (existingStudent) {
      return res.status(400).json({ message: 'Roll number already taken by another student' });
    }
    
    // Validate required fields
    if (!name || !rollNumber || !group || !parentName || !address ||
        !contact) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Check if student exists
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { rollNumber , name, group, parentName, address, contact },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
};
// delete student 
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Student.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student", error: error.message });
  }
};


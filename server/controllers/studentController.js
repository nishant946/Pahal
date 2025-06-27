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
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};

// update student
export const updateStudent = async (req, res) => {
  try {
    const { name, rollNumber, group, parentName, address, contact } = req.body;
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
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
};  


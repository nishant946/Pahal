import Homework from "../models/homeworkModel.js";
import Teacher from "../models/teacher.model.js";

export const createHomework = async (req, res) => {
  try {
    const { group, subject, description, dueDate, assignedBy } = req.body;

    // Validate required fields
    if (!group || !subject || !description || !dueDate || !assignedBy) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const homework = new Homework({
      group,
      subject,
      description,
      dueDate,
      assignedBy
    });

    await homework.save();
    
    const populatedHomework = await Homework.findById(homework._id)
      .populate('assignedBy', 'name employeeId department');

    res.status(201).json(populatedHomework);
  } catch (error) {
    console.error("Error creating homework:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllHomework = async (req, res) => {
  try {
    const homework = await Homework.find()
      .populate('assignedBy', 'name employeeId department')
      .sort({ createdAt: -1 });
    
    res.status(200).json(homework);
  } catch (error) {
    console.error("Error fetching homework:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getHomeworkByGroup = async (req, res) => {
  try {
    const { group } = req.params;
    
    if (!group || !['A', 'B', 'C'].includes(group)) {
      return res.status(400).json({ message: "Valid group (A, B, or C) is required" });
    }

    const homework = await Homework.find({ group })
      .populate('assignedBy', 'name employeeId department')
      .sort({ createdAt: -1 });
    
    res.status(200).json(homework);
  } catch (error) {
    console.error("Error fetching homework by group:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getHomeworkByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    const homework = await Homework.find({ assignedBy: teacherId })
      .populate('assignedBy', 'name employeeId department')
      .sort({ createdAt: -1 });
    
    res.status(200).json(homework);
  } catch (error) {
    console.error("Error fetching homework by teacher:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRecentHomework = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const homework = await Homework.find({ dateAssigned: { $gte: today } })
      .populate('assignedBy', 'name employeeId department')
      .sort({ createdAt: -1 });
    
    res.status(200).json(homework);
  } catch (error) {
    console.error("Error fetching recent homework:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getYesterdayHomework = async (req, res) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const homework = await Homework.find({
      dateAssigned: { $gte: yesterday, $lt: today }
    })
      .populate('assignedBy', 'name employeeId department')
      .sort({ createdAt: -1 });
    
    res.status(200).json(homework);
  } catch (error) {
    console.error("Error fetching yesterday's homework:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateHomework = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const homework = await Homework.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('assignedBy', 'name employeeId department');

    if (!homework) {
      return res.status(404).json({ message: "Homework not found" });
    }

    res.status(200).json(homework);
  } catch (error) {
    console.error("Error updating homework:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteHomework = async (req, res) => {
  try {
    const { id } = req.params;

    const homework = await Homework.findByIdAndDelete(id);

    if (!homework) {
      return res.status(404).json({ message: "Homework not found" });
    }

    res.status(200).json({ message: "Homework deleted successfully" });
  } catch (error) {
    console.error("Error deleting homework:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getHomeworkStats = async (req, res) => {
  try {
    const totalHomework = await Homework.countDocuments();
    const pendingHomework = await Homework.countDocuments({ status: 'pending' });
    const completedHomework = await Homework.countDocuments({ status: 'completed' });
    
    const groupStats = await Homework.aggregate([
      {
        $group: {
          _id: '$group',
          count: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json({
      total: totalHomework,
      pending: pendingHomework,
      completed: completedHomework,
      groupStats
    });
  } catch (error) {
    console.error("Error fetching homework stats:", error);
    res.status(500).json({ message: "Server error" });
  }
}; 
import Contributor from '../models/contributorModel.js';

// Get all contributors (public endpoint)
const getAllContributors = async (req, res) => {
  try {
    const contributors = await Contributor.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .select('-__v');
    
    res.status(200).json({
      success: true,
      data: contributors
    });
  } catch (error) {
    console.error('Error fetching contributors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contributors',
      error: error.message
    });
  }
};

// Get all contributors for admin (includes inactive)
const getAllContributorsAdmin = async (req, res) => {
  try {
    const contributors = await Contributor.find()
      .sort({ order: 1, createdAt: 1 })
      .select('-__v');
    
    res.status(200).json({
      success: true,
      data: contributors
    });
  } catch (error) {
    console.error('Error fetching contributors for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contributors',
      error: error.message
    });
  }
};

// Get contributor by ID
const getContributorById = async (req, res) => {
  try {
    const { id } = req.params;
    const contributor = await Contributor.findById(id).select('-__v');
    
    if (!contributor) {
      return res.status(404).json({
        success: false,
        message: 'Contributor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: contributor
    });
  } catch (error) {
    console.error('Error fetching contributor:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contributor',
      error: error.message
    });
  }
};

// Create new contributor (admin only)
const createContributor = async (req, res) => {
  try {
    const {
      name,
      role,
      description,
      image,
      linkedinUrl,
      githubUrl,
      websiteUrl,
      email,
      order,
      isActive
    } = req.body;

    // Validate required fields
    if (!name || !role || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name, role, and description are required'
      });
    }

    // Create new contributor
    const contributor = new Contributor({
      name,
      role,
      description,
      image,
      linkedinUrl,
      githubUrl,
      websiteUrl,
      email,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    const savedContributor = await contributor.save();
    
    res.status(201).json({
      success: true,
      message: 'Contributor created successfully',
      data: savedContributor
    });
  } catch (error) {
    console.error('Error creating contributor:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating contributor',
      error: error.message
    });
  }
};

// Update contributor (admin only)
const updateContributor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const contributor = await Contributor.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!contributor) {
      return res.status(404).json({
        success: false,
        message: 'Contributor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contributor updated successfully',
      data: contributor
    });
  } catch (error) {
    console.error('Error updating contributor:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contributor',
      error: error.message
    });
  }
};

// Delete contributor (admin only)
const deleteContributor = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contributor = await Contributor.findByIdAndDelete(id);
    
    if (!contributor) {
      return res.status(404).json({
        success: false,
        message: 'Contributor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Contributor deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contributor:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting contributor',
      error: error.message
    });
  }
};

// Toggle contributor active status (admin only)
const toggleContributorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contributor = await Contributor.findById(id);
    
    if (!contributor) {
      return res.status(404).json({
        success: false,
        message: 'Contributor not found'
      });
    }
    
    contributor.isActive = !contributor.isActive;
    await contributor.save();
    
    res.status(200).json({
      success: true,
      message: `Contributor ${contributor.isActive ? 'activated' : 'deactivated'} successfully`,
      data: contributor
    });
  } catch (error) {
    console.error('Error toggling contributor status:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling contributor status',
      error: error.message
    });
  }
};

export {
  getAllContributors,
  getAllContributorsAdmin,
  getContributorById,
  createContributor,
  updateContributor,
  deleteContributor,
  toggleContributorStatus
};
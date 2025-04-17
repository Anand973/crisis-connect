// backend/controllers/resourceController.js
const Resource = require('../models/Resource');

/**
 * @desc    Create a new resource request
 * @route   POST /api/resources
 * @access  Private
 */
const createResourceRequest = async (req, res) => {
  try {
    const { needsMedical, needsFood, needsShelter, longitude, latitude } = req.body;
console.log("hello this is the try block");
    // Validate that at least one resource is requested
    if (!needsMedical && !needsFood && !needsShelter) {
      return res.status(400).json({ 
        message: 'Please select at least one resource need (medical, food, or shelter)' 
      });
    }

    // Validate location data
    if (!longitude || !latitude) {
      return res.status(400).json({ message: 'Location data is required' });
    }
console.log("user:"+req.user);
    // Create resource request
    const resourceRequest = await Resource.create({
      userId: req.user._id,
      needsMedical,
      needsFood,
      needsShelter,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      }
    });

    res.status(201).json({
      success: true,
      data: resourceRequest
    });
  } catch (error) {
    console.error('Error creating resource request:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * @desc    Get all resource requests
 * @route   GET /api/resources
 * @access  Private (Admin or Provider)
 */
const getResourceRequests = async (req, res) => {
  try {
    // Get query parameters for filtering
    const { status, type } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Add status filter if provided
    if (status) {
      filter.status = status;
    }
    
    // Add resource type filter if provided
    if (type === 'medical') {
      filter.needsMedical = true;
    } else if (type === 'food') {
      filter.needsFood = true;
    } else if (type === 'shelter') {
      filter.needsShelter = true;
    }
    
    // Get resources
    const resources = await Resource.find(filter)
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate('userId', 'firstName lastName email');
    
    res.json(resources);
  } catch (error) {
    console.error('Error fetching resource requests:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * @desc    Get resources near a location
 * @route   GET /api/resources/nearby
 * @access  Private
 */
const getNearbyResources = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query; // maxDistance in meters, default 10km
    
    if (!longitude || !latitude) {
      return res.status(400).json({ message: 'Location coordinates are required' });
    }
    
    const resources = await Resource.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    }).populate('userId', 'firstName lastName');
    
    res.json(resources);
  } catch (error) {
    console.error('Error fetching nearby resources:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * @desc    Get a single resource request
 * @route   GET /api/resources/:id
 * @access  Private
 */
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('userId', 'firstName lastName email');
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource request not found' });
    }
    
    res.json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * @desc    Update resource request status
 * @route   PUT /api/resources/:id
 * @access  Private (Admin or Provider)
 */
const updateResourceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'in-progress', 'fulfilled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource request not found' });
    }
    
    resource.status = status;
    resource.updatedAt = Date.now();
    
    const updatedResource = await resource.save();
    
    res.json(updatedResource);
  } catch (error) {
    console.error('Error updating resource status:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * @desc    Delete a resource request
 * @route   DELETE /api/resources/:id
 * @access  Private
 */
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource request not found' });
    }
    
    // Check if user owns this resource or is admin
    if (resource.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this resource request' });
    }
    
    await resource.remove();
    
    res.json({ message: 'Resource request removed' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = {
  createResourceRequest,
  getResourceRequests,
  getNearbyResources,
  getResourceById,
  updateResourceStatus,
  deleteResource
};
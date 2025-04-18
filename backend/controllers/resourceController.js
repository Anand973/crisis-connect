const ResourceRequest = require('../models/ResourceRequest');

exports.createResourceRequest = async (req, res) => {
  try {
    const { resources, longitude, latitude } = req.body;
    
    // Validate input
    if (!resources || (!resources.medical && !resources.food && !resources.shelter)) {
      return res.status(400).json({ message: 'At least one resource must be selected' });
    }

    if (!longitude || !latitude) {
      return res.status(400).json({ message: 'Location is required' });
    }

    const resourceRequest = new ResourceRequest({
      // No user ID required
      resources: {
        medical: resources.medical || false,
        food: resources.food || false,
        shelter: resources.shelter || false
      },
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      }
    });

    await resourceRequest.save();

    res.status(201).json({ message: 'Resource request created successfully', resourceRequest });
  } catch (error) {
    console.error('Create resource request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getResourceRequests = async (req, res) => {
  try {
    // Get all resource requests without filtering by user ID
    const resourceRequests = await ResourceRequest.find({});
    console.log('Found resource requests:', resourceRequests);
    res.status(200).json(resourceRequests);
  } catch (error) {
    console.error('Get resource requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateResourceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { resources, longitude, latitude } = req.body;
    const userId = req.user._id;

    const resourceRequest = await ResourceRequest.findOne({ _id: id, user: userId });

    if (!resourceRequest) {
      return res.status(404).json({ message: 'Resource request not found' });
    }

    // Validate input
    if (resources && !resources.medical && !resources.food && !resources.shelter) {
      return res.status(400).json({ message: 'At least one resource must be selected' });
    }

    if (longitude && latitude) {
      resourceRequest.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      };
    }

    if (resources) {
      resourceRequest.resources = {
        medical: resources.medical || false,
        food: resources.food || false,
        shelter: resources.shelter || false
      };
    }

    await resourceRequest.save();

    res.status(200).json({ message: 'Resource request updated successfully', resourceRequest });
  } catch (error) {
    console.error('Update resource request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteResourceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const resourceRequest = await ResourceRequest.findOneAndDelete({ _id: id, user: userId });

    if (!resourceRequest) {
      return res.status(404).json({ message: 'Resource request not found' });
    }

    res.status(200).json({ message: 'Resource request deleted successfully' });
  } catch (error) {
    console.error('Delete resource request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// backend/routes/resourceRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createResourceRequest,
  getResourceRequests,
  getNearbyResources,
  getResourceById,
  updateResourceStatus,
  deleteResource
} = require('../controllers/resourceController');
const { protect, authorize } = require('../middlewares/auth');

// Resource request routes
router.post('/', protect, createResourceRequest);
router.get('/', protect, getResourceRequests);
router.get('/nearby', protect, getNearbyResources);
router.get('/:id', protect, getResourceById);
router.put('/:id', protect, updateResourceStatus);
router.delete('/:id', protect, deleteResource);

module.exports = router;
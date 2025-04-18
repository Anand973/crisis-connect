const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

// Create a new resource request (no auth required)
router.post('/', resourceController.createResourceRequest);

// Get all resource requests (no auth required)
router.get('/resources', resourceController.getResourceRequests);

// Update a resource request (no auth required)
router.put('/:id', resourceController.updateResourceRequest);

// Delete a resource request (no auth required)
router.delete('/:id', resourceController.deleteResourceRequest);

module.exports = router;
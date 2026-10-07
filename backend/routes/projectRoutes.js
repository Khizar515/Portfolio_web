const express = require('express');
const router = express.Router();
const { getProjects, getProjectBySlug, createProject, updateProject, deleteProject, getProjectGallery, addProjectGalleryImage, deleteProjectGalleryImage } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);
router.get('/:slug/gallery', getProjectGallery);

// Protected routes (mapped to /api/admin/projects in server.js, actually I mapped them to /api/projects here so I should just protect them here)
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

router.post('/:id/gallery', protect, addProjectGalleryImage);
router.delete('/gallery/:galleryId', protect, deleteProjectGalleryImage);

module.exports = router;

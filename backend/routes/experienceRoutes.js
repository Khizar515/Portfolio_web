const express = require('express');
const router = express.Router();
const { getExperience, getExperienceById, createExperience, updateExperience, deleteExperience } = require('../controllers/experienceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getExperience);
router.get('/:id', getExperienceById);
router.post('/', protect, createExperience);
router.put('/:id', protect, updateExperience);
router.delete('/:id', protect, deleteExperience);

module.exports = router;

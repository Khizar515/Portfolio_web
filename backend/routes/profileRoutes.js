const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getProfile);
router.put('/', protect, upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), updateProfile);

module.exports = router;

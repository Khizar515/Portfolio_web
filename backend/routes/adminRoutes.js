const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  getStats,
  exportDatabase,
  getLastExport,
  generateResume,
  uploadMedia,
  getMedia,
  deleteMedia
} = require('../controllers/adminController');

router.use(protect);

router.get('/stats', getStats);
router.post('/db/export', exportDatabase);
router.get('/db/last-export', getLastExport);
router.get('/resume/generate', generateResume);

// Media routes
router.post('/media/upload', upload.single('file'), uploadMedia);
router.get('/media', getMedia);
router.delete('/media/:filename', deleteMedia);

module.exports = router;

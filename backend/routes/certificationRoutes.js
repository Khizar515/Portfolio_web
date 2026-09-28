const express = require('express');
const router = express.Router();
const { getCertifications, getCertificationById, createCertification, updateCertification, deleteCertification } = require('../controllers/certificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getCertifications);
router.get('/:id', getCertificationById);
router.post('/', protect, createCertification);
router.put('/:id', protect, updateCertification);
router.delete('/:id', protect, deleteCertification);

module.exports = router;

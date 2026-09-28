const express = require('express');
const router = express.Router();
const { loginUser, changePassword, changeUsername } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.put('/change-password', protect, changePassword);
router.put('/change-username', protect, changeUsername);

module.exports = router;

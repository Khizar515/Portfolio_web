const express = require('express');
const router = express.Router();
const { getMessages, createMessage, updateMessageStatus, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', createMessage); // Public endpoint for contact form
router.get('/', protect, getMessages);
router.put('/:id', protect, updateMessageStatus);
router.delete('/:id', protect, deleteMessage);

module.exports = router;

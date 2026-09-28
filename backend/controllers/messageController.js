const db = require('../config/db');

const getMessages = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Inquiries ORDER BY Created_At DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createMessage = async (req, res) => {
  const { Sender_Name, Sender_Email, Subject, Message_Body } = req.body;
  if (!Sender_Name || !Sender_Email || !Message_Body) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    await db.query(
      'INSERT INTO Inquiries (Sender_Name, Sender_Email, Subject, Message_Body) VALUES (?, ?, ?, ?)',
      [Sender_Name, Sender_Email, Subject || '', Message_Body]
    );
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
};

const updateMessageStatus = async (req, res) => {
  const { Is_Read } = req.body;
  try {
    await db.query('UPDATE Inquiries SET Is_Read=? WHERE Message_ID=?', [Is_Read ? 1 : 0, req.params.id]);
    res.json({ message: 'Message status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating message' });
  }
};

const deleteMessage = async (req, res) => {
  try {
    await db.query('DELETE FROM Inquiries WHERE Message_ID=?', [req.params.id]);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message' });
  }
};

module.exports = { getMessages, createMessage, updateMessageStatus, deleteMessage };

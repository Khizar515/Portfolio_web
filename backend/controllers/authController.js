const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password' });
  }

  try {
    const [users] = await db.query('SELECT * FROM Admin_Users WHERE Username = ? LIMIT 1', [username]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.Password_Hash);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.Admin_ID, username: user.Username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.Admin_ID, username: user.Username }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error during login' });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const adminId = req.user.id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Please provide current and new password' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  try {
    const [users] = await db.query('SELECT * FROM Admin_Users WHERE Admin_ID = ? LIMIT 1', [adminId]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(currentPassword, user.Password_Hash);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(12);
    const newHash = await bcrypt.hash(newPassword, salt);

    await db.query('UPDATE Admin_Users SET Password_Hash = ? WHERE Admin_ID = ?', [newHash, adminId]);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error changing password' });
  }
};

const changeUsername = async (req, res) => {
  const { currentPassword, newUsername } = req.body;
  const adminId = req.user.id;

  if (!currentPassword || !newUsername) {
    return res.status(400).json({ message: 'Please provide current password and new username' });
  }
  if (newUsername.length < 3) {
    return res.status(400).json({ message: 'Username must be at least 3 characters' });
  }

  try {
    const [users] = await db.query('SELECT * FROM Admin_Users WHERE Admin_ID = ? LIMIT 1', [adminId]);
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = users[0];
    const isMatch = await bcrypt.compare(currentPassword, user.Password_Hash);
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

    // Check uniqueness
    const [existing] = await db.query('SELECT Admin_ID FROM Admin_Users WHERE Username = ? AND Admin_ID != ?', [newUsername, adminId]);
    if (existing.length > 0) return res.status(409).json({ message: 'Username already taken' });

    await db.query('UPDATE Admin_Users SET Username = ? WHERE Admin_ID = ?', [newUsername, adminId]);
    res.json({ message: 'Username changed successfully', username: newUsername });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error changing username' });
  }
};

module.exports = { loginUser, changePassword, changeUsername };

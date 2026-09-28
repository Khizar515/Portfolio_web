const db = require('../config/db');

const getProfile = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Profile LIMIT 1');
    if (rows.length > 0) res.json(rows[0]);
    else res.status(404).json({ message: 'Profile not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateProfile = async (req, res) => {
  const { Full_Name, Tagline, Bio_HTML, GitHub_URL, LinkedIn_URL, Email } = req.body;
  
  let Avatar_Path = req.body.Avatar_Path;
  let Resume_Path = req.body.Resume_Path;
  
  // Handle file uploads
  if (req.files) {
    if (req.files['avatar']) Avatar_Path = req.files['avatar'][0].filename;
    if (req.files['resume']) Resume_Path = req.files['resume'][0].filename;
  }
  
  try {
    // Check if profile exists
    const [existing] = await db.query('SELECT Profile_ID FROM Profile LIMIT 1');
    
    if (existing.length > 0) {
      await db.query(
        'UPDATE Profile SET Full_Name=?, Tagline=?, Bio_HTML=?, GitHub_URL=?, LinkedIn_URL=?, Email=?, Avatar_Path=?, Resume_Path=? WHERE Profile_ID=?',
        [Full_Name, Tagline, Bio_HTML, GitHub_URL, LinkedIn_URL, Email, Avatar_Path, Resume_Path, existing[0].Profile_ID]
      );
    } else {
      await db.query(
        'INSERT INTO Profile (Full_Name, Tagline, Bio_HTML, GitHub_URL, LinkedIn_URL, Email, Avatar_Path, Resume_Path) VALUES (?,?,?,?,?,?,?,?)',
        [Full_Name, Tagline, Bio_HTML, GitHub_URL, LinkedIn_URL, Email, Avatar_Path, Resume_Path]
      );
    }
    res.json({ message: 'Profile updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

module.exports = { getProfile, updateProfile };

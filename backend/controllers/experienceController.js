const db = require('../config/db');

const getExperience = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Experience ORDER BY Sort_Order ASC, Start_Date DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getExperienceById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Experience WHERE Exp_ID = ? LIMIT 1', [req.params.id]);
    if (rows.length > 0) res.json(rows[0]);
    else res.status(404).json({ message: 'Experience not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createExperience = async (req, res) => {
  const { Job_Title, Company, Start_Date, End_Date, Is_Current, Achievements_HTML, Tech_Tags, Attachment_Path, Sort_Order } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Experience (Job_Title, Company, Start_Date, End_Date, Is_Current, Achievements_HTML, Tech_Tags, Attachment_Path, Sort_Order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [Job_Title, Company, Start_Date, End_Date, Is_Current || 0, Achievements_HTML, JSON.stringify(Tech_Tags), Attachment_Path || null, Sort_Order || 0]
    );
    res.status(201).json({ message: 'Experience created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating experience' });
  }
};

const updateExperience = async (req, res) => {
  const { Job_Title, Company, Start_Date, End_Date, Is_Current, Achievements_HTML, Tech_Tags, Attachment_Path, Sort_Order } = req.body;
  try {
    await db.query(
      'UPDATE Experience SET Job_Title=?, Company=?, Start_Date=?, End_Date=?, Is_Current=?, Achievements_HTML=?, Tech_Tags=?, Attachment_Path=?, Sort_Order=? WHERE Exp_ID=?',
      [Job_Title, Company, Start_Date, End_Date, Is_Current, Achievements_HTML, JSON.stringify(Tech_Tags), Attachment_Path || null, Sort_Order, req.params.id]
    );
    res.json({ message: 'Experience updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating experience' });
  }
};

const deleteExperience = async (req, res) => {
  try {
    await db.query('DELETE FROM Experience WHERE Exp_ID=?', [req.params.id]);
    res.json({ message: 'Experience deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting experience' });
  }
};

module.exports = { getExperience, getExperienceById, createExperience, updateExperience, deleteExperience };

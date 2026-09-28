const db = require('../config/db');

const getSkills = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Skills ORDER BY Category, Sort_Order ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createSkill = async (req, res) => {
  const { Name, Category, Proficiency_Level, Sort_Order } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Skills (Name, Category, Proficiency_Level, Sort_Order) VALUES (?, ?, ?, ?)',
      [Name, Category, Proficiency_Level || 'intermediate', Sort_Order || 0]
    );
    res.status(201).json({ message: 'Skill created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating skill' });
  }
};

const updateSkill = async (req, res) => {
  const { Name, Category, Proficiency_Level, Sort_Order } = req.body;
  try {
    await db.query(
      'UPDATE Skills SET Name=?, Category=?, Proficiency_Level=?, Sort_Order=? WHERE Skill_ID=?',
      [Name, Category, Proficiency_Level, Sort_Order, req.params.id]
    );
    res.json({ message: 'Skill updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating skill' });
  }
};

const deleteSkill = async (req, res) => {
  try {
    await db.query('DELETE FROM Skills WHERE Skill_ID=?', [req.params.id]);
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting skill' });
  }
};

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };

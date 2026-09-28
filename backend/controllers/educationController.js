const db = require('../config/db');

const getEducation = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Education ORDER BY Sort_Order ASC, Start_Year DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createEducation = async (req, res) => {
  const { Degree, Institution, Start_Year, End_Year, CGPA, Description, Sort_Order } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Education (Degree, Institution, Start_Year, End_Year, CGPA, Description, Sort_Order) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [Degree, Institution, Start_Year, End_Year, CGPA, Description, Sort_Order || 0]
    );
    res.status(201).json({ message: 'Education created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating education' });
  }
};

const updateEducation = async (req, res) => {
  const { Degree, Institution, Start_Year, End_Year, CGPA, Description, Sort_Order } = req.body;
  try {
    await db.query(
      'UPDATE Education SET Degree=?, Institution=?, Start_Year=?, End_Year=?, CGPA=?, Description=?, Sort_Order=? WHERE Edu_ID=?',
      [Degree, Institution, Start_Year, End_Year, CGPA, Description, Sort_Order, req.params.id]
    );
    res.json({ message: 'Education updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating education' });
  }
};

const deleteEducation = async (req, res) => {
  try {
    await db.query('DELETE FROM Education WHERE Edu_ID=?', [req.params.id]);
    res.json({ message: 'Education deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting education' });
  }
};

module.exports = { getEducation, createEducation, updateEducation, deleteEducation };

const db = require('../config/db');

const getProjects = async (req, res) => {
  try {
    let query = "SELECT * FROM Projects WHERE Status = 'published' ORDER BY Created_At DESC";
    if (req.query.admin === 'true') {
      query = "SELECT * FROM Projects ORDER BY Created_At DESC";
    }
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getProjectBySlug = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Projects WHERE Slug = ? LIMIT 1', [req.params.slug]);
    if (rows.length > 0) res.json(rows[0]);
    else res.status(404).json({ message: 'Project not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createProject = async (req, res) => {
  const { Title, Slug, Summary, Description_HTML, Repo_URL, Live_URL, Image_Path, Tech_Tags, Status, Is_Featured } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Projects (Title, Slug, Summary, Description_HTML, Repo_URL, Live_URL, Image_Path, Tech_Tags, Status, Is_Featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [Title, Slug, Summary, Description_HTML, Repo_URL, Live_URL, Image_Path, JSON.stringify(Tech_Tags), Status || 'published', Is_Featured || 0]
    );
    res.status(201).json({ message: 'Project created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};

const updateProject = async (req, res) => {
  const { Title, Slug, Summary, Description_HTML, Repo_URL, Live_URL, Image_Path, Tech_Tags, Status, Is_Featured } = req.body;
  try {
    await db.query(
      'UPDATE Projects SET Title=?, Slug=?, Summary=?, Description_HTML=?, Repo_URL=?, Live_URL=?, Image_Path=?, Tech_Tags=?, Status=?, Is_Featured=? WHERE Project_ID=?',
      [Title, Slug, Summary, Description_HTML, Repo_URL, Live_URL, Image_Path, JSON.stringify(Tech_Tags), Status, Is_Featured, req.params.id]
    );
    res.json({ message: 'Project updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    await db.query('DELETE FROM Projects WHERE Project_ID=?', [req.params.id]);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
};

module.exports = { getProjects, getProjectBySlug, createProject, updateProject, deleteProject };

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
  const { Title, Slug, Summary, Description_HTML, Repo_URL, Live_URL, Image_Path, Video_URL, Role, Tech_Tags, Status, Is_Featured } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Projects (Title, Slug, Summary, Description_HTML, Repo_URL, Live_URL, Image_Path, Video_URL, Role, Tech_Tags, Status, Is_Featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [Title, Slug, Summary, Description_HTML, Repo_URL, Live_URL, Image_Path, Video_URL || null, Role || null, JSON.stringify(Tech_Tags), Status || 'published', Is_Featured || 0]
    );
    res.status(201).json({ message: 'Project created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};

const updateProject = async (req, res) => {
  const { Title, Slug, Summary, Description_HTML, Repo_URL, Live_URL, Image_Path, Video_URL, Role, Tech_Tags, Status, Is_Featured } = req.body;
  try {
    await db.query(
      'UPDATE Projects SET Title=?, Slug=?, Summary=?, Description_HTML=?, Repo_URL=?, Live_URL=?, Image_Path=?, Video_URL=?, Role=?, Tech_Tags=?, Status=?, Is_Featured=? WHERE Project_ID=?',
      [Title, Slug, Summary, Description_HTML, Repo_URL, Live_URL, Image_Path, Video_URL || null, Role || null, JSON.stringify(Tech_Tags), Status, Is_Featured, req.params.id]
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

const getProjectGallery = async (req, res) => {
  try {
    const [project] = await db.query('SELECT Project_ID FROM Projects WHERE Slug = ? LIMIT 1', [req.params.slug]);
    if (project.length === 0) return res.status(404).json({ message: 'Project not found' });
    
    const [rows] = await db.query('SELECT * FROM Project_Gallery WHERE Project_ID = ? ORDER BY Sort_Order ASC', [project[0].Project_ID]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const addProjectGalleryImage = async (req, res) => {
  const { Image_Path, Caption, Sort_Order } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Project_Gallery (Project_ID, Image_Path, Caption, Sort_Order) VALUES (?, ?, ?, ?)',
      [req.params.id, Image_Path, Caption || null, Sort_Order || 0]
    );
    res.status(201).json({ message: 'Image added to gallery', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error adding image to gallery' });
  }
};

const deleteProjectGalleryImage = async (req, res) => {
  try {
    await db.query('DELETE FROM Project_Gallery WHERE Gallery_ID=?', [req.params.galleryId]);
    res.json({ message: 'Image deleted from gallery' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting image' });
  }
};

module.exports = { getProjects, getProjectBySlug, createProject, updateProject, deleteProject, getProjectGallery, addProjectGalleryImage, deleteProjectGalleryImage };

const db = require('../config/db');

const getCertifications = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Certifications ORDER BY Sort_Order ASC, Date_Issued DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getCertificationById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Certifications WHERE Cert_ID = ? LIMIT 1', [req.params.id]);
    if (rows.length > 0) res.json(rows[0]);
    else res.status(404).json({ message: 'Certification not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createCertification = async (req, res) => {
  const { Name, Issuer, Date_Issued, Credential_URL, Description_HTML, Competency_Tags, Attachment_Path, Sort_Order } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Certifications (Name, Issuer, Date_Issued, Credential_URL, Description_HTML, Competency_Tags, Attachment_Path, Sort_Order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [Name, Issuer, Date_Issued, Credential_URL, Description_HTML || null, JSON.stringify(Competency_Tags), Attachment_Path || null, Sort_Order || 0]
    );
    res.status(201).json({ message: 'Certification created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating certification' });
  }
};

const updateCertification = async (req, res) => {
  const { Name, Issuer, Date_Issued, Credential_URL, Description_HTML, Competency_Tags, Attachment_Path, Sort_Order } = req.body;
  try {
    await db.query(
      'UPDATE Certifications SET Name=?, Issuer=?, Date_Issued=?, Credential_URL=?, Description_HTML=?, Competency_Tags=?, Attachment_Path=?, Sort_Order=? WHERE Cert_ID=?',
      [Name, Issuer, Date_Issued, Credential_URL, Description_HTML || null, JSON.stringify(Competency_Tags), Attachment_Path || null, Sort_Order, req.params.id]
    );
    res.json({ message: 'Certification updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating certification' });
  }
};

const deleteCertification = async (req, res) => {
  try {
    await db.query('DELETE FROM Certifications WHERE Cert_ID=?', [req.params.id]);
    res.json({ message: 'Certification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting certification' });
  }
};

module.exports = { getCertifications, getCertificationById, createCertification, updateCertification, deleteCertification };

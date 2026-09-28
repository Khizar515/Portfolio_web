const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: [frontendUrl, 'http://localhost:3001', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/exports', express.static(path.join(__dirname, 'exports')));

// Ensure directories exist
['uploads', 'exports'].forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
});

app.get('/', (req, res) => {
  res.send('Portfolio API is running...');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/experience', require('./routes/experienceRoutes'));
app.use('/api/education', require('./routes/educationRoutes'));
app.use('/api/certifications', require('./routes/certificationRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|webp|pdf|mp4|webm|ogg|mov/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  // Mimetype check can be relaxed for videos as they vary
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images, PDFs, and videos (mp4, webm, ogg, mov) are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit to allow videos
  },
  fileFilter: fileFilter
});

module.exports = upload;

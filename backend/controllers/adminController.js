const db = require('../config/db');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

// Get Dashboard Stats
const getStats = async (req, res) => {
  try {
    const [[projects]] = await db.query('SELECT COUNT(*) as count FROM Projects');
    const [[published]] = await db.query("SELECT COUNT(*) as count FROM Projects WHERE Status = 'published'");
    const [[featured]] = await db.query('SELECT COUNT(*) as count FROM Projects WHERE Is_Featured = 1');
    const [[experience]] = await db.query('SELECT COUNT(*) as count FROM Experience');
    const [[education]] = await db.query('SELECT COUNT(*) as count FROM Education');
    const [[skills]] = await db.query('SELECT COUNT(*) as count FROM Skills');
    const [[inquiriesTotal]] = await db.query('SELECT COUNT(*) as count FROM Inquiries');
    const [[inquiriesUnread]] = await db.query('SELECT COUNT(*) as count FROM Inquiries WHERE Is_Read = 0');
    
    res.json({
      projects: projects.count,
      projectsPublished: published.count,
      projectsFeatured: featured.count,
      experience: experience.count,
      education: education.count,
      skills: skills.count,
      inquiries: inquiriesTotal.count,
      unreadInquiries: inquiriesUnread.count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching stats' });
  }
};

// Export Database
const exportDatabase = async (req, res) => {
  try {
    const filename = `backup-${Date.now()}.sql`;
    const exportPath = path.join(__dirname, '../exports', filename);
    
    // Use mariadb-dump (alpine mysql-client ships this; mysqldump is deprecated and fails TLS)
    // --no-tablespaces suppresses the PROCESS privilege warning for non-root DB users
    const cmd = `mariadb-dump --skip-ssl --no-tablespaces -h ${process.env.DB_HOST} -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} > ${exportPath}`;
    
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).json({ message: 'Error exporting database' });
      }
      
      // Update a "latest.sql" symlink or copy to overwrite init.sql logic if needed
      // Actually, we can just save it as latest.sql in exports
      const latestPath = path.join(__dirname, '../exports', 'latest.sql');
      fs.copyFileSync(exportPath, latestPath);
      
      res.json({ message: 'Database exported successfully', file: filename });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error exporting DB' });
  }
};

// Get Last Export
const getLastExport = (req, res) => {
  const latestPath = path.join(__dirname, '../exports', 'latest.sql');
  if (fs.existsSync(latestPath)) {
    res.download(latestPath, 'portfolio_backup_latest.sql');
  } else {
    res.status(404).json({ message: 'No backup found' });
  }
};

// Generate Resume PDF
const generateResume = async (req, res) => {
  try {
    const [profileRows] = await db.query('SELECT * FROM Profile LIMIT 1');
    const [experience] = await db.query('SELECT * FROM Experience ORDER BY Sort_Order ASC, Start_Date DESC');
    const [education] = await db.query('SELECT * FROM Education ORDER BY Sort_Order ASC, Start_Year DESC');
    const [skills] = await db.query('SELECT * FROM Skills ORDER BY Category, Sort_Order ASC');
    const [certifications] = await db.query('SELECT * FROM Certifications ORDER BY Sort_Order ASC, Date_Issued DESC');

    const prof = profileRows[0] || {};

    /** Format a DB date value (Date object or string) to "Month YYYY" */
    function fmtDate(raw) {
      if (!raw) return '';
      const d = new Date(raw);
      if (isNaN(d)) return String(raw);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', timeZone: 'UTC' });
    }

    /** Format a date range for experience */
    function fmtRange(start, end, isCurrent) {
      const s = fmtDate(start);
      const e = isCurrent ? 'Present' : fmtDate(end);
      return s && e ? `${s} – ${e}` : s || e || '';
    }

    /** Strip HTML tags cleanly */
    function stripHtml(html) {
      if (!html) return '';
      return html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<\/li>/gi, '\n')
        .replace(/<li[^>]*>/gi, '• ')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    }

    /** Compute duration string */
    function duration(start, end, isCurrent) {
      if (!start) return '';
      const s = new Date(start);
      const e = isCurrent ? new Date() : (end ? new Date(end) : null);
      if (!e || isNaN(s) || isNaN(e)) return '';
      const totalMonths = Math.round((e - s) / (1000 * 60 * 60 * 24 * 30.44));
      if (totalMonths < 1) return '';
      if (totalMonths < 12) return `${totalMonths} mo`;
      const yrs = Math.floor(totalMonths / 12);
      const mos = totalMonths % 12;
      return mos > 0 ? `${yrs} yr ${mos} mo` : `${yrs} yr`;
    }

    // --- PDF Setup ---
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const filename = `resume-generated-${Date.now()}.pdf`;
    const filepath = path.join(__dirname, '../exports', filename);
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    const W = doc.page.width - 100; // usable width (margins 50 each side)
    const colors = { heading: '#1a1a2e', text: '#2d2d2d', muted: '#555555', accent: '#2563eb', rule: '#cccccc' };
    const fonts = { regular: 'Helvetica', bold: 'Helvetica-Bold' };

    // ── HEADER ─────────────────────────────────────
    doc.font(fonts.bold).fontSize(22).fillColor(colors.heading)
      .text(prof.Full_Name || 'Resume', { align: 'center' });

    if (prof.Tagline) {
      doc.font(fonts.regular).fontSize(10).fillColor(colors.muted)
        .text(prof.Tagline, { align: 'center' });
    }

    // Contact line
    const contactParts = [];
    if (prof.Email) contactParts.push(prof.Email);
    if (prof.LinkedIn_URL) contactParts.push(prof.LinkedIn_URL.replace('https://', ''));
    if (prof.GitHub_URL) contactParts.push(prof.GitHub_URL.replace('https://', ''));
    if (contactParts.length > 0) {
      doc.moveDown(0.3);
      doc.font(fonts.regular).fontSize(9).fillColor(colors.muted)
        .text(contactParts.join('  |  '), { align: 'center' });
    }

    // ── SECTION HELPER ──────────────────────────────
    function sectionHeader(title) {
      doc.moveDown(1);
      doc.moveTo(50, doc.y).lineTo(50 + W, doc.y).strokeColor(colors.rule).lineWidth(0.5).stroke();
      doc.moveDown(0.4);
      doc.font(fonts.bold).fontSize(12).fillColor(colors.accent).text(title.toUpperCase(), { characterSpacing: 1 });
      doc.moveDown(0.3);
    }

    // ── EXPERIENCE ─────────────────────────────────
    if (experience.length > 0) {
      sectionHeader('Experience');
      experience.forEach((exp, idx) => {
        const dateRange = fmtRange(exp.Start_Date, exp.End_Date, exp.Is_Current);
        const dur = duration(exp.Start_Date, exp.End_Date, exp.Is_Current);
        const dateStr = dur ? `${dateRange}  (${dur})` : dateRange;

        // Title + Company on left, Date on right
        const titleY = doc.y;
        doc.font(fonts.bold).fontSize(11).fillColor(colors.heading)
          .text(`${exp.Job_Title}`, 50, titleY, { continued: true, width: W * 0.65 });
        doc.font(fonts.regular).fontSize(9).fillColor(colors.muted)
          .text(dateStr, { align: 'right', width: W * 0.35 });

        doc.font(fonts.regular).fontSize(10).fillColor(colors.muted)
          .text(exp.Company, 50);

        const body = stripHtml(exp.Achievements_HTML);
        if (body) {
          doc.moveDown(0.2);
          doc.font(fonts.regular).fontSize(9.5).fillColor(colors.text)
            .text(body, 50, doc.y, { width: W, lineGap: 2 });
        }
        if (idx < experience.length - 1) doc.moveDown(0.7);
      });
    }

    // ── EDUCATION ─────────────────────────────────
    if (education.length > 0) {
      sectionHeader('Education');
      education.forEach((edu, idx) => {
        const yearRange = edu.Start_Year && edu.End_Year ? `${edu.Start_Year} – ${edu.End_Year}` : String(edu.Start_Year || '');
        const cgpa = edu.CGPA ? `  ·  CGPA: ${edu.CGPA}` : '';

        const titleY = doc.y;
        doc.font(fonts.bold).fontSize(11).fillColor(colors.heading)
          .text(edu.Degree, 50, titleY, { continued: true, width: W * 0.65 });
        doc.font(fonts.regular).fontSize(9).fillColor(colors.muted)
          .text(yearRange, { align: 'right', width: W * 0.35 });

        doc.font(fonts.regular).fontSize(10).fillColor(colors.muted)
          .text(`${edu.Institution}${cgpa}`, 50);

        if (edu.Description) {
          doc.moveDown(0.2);
          doc.font(fonts.regular).fontSize(9.5).fillColor(colors.text)
            .text(edu.Description, 50, doc.y, { width: W, lineGap: 2 });
        }
        if (idx < education.length - 1) doc.moveDown(0.7);
      });
    }

    // ── SKILLS ────────────────────────────────────
    if (skills.length > 0) {
      sectionHeader('Skills');
      // Group by category
      const grouped = {};
      skills.forEach(sk => {
        if (!grouped[sk.Category]) grouped[sk.Category] = [];
        grouped[sk.Category].push(sk.Name);
      });
      Object.entries(grouped).forEach(([cat, names]) => {
        doc.font(fonts.bold).fontSize(9.5).fillColor(colors.muted)
          .text(`${cat}: `, 50, doc.y, { continued: true });
        doc.font(fonts.regular).fontSize(9.5).fillColor(colors.text)
          .text(names.join(', '), { width: W });
        doc.moveDown(0.35);
      });
    }

    // ── CERTIFICATIONS ────────────────────────────
    if (certifications.length > 0) {
      sectionHeader('Certifications');
      certifications.forEach((cert, idx) => {
        const issued = cert.Date_Issued ? fmtDate(cert.Date_Issued) : '';
        doc.font(fonts.bold).fontSize(10).fillColor(colors.heading)
          .text(cert.Name, 50, doc.y, { continued: true, width: W * 0.65 });
        doc.font(fonts.regular).fontSize(9).fillColor(colors.muted)
          .text(issued, { align: 'right', width: W * 0.35 });
        doc.font(fonts.regular).fontSize(9.5).fillColor(colors.muted)
          .text(cert.Issuer, 50);
        if (idx < certifications.length - 1) doc.moveDown(0.5);
      });
    }

    doc.end();

    stream.on('finish', () => {
      res.download(filepath, 'Khizar_Nadeem_Resume.pdf');
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating resume' });
  }
};

// Media handling
const uploadMedia = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ message: 'File uploaded', filepath: req.file.filename });
};

const getMedia = (req, res) => {
  const uploadDir = path.join(__dirname, '../uploads');
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ message: 'Error reading files' });
    const mediaFiles = files.map(file => {
      const stats = fs.statSync(path.join(uploadDir, file));
      return {
        filename: file,
        url: `/uploads/${file}`,
        size: stats.size,
        createdAt: stats.mtime
      };
    });
    res.json(mediaFiles);
  });
};

const deleteMedia = (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, '../uploads', filename);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
    res.json({ message: 'File deleted' });
  } else {
    res.status(404).json({ message: 'File not found' });
  }
};

module.exports = {
  getStats,
  exportDatabase,
  getLastExport,
  generateResume,
  uploadMedia,
  getMedia,
  deleteMedia
};

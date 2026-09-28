-- ============================================================
-- Portfolio DB Schema + Seed
-- Admin credentials: admin / admin123
-- ============================================================

-- Admin_Users
CREATE TABLE IF NOT EXISTS Admin_Users (
  Admin_ID INT PRIMARY KEY AUTO_INCREMENT,
  Username VARCHAR(50) UNIQUE NOT NULL,
  Password_Hash VARCHAR(255) NOT NULL
);

-- Profile
CREATE TABLE IF NOT EXISTS Profile (
  Profile_ID INT PRIMARY KEY AUTO_INCREMENT,
  Full_Name VARCHAR(100) NOT NULL,
  Tagline VARCHAR(255),
  Bio_HTML TEXT,
  GitHub_URL VARCHAR(255),
  LinkedIn_URL VARCHAR(255),
  Email VARCHAR(150),
  Avatar_Path VARCHAR(255),
  Resume_Path VARCHAR(255)
);

-- Projects
CREATE TABLE IF NOT EXISTS Projects (
  Project_ID INT PRIMARY KEY AUTO_INCREMENT,
  Title VARCHAR(150) NOT NULL,
  Slug VARCHAR(160) UNIQUE NOT NULL,
  Summary VARCHAR(255) NOT NULL,
  Description_HTML TEXT,
  Repo_URL VARCHAR(255),
  Live_URL VARCHAR(255),
  Image_Path VARCHAR(255),
  Tech_Tags JSON,
  Is_Featured BOOLEAN DEFAULT 0,
  Status ENUM('published', 'draft') DEFAULT 'published',
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Experience
CREATE TABLE IF NOT EXISTS Experience (
  Exp_ID INT PRIMARY KEY AUTO_INCREMENT,
  Job_Title VARCHAR(100) NOT NULL,
  Company VARCHAR(100) NOT NULL,
  Start_Date DATE NOT NULL,
  End_Date DATE NULL,
  Is_Current BOOLEAN DEFAULT 0,
  Achievements_HTML TEXT,
  Tech_Tags JSON,
  Attachment_Path VARCHAR(255) DEFAULT NULL,
  Sort_Order INT DEFAULT 0
);

-- Education
CREATE TABLE IF NOT EXISTS Education (
  Edu_ID INT PRIMARY KEY AUTO_INCREMENT,
  Degree VARCHAR(150) NOT NULL,
  Institution VARCHAR(150) NOT NULL,
  Start_Year YEAR,
  End_Year YEAR,
  CGPA DECIMAL(3,2),
  Description TEXT,
  Sort_Order INT DEFAULT 0
);

-- Certifications
CREATE TABLE IF NOT EXISTS Certifications (
  Cert_ID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(150) NOT NULL,
  Issuer VARCHAR(150) NOT NULL,
  Date_Issued DATE,
  Credential_URL VARCHAR(255),
  Attachment_Path VARCHAR(255) DEFAULT NULL,
  Sort_Order INT DEFAULT 0
);

-- Skills
CREATE TABLE IF NOT EXISTS Skills (
  Skill_ID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Category VARCHAR(100) NOT NULL,
  Proficiency_Level ENUM('beginner','intermediate','advanced','expert') DEFAULT 'intermediate',
  Sort_Order INT DEFAULT 0
);

-- Inquiries (Contact Form)
CREATE TABLE IF NOT EXISTS Inquiries (
  Message_ID INT PRIMARY KEY AUTO_INCREMENT,
  Sender_Name VARCHAR(100) NOT NULL,
  Sender_Email VARCHAR(150) NOT NULL,
  Subject VARCHAR(200),
  Message_Body TEXT NOT NULL,
  Is_Read BOOLEAN DEFAULT 0,
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Admin user: admin / admin123  (bcrypt 12 rounds)
INSERT INTO Admin_Users (Username, Password_Hash)
VALUES ('admin', '$2b$12$aIptuQctj/efbDOma0oTMOnBvdLVUxDcqBfXUrdF0yGNUn9F/m7lS');

-- Profile
INSERT INTO Profile (Full_Name, Tagline, Bio_HTML, GitHub_URL, LinkedIn_URL, Email)
VALUES (
  'Your Name',
  'Full-Stack Developer | Aspiring DevOps & Cloud Engineer',
  '<p>I build web and mobile applications and work with cloud infrastructure, Linux, and automated DevOps workflows. Focused on clean architecture, resilient delivery, and performance.</p>',
  'https://github.com/yourname',
  'https://linkedin.com/in/yourname',
  'email@example.com'
);

-- Projects (4 sample projects)
INSERT INTO Projects (Title, Slug, Summary, Description_HTML, Repo_URL, Live_URL, Tech_Tags, Is_Featured, Status) VALUES
(
  'CloudDeploy Automator',
  'clouddeploy-automator',
  'Automated CI/CD and multi-service deployment manager with Docker, GitHub Actions, and AWS EC2 for zero-downtime rolling releases.',
  '<p>Features automated SSL generation, multi-stage artifact caching, and health-check rollback strategies.</p>',
  'https://github.com/khizarnadeem',
  NULL,
  '["Docker", "AWS EC2", "GitHub Actions", "Linux", "Bash"]',
  1,
  'published'
);

-- Experience
INSERT INTO Experience (Job_Title, Company, Start_Date, End_Date, Is_Current, Achievements_HTML, Tech_Tags, Sort_Order) VALUES
(
  'DevOps & Cloud Intern',
  'TechNova Solutions',
  '2026-01-01',
  NULL,
  1,
  '<p>Leading containerization of internal microservices with Docker and building streamlined CI/CD pipelines through GitHub Actions. Managing Linux server environments, automating system provisioning, and establishing Tailscale mesh overlays for secure zero-trust developer connectivity.</p>',
  '["Linux", "Docker", "GitHub Actions", "AWS", "Tailscale"]',
  0
);

-- Education
INSERT INTO Education (Degree, Institution, Start_Year, End_Year, CGPA, Description, Sort_Order) VALUES
('Degree', 'Institution', 2023, 2027, 3.60, 'Core focus on distributed systems, data structures, network administration, database theory, and operating system principles.', 0);

-- Certifications
INSERT INTO Certifications (Name, Issuer, Date_Issued, Credential_URL, Sort_Order) VALUES
('AWS Certified Cloud Practitioner', 'Amazon Web Services', '2024-06-01', 'https://aws.amazon.com', 0);

-- Skills
INSERT INTO Skills (Name, Category, Proficiency_Level, Sort_Order) VALUES
('Flutter', 'Development', 'expert', 0),
('Dart', 'Development', 'expert', 1),
('PHP', 'Development', 'intermediate', 2),
('JavaScript', 'Development', 'advanced', 3),
('HTML', 'Development', 'expert', 4),
('CSS', 'Development', 'expert', 5),
('Node.js', 'Backend & Database', 'advanced', 0),
('Express.js', 'Backend & Database', 'advanced', 1),
('REST APIs', 'Backend & Database', 'advanced', 2),
('MySQL', 'Backend & Database', 'advanced', 3),
('PostgreSQL', 'Backend & Database', 'intermediate', 4),
('MongoDB', 'Backend & Database', 'intermediate', 5),
('Linux', 'Cloud & DevOps', 'advanced', 0),
('Docker', 'Cloud & DevOps', 'advanced', 1),
('GitHub Actions', 'Cloud & DevOps', 'intermediate', 2),
('AWS', 'Cloud & DevOps', 'intermediate', 3),
('Azure', 'Cloud & DevOps', 'beginner', 4),
('Oracle Cloud', 'Cloud & DevOps', 'beginner', 5),
('Kubernetes', 'Cloud & DevOps', 'beginner', 6),
('Git', 'Networking & Tools', 'expert', 0),
('Tailscale', 'Networking & Tools', 'intermediate', 1),
('Cloudflare Tunnel', 'Networking & Tools', 'intermediate', 2),
('Postman', 'Networking & Tools', 'advanced', 3),
('Nginx', 'Networking & Tools', 'intermediate', 4);

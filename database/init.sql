/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.4.12-MariaDB, for Linux (x86_64)
--
-- Host: database    Database: portfolio_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `Admin_Users`
--

DROP TABLE IF EXISTS `Admin_Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Admin_Users` (
  `Admin_ID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) NOT NULL,
  `Password_Hash` varchar(255) NOT NULL,
  PRIMARY KEY (`Admin_ID`),
  UNIQUE KEY `Username` (`Username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admin_Users`
--

LOCK TABLES `Admin_Users` WRITE;
/*!40000 ALTER TABLE `Admin_Users` DISABLE KEYS */;
INSERT INTO `Admin_Users` VALUES
(1,'admin','$2b$12$aIptuQctj/efbDOma0oTMOnBvdLVUxDcqBfXUrdF0yGNUn9F/m7lS');
/*!40000 ALTER TABLE `Admin_Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Certifications`
--

DROP TABLE IF EXISTS `Certifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Certifications` (
  `Cert_ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(150) NOT NULL,
  `Issuer` varchar(150) NOT NULL,
  `Date_Issued` date DEFAULT NULL,
  `Credential_URL` varchar(255) DEFAULT NULL,
  `Attachment_Path` varchar(255) DEFAULT NULL,
  `Sort_Order` int DEFAULT '0',
  `Description_HTML` text,
  `Competency_Tags` json DEFAULT NULL,
  PRIMARY KEY (`Cert_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Certifications`
--

LOCK TABLES `Certifications` WRITE;
/*!40000 ALTER TABLE `Certifications` DISABLE KEYS */;
INSERT INTO `Certifications` VALUES
(1,'AWS Certified Cloud Practitioner','Amazon Web Services','2024-06-01','https://aws.amazon.com','1791393113933-18457354.jpeg',0,'<p>Normal paragraph</p>\n\n<strong>Important / bold text</strong>\n\n<b>Bold text</b>\n\n<em>Emphasized / italic text</em>\n\n<i>Italic text</i>\n\n<u>Underlined text</u>\n\n<mark>Highlighted text</mark>\n\n<small>Smaller text</small>\n\n<del>Deleted text</del>\n\n<ins>Inserted text</ins>\n\n<sup>Superscript</sup>\n\n<sub>Subscript</sub>\n\n<br> <!-- Line break -->\n\n<ul>\n    <li>Bullet point</li>\n    <li>Bullet point</li>\n</ul>\n\n<ol>\n    <li>Numbered item</li>\n    <li>Numbered item</li>\n</ol>\n\n<a href=\"#\">Link</a>\n\n<span>Inline text</span>','[\"abc\", \"def\", \"ghi\"]');
/*!40000 ALTER TABLE `Certifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Education`
--

DROP TABLE IF EXISTS `Education`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Education` (
  `Edu_ID` int NOT NULL AUTO_INCREMENT,
  `Degree` varchar(150) NOT NULL,
  `Institution` varchar(150) NOT NULL,
  `Start_Year` year DEFAULT NULL,
  `End_Year` year DEFAULT NULL,
  `CGPA` decimal(3,2) DEFAULT NULL,
  `Description` text,
  `Sort_Order` int DEFAULT '0',
  PRIMARY KEY (`Edu_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Education`
--

LOCK TABLES `Education` WRITE;
/*!40000 ALTER TABLE `Education` DISABLE KEYS */;
INSERT INTO `Education` VALUES
(1,'Degree','Institution',2023,2027,3.60,'Core focus on distributed systems, data structures, network administration, database theory, and operating system principles.',0);
/*!40000 ALTER TABLE `Education` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Experience`
--

DROP TABLE IF EXISTS `Experience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Experience` (
  `Exp_ID` int NOT NULL AUTO_INCREMENT,
  `Job_Title` varchar(100) NOT NULL,
  `Company` varchar(100) NOT NULL,
  `Start_Date` date NOT NULL,
  `End_Date` date DEFAULT NULL,
  `Is_Current` tinyint(1) DEFAULT '0',
  `Achievements_HTML` text,
  `Tech_Tags` json DEFAULT NULL,
  `Attachment_Path` varchar(255) DEFAULT NULL,
  `Sort_Order` int DEFAULT '0',
  `Overview_HTML` text,
  `Location` varchar(150) DEFAULT NULL,
  `Employment_Type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Exp_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Experience`
--

LOCK TABLES `Experience` WRITE;
/*!40000 ALTER TABLE `Experience` DISABLE KEYS */;
INSERT INTO `Experience` VALUES
(1,'DevOps & Cloud Intern','TechNova Solutions','2026-01-01','2026-02-01',0,'<p>Normal paragraph</p>\n\n<strong>Important / bold text</strong>\n\n<b>Bold text</b>\n\n<em>Emphasized / italic text</em>\n\n<i>Italic text</i>\n\n<u>Underlined text</u>\n\n<mark>Highlighted text</mark>\n\n<small>Smaller text</small>\n\n<del>Deleted text</del>\n\n<ins>Inserted text</ins>\n\n<sup>Superscript</sup>\n\n<sub>Subscript</sub>\n\n<br> <!-- Line break -->\n\n<ul>\n    <li>Bullet point</li>\n    <li>Bullet point</li>\n</ul>\n\n<ol>\n    <li>Numbered item</li>\n    <li>Numbered item</li>\n</ol>\n\n<a href=\"#\">Link</a>\n\n<span>Inline text</span>','[\"Linux\", \"Docker\", \"GitHub Actions\", \"AWS\", \"Tailscale\"]','1791392695950-1691128.jpeg',0,'<p>Normal paragraph</p>\n\n<strong>Important / bold text</strong>\n\n<b>Bold text</b>\n\n<em>Emphasized / italic text</em>\n\n<i>Italic text</i>\n\n<u>Underlined text</u>\n\n<mark>Highlighted text</mark>\n\n<small>Smaller text</small>\n\n<del>Deleted text</del>\n\n<ins>Inserted text</ins>\n\n<sup>Superscript</sup>\n\n<sub>Subscript</sub>\n\n<br> <!-- Line break -->\n\n<ul>\n    <li>Bullet point</li>\n    <li>Bullet point</li>\n</ul>\n\n<ol>\n    <li>Numbered item</li>\n    <li>Numbered item</li>\n</ol>\n\n<a href=\"#\">Link</a>\n\n<span>Inline text</span>','Rawalpindi','Part-time');
/*!40000 ALTER TABLE `Experience` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Inquiries`
--

DROP TABLE IF EXISTS `Inquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Inquiries` (
  `Message_ID` int NOT NULL AUTO_INCREMENT,
  `Sender_Name` varchar(100) NOT NULL,
  `Sender_Email` varchar(150) NOT NULL,
  `Subject` varchar(200) DEFAULT NULL,
  `Message_Body` text NOT NULL,
  `Is_Read` tinyint(1) DEFAULT '0',
  `Created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Message_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Inquiries`
--

LOCK TABLES `Inquiries` WRITE;
/*!40000 ALTER TABLE `Inquiries` DISABLE KEYS */;
/*!40000 ALTER TABLE `Inquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Profile`
--

DROP TABLE IF EXISTS `Profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Profile` (
  `Profile_ID` int NOT NULL AUTO_INCREMENT,
  `Full_Name` varchar(100) NOT NULL,
  `Tagline` varchar(255) DEFAULT NULL,
  `Bio_HTML` text,
  `GitHub_URL` varchar(255) DEFAULT NULL,
  `LinkedIn_URL` varchar(255) DEFAULT NULL,
  `Email` varchar(150) DEFAULT NULL,
  `Avatar_Path` varchar(255) DEFAULT NULL,
  `Resume_Path` varchar(255) DEFAULT NULL,
  `Headline` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Profile_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Profile`
--

LOCK TABLES `Profile` WRITE;
/*!40000 ALTER TABLE `Profile` DISABLE KEYS */;
INSERT INTO `Profile` VALUES
(1,'Khizar Nadeem','Full-Stack Developer | Aspiring DevOps & Cloud Engineer','<p>Normal paragraph</p>\r\n\r\n<strong>Important / bold text</strong>\r\n\r\n<b>Bold text</b>\r\n\r\n<em>Emphasized / italic text</em>\r\n\r\n<i>Italic text</i>\r\n\r\n<u>Underlined text</u>\r\n\r\n<mark>Highlighted text</mark>\r\n\r\n<small>Smaller text</small>\r\n\r\n<del>Deleted text</del>\r\n\r\n<ins>Inserted text</ins>\r\n\r\n<sup>Superscript</sup>\r\n\r\n<sub>Subscript</sub>\r\n\r\n<br> <!-- Line break -->\r\n\r\n<ul>\r\n    <li>Bullet point</li>\r\n    <li>Bullet point</li>\r\n</ul>\r\n\r\n<ol>\r\n    <li>Numbered item</li>\r\n    <li>Numbered item</li>\r\n</ol>\r\n\r\n<a href=\"#\">Link</a>\r\n\r\n<span>Inline text</span>','https://github.com/yourname','https://linkedin.com/in/yourname','email@example.com','1791392570276-393634480.jpeg','1791392570276-319880344.pdf','Aspiring DevOps');
/*!40000 ALTER TABLE `Profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Project_Gallery`
--

DROP TABLE IF EXISTS `Project_Gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Project_Gallery` (
  `Gallery_ID` int NOT NULL AUTO_INCREMENT,
  `Project_ID` int NOT NULL,
  `Image_Path` varchar(255) NOT NULL,
  `Caption` varchar(255) DEFAULT NULL,
  `Sort_Order` int DEFAULT '0',
  PRIMARY KEY (`Gallery_ID`),
  KEY `Project_ID` (`Project_ID`),
  CONSTRAINT `Project_Gallery_ibfk_1` FOREIGN KEY (`Project_ID`) REFERENCES `Projects` (`Project_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Project_Gallery`
--

LOCK TABLES `Project_Gallery` WRITE;
/*!40000 ALTER TABLE `Project_Gallery` DISABLE KEYS */;
INSERT INTO `Project_Gallery` VALUES
(1,1,'1791392819979-512807293.png',NULL,0),
(2,1,'1791392830601-592047428.jpeg',NULL,1),
(3,1,'1791392836600-74113610.jpg',NULL,2);
/*!40000 ALTER TABLE `Project_Gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Projects`
--

DROP TABLE IF EXISTS `Projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Projects` (
  `Project_ID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(150) NOT NULL,
  `Slug` varchar(160) NOT NULL,
  `Summary` varchar(255) NOT NULL,
  `Description_HTML` text,
  `Repo_URL` varchar(255) DEFAULT NULL,
  `Live_URL` varchar(255) DEFAULT NULL,
  `Image_Path` varchar(255) DEFAULT NULL,
  `Tech_Tags` json DEFAULT NULL,
  `Is_Featured` tinyint(1) DEFAULT '0',
  `Status` enum('published','draft') DEFAULT 'published',
  `Created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Video_URL` varchar(255) DEFAULT NULL,
  `Role` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Project_ID`),
  UNIQUE KEY `Slug` (`Slug`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Projects`
--

LOCK TABLES `Projects` WRITE;
/*!40000 ALTER TABLE `Projects` DISABLE KEYS */;
INSERT INTO `Projects` VALUES
(1,'CloudDeploy Automator','clouddeploy-automator','Automated CI/CD and multi-service deployment manager with Docker, GitHub Actions, and AWS EC2 for zero-downtime rolling releases.','<p>Normal paragraph</p>\n\n<strong>Important / bold text</strong>\n\n<b>Bold text</b>\n\n<em>Emphasized / italic text</em>\n\n<i>Italic text</i>\n\n<u>Underlined text</u>\n\n<mark>Highlighted text</mark>\n\n<small>Smaller text</small>\n\n<del>Deleted text</del>\n\n<ins>Inserted text</ins>\n\n<sup>Superscript</sup>\n\n<sub>Subscript</sub>\n\n<br> <!-- Line break -->\n\n<ul>\n    <li>Bullet point</li>\n    <li>Bullet point</li>\n</ul>\n\n<ol>\n    <li>Numbered item</li>\n    <li>Numbered item</li>\n</ol>\n\n<a href=\"#\">Link</a>\n\n<span>Inline text</span>','https://github.com/khizarnadeem','geargo.ksdev.me','1791392778061-873908705.png','[\"Docker\", \"AWS EC2\", \"GitHub Actions\", \"Linux\", \"Bash\"]',1,'published','2026-10-07 16:50:18','2026-10-07 17:19:48','1791393583303-619328598.webm','Lead Project manager');
/*!40000 ALTER TABLE `Projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Skills`
--

DROP TABLE IF EXISTS `Skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Skills` (
  `Skill_ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Category` varchar(100) NOT NULL,
  `Proficiency_Level` enum('beginner','intermediate','advanced','expert') DEFAULT 'intermediate',
  `Sort_Order` int DEFAULT '0',
  PRIMARY KEY (`Skill_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Skills`
--

LOCK TABLES `Skills` WRITE;
/*!40000 ALTER TABLE `Skills` DISABLE KEYS */;
INSERT INTO `Skills` VALUES
(1,'Flutter','Development','expert',0),
(2,'Dart','Development','expert',1),
(3,'PHP','Development','intermediate',2),
(4,'JavaScript','Development','advanced',3),
(5,'HTML','Development','expert',4),
(6,'CSS','Development','expert',5),
(7,'Node.js','Backend & Database','advanced',0),
(8,'Express.js','Backend & Database','advanced',1),
(9,'REST APIs','Backend & Database','advanced',2),
(10,'MySQL','Backend & Database','advanced',3),
(11,'PostgreSQL','Backend & Database','intermediate',4),
(12,'MongoDB','Backend & Database','intermediate',5),
(13,'Linux','Cloud & DevOps','advanced',0),
(14,'Docker','Cloud & DevOps','advanced',1),
(15,'GitHub Actions','Cloud & DevOps','intermediate',2),
(16,'AWS','Cloud & DevOps','intermediate',3),
(17,'Azure','Cloud & DevOps','beginner',4),
(18,'Oracle Cloud','Cloud & DevOps','beginner',5),
(19,'Kubernetes','Cloud & DevOps','beginner',6),
(20,'Git','Networking & Tools','expert',0),
(21,'Tailscale','Networking & Tools','intermediate',1),
(22,'Cloudflare Tunnel','Networking & Tools','intermediate',2),
(23,'Postman','Networking & Tools','advanced',3),
(24,'Nginx','Networking & Tools','intermediate',4);
/*!40000 ALTER TABLE `Skills` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-10-07 18:36:36

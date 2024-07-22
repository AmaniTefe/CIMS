-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: court
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `court`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `court` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `court`;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'admin',
  `status` varchar(50) DEFAULT 'active',
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (28,'Sisay','Lema','henokbasa122221@gmail.com','0947756304','wolkite university','Admin','Activated',NULL);
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `advocators`
--

DROP TABLE IF EXISTS `advocators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `advocators` (
  `advocator_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(50) NOT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `email` varchar(100) NOT NULL,
  `mobile_number` varchar(20) NOT NULL,
  `alternate_number` varchar(20) DEFAULT NULL,
  `address` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`advocator_id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `advocators`
--

LOCK TABLES `advocators` WRITE;
/*!40000 ALTER TABLE `advocators` DISABLE KEYS */;
INSERT INTO `advocators` VALUES (12,'Saron','Ayenew','MAmo','female','saron@gmail.com','+251945546373','','wolkite university','2024-05-11 21:11:55'),(8,'Elias','Mereke','Meles','male','elias@gmail.com','+2510945546373','','wolkite university','2024-05-11 07:59:57'),(9,'Tsemru','Fkremariam','Shumet','male','tsemru@gmail.com','+251945546373','','wolkite university','2024-05-11 08:00:28'),(13,'Amanuel','Tefera','Seifu','male','amanuel123@gmail.com','+251947756304','','wolkite university','2024-05-13 14:06:31'),(14,'Elias','Mereke','Balcha','male','elias1234@gmail.com','+251940057552','','wolkite university','2024-05-13 14:10:12');
/*!40000 ALTER TABLE `advocators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment` (
  `appointment_id` int NOT NULL AUTO_INCREMENT,
  `case_id` int NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `note` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `judge_id` int DEFAULT NULL,
  PRIMARY KEY (`appointment_id`),
  KEY `case_id` (`case_id`)
) ENGINE=MyISAM AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES (6,1,'2024-04-24','02:58:00','hello ','2024-04-03 04:58:46','2024-04-03 04:58:46',NULL),(7,26,'2024-04-10','20:53:00','DJbzvbkjz','2024-04-20 17:50:49','2024-04-20 17:50:49',NULL),(8,34,'2024-04-23','03:07:00','be there','2024-04-20 18:01:37','2024-04-20 18:01:37',NULL),(9,35,'2024-04-22','09:08:00','skjbfskjdf','2024-04-20 18:08:06','2024-04-20 18:08:06',NULL),(10,36,'2024-04-26','12:13:00','fsjdamdsfakhdf','2024-04-20 18:11:13','2024-04-20 18:11:13',NULL),(11,36,'2024-04-26','12:13:00','fsjdamdsfakhdf','2024-04-20 18:13:32','2024-04-20 18:13:32',NULL),(12,36,'2024-04-26','12:13:00','fsjdamdsfakhdf','2024-04-20 18:28:48','2024-04-20 18:28:48',NULL),(13,36,'2024-04-26','12:13:00','fsjdamdsfakhdf','2024-04-20 18:29:45','2024-04-20 18:29:45',NULL),(14,36,'2024-04-26','12:13:00','fsjdamdsfakhdf','2024-04-20 18:36:11','2024-04-20 18:36:11',NULL),(15,36,'2024-04-26','12:13:00','fsjdamdsfakhdf','2024-04-20 18:37:23','2024-04-20 18:37:23',NULL),(16,36,'2024-04-26','12:13:00','fsjdamdsfakhdf','2024-04-20 18:41:52','2024-04-20 18:41:52',NULL),(17,36,'2024-04-26','12:13:00','fsjdamdsfakhdf','2024-04-20 18:42:19','2024-04-20 18:42:19',NULL),(18,36,'2024-04-26','12:13:00','fsjdamdsfakhdf','2024-04-20 18:43:10','2024-04-20 18:43:10',NULL),(19,36,'2024-04-26','12:13:00','fsjdamdsfakhdf','2024-04-20 18:43:42','2024-04-20 18:43:42',NULL),(20,36,'2024-04-26','12:13:00','fsjdamdsfakhdf','2024-04-20 18:44:10','2024-04-20 18:44:10',NULL),(21,36,'2024-04-26','12:13:00','fsjdamdsfakhdf','2024-04-20 18:45:05','2024-04-20 18:45:05',NULL),(22,36,'2024-04-21','10:16:00','don\'t be late','2024-04-21 07:12:53','2024-04-21 07:12:53',NULL),(23,36,'2024-04-21','10:16:00','don\'t be late','2024-04-21 07:14:42','2024-04-21 07:14:42',NULL),(24,36,'2024-04-21','10:24:00','don\'t be late','2024-04-21 07:15:08','2024-04-21 07:15:08',NULL),(25,36,'2024-04-21','10:24:00','hello sir','2024-04-21 07:20:50','2024-04-21 07:20:50',NULL),(26,36,'2024-04-21','10:24:00','hello sirrrrrrrrrrrrrrrrrrr','2024-04-21 07:34:08','2024-04-21 07:34:08',NULL),(27,36,'2024-04-21','10:42:00','hello sirrrrrrrrrrrrrrrrrrrkhabfksyudjbhakjds','2024-04-21 07:34:37','2024-04-21 07:34:37',NULL),(28,36,'2024-04-21','10:42:00','hello sirrrrrrrrrrrrrrrrrrrkhabfksyudjbhakjds','2024-04-21 07:41:50','2024-04-21 07:41:50',NULL),(29,28,'2024-04-21','10:42:00','hello sirrrrrrrrrrrrrrrrrrrkhabfksyudjbhakjds','2024-04-21 07:42:19','2024-04-21 07:42:19',NULL),(30,28,'2024-04-21','01:37:00','hello sirrrrrrrrrrrrrrrrrrrkhabfksyudjbhakjdssdkjfvhsjad','2024-04-21 08:03:22','2024-04-21 08:03:22',NULL),(31,36,'2024-05-02','00:46:00','khdfskjsbdhfja','2024-04-30 07:43:54','2024-04-30 07:43:54',NULL),(39,108,'2024-05-14','14:00:00','okay','2024-05-12 13:26:04','2024-05-12 16:55:51',24),(40,108,'2024-05-14','17:26:00','heyyyyyy','2024-05-12 13:31:53','2024-05-12 14:23:44',24),(41,108,'2024-05-20','14:00:00','appointment changed','2024-05-12 14:12:13','2024-05-12 14:12:46',24),(42,40,'2024-05-24','21:47:00','yfltky;tl','2024-05-12 18:45:12','2024-05-12 18:45:12',24),(43,109,'2024-05-15','15:00:00','don\'t be late','2024-05-13 13:35:36','2024-05-13 13:35:36',25),(44,43,'2024-05-15','16:00:00','dons\'t be late','2024-05-13 13:37:27','2024-05-13 13:37:27',25),(45,109,'2024-05-15','16:44:00','Don\'t be late','2024-05-13 13:44:01','2024-05-13 13:44:01',25),(46,109,'2024-05-14','16:49:00','Don\'t be late','2024-05-13 13:49:41','2024-05-13 13:49:41',25),(47,43,'2024-05-17','19:56:00','don\'t be late','2024-05-13 13:56:27','2024-05-13 13:56:27',25),(48,109,'2024-05-15','17:04:00','Don\'t be Late','2024-05-13 14:03:31','2024-05-13 14:03:31',25),(49,110,'2024-05-16','17:16:00','Don\'t Be Late!!!','2024-05-13 14:14:43','2024-05-13 14:14:43',24),(50,110,'2024-05-16','17:19:00','Hello','2024-05-13 14:18:17','2024-05-13 14:18:17',24);
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointment_phonenumber_map`
--

DROP TABLE IF EXISTS `appointment_phonenumber_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment_phonenumber_map` (
  `id` int NOT NULL AUTO_INCREMENT,
  `appointment_id` int DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `appointment_id` (`appointment_id`)
) ENGINE=MyISAM AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment_phonenumber_map`
--

LOCK TABLES `appointment_phonenumber_map` WRITE;
/*!40000 ALTER TABLE `appointment_phonenumber_map` DISABLE KEYS */;
INSERT INTO `appointment_phonenumber_map` VALUES (8,6,'0940057552'),(9,6,'0940057552'),(10,6,'0940057552'),(11,7,'0940057552'),(12,7,'0940057552'),(13,7,'094005799'),(14,7,'0940057552'),(15,8,'0945546373'),(16,8,'0940057552'),(17,9,'+251945546373'),(18,9,'+2517075996'),(19,10,'+251972838837'),(20,10,'+251945546373'),(21,11,'+251972838837'),(22,11,'+251945546373'),(23,12,'+251972838837'),(24,12,'+251945546373'),(25,13,'+251972838837'),(26,13,'+251945546373'),(27,14,'+251972838837'),(28,14,'+251945546373'),(29,15,'+251972838837'),(30,15,'+251945546373'),(31,16,'+251972838837'),(32,16,'+251945546373'),(33,17,'+251972838837'),(34,17,'+251945546373'),(35,18,'+251972838837'),(36,18,'+251945546373'),(37,19,'+251972838837'),(38,19,'+251945546373'),(39,20,'+251972838837'),(40,20,'+251945546373'),(41,21,'+251972838837'),(42,21,'+251945546373'),(43,22,'+251972838837'),(44,22,'+251945546373'),(45,23,'+251972838837'),(46,23,'+251945546373'),(47,24,'+251972838837'),(48,24,'+251945546373'),(49,25,'+251972838837'),(50,25,'+251945546373'),(51,28,'+251972838837'),(52,28,'+251945546373'),(53,29,'0940057552'),(54,29,'094005799'),(55,29,'0940057552'),(56,29,'0940057552'),(57,31,'+251972838837'),(58,31,'+251945546373'),(59,32,'0940057552'),(60,32,'0945546373'),(61,33,'094005799'),(62,33,'+2517075996'),(63,34,'+251707015996'),(64,34,'+251945546373'),(65,35,'+251945546373'),(66,35,'+251945546373'),(67,36,'+251945546373'),(68,36,'+251945546373'),(69,37,'+251945546373'),(70,37,'+251945546373'),(71,38,'+251945546373'),(72,38,'+251945546373'),(73,39,'+251945546373'),(74,39,'+251945546373'),(75,40,'+251945546373'),(76,40,'+251945546373'),(77,41,'+251945546373'),(78,41,'+251945546373'),(79,42,'+251945546373'),(80,42,'+251945546373'),(81,43,'0947756304'),(82,43,'+251945546373'),(83,43,'+251945546373'),(84,44,'+251945546373'),(85,44,'+251945546373'),(86,45,'0947756304'),(87,45,'+251945546373'),(88,45,'+251945546373'),(89,46,'0947756304'),(90,46,'+251945546373'),(91,46,'+251945546373'),(92,47,'+251945546373'),(93,47,'+251945546373'),(94,48,'0947756304'),(95,48,'+251945546373'),(96,48,'+251945546373'),(97,49,'+251947756304'),(98,49,'+251940057552'),(99,50,'+251947756304'),(100,50,'+251940057552');
/*!40000 ALTER TABLE `appointment_phonenumber_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backups`
--

DROP TABLE IF EXISTS `backups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backups` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `backup_data` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backups`
--

LOCK TABLES `backups` WRITE;
/*!40000 ALTER TABLE `backups` DISABLE KEYS */;
/*!40000 ALTER TABLE `backups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `case_sub_type`
--

DROP TABLE IF EXISTS `case_sub_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `case_sub_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sub_type_name` varchar(255) NOT NULL,
  `case_type` varchar(255) DEFAULT NULL,
  `case_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_case_type` (`case_type`(250)),
  KEY `case_id` (`case_id`)
) ENGINE=MyISAM AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `case_sub_type`
--

LOCK TABLES `case_sub_type` WRITE;
/*!40000 ALTER TABLE `case_sub_type` DISABLE KEYS */;
INSERT INTO `case_sub_type` VALUES (109,'Murder','criminal',NULL),(110,'Assault','criminal',NULL),(111,'Robbery','criminal',NULL),(112,'Theft','criminal',NULL),(113,'Burglary','criminal',NULL),(114,'Arson','criminal',NULL),(115,'Breach of Contract','civil',NULL),(116,'Landlord-Tenant Disputes','civil',NULL),(117,'Boundary Disputes','civil',NULL),(118,'Harassment','civil',NULL),(119,'Police Brutality','civil',NULL),(120,'Discrimination','civil',NULL),(101,'thief ','civil',108),(102,'merderer','criminal',109),(103,'thief ','civil',110),(108,'kill','civil',111);
/*!40000 ALTER TABLE `case_sub_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `case_type`
--

DROP TABLE IF EXISTS `case_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `case_type` (
  `id` int DEFAULT NULL,
  `case_type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `case_type`
--

LOCK TABLES `case_type` WRITE;
/*!40000 ALTER TABLE `case_type` DISABLE KEYS */;
INSERT INTO `case_type` VALUES (1,'civil'),(2,'criminal');
/*!40000 ALTER TABLE `case_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cases`
--

DROP TABLE IF EXISTS `cases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cases` (
  `case_id` int NOT NULL AUTO_INCREMENT,
  `case_type` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `description` varchar(10000) DEFAULT NULL,
  `policeStation` varchar(255) DEFAULT NULL,
  `FIRNumber` varchar(255) DEFAULT NULL,
  `FIRDate` date DEFAULT NULL,
  `registrationDate` date DEFAULT NULL,
  `assigned_judge` varchar(255) DEFAULT NULL,
  `case_status` enum('running','closed') DEFAULT 'running',
  `judge_decision` mediumtext,
  `is_paid` varchar(255) DEFAULT 'unpaid',
  PRIMARY KEY (`case_id`)
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cases`
--

LOCK TABLES `cases` WRITE;
/*!40000 ALTER TABLE `cases` DISABLE KEYS */;
INSERT INTO `cases` VALUES (40,'civil','','hello','wolkite city','02','2024-05-13','2024-05-12','22','closed','<h2>Decision:</h2><p>Death Penalty!!</p>','Paid'),(43,'criminal','1.2 ES Basics.pdf','hiiiiiii','wolkite city','08','2024-05-09','2024-05-12','25','running',NULL,'Paid'),(108,'civil','Blog calling final.docx','helloooo','wolkite city','09','2024-05-06','2024-05-12','24','closed','<h2>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<i><strong> &nbsp; &nbsp; &nbsp; Decision</strong></i></h2><p>death penalty</p>','Paid'),(109,'criminal','','hellllll','wolkite city','865412','2024-05-12','2024-05-12','25','running',NULL,'Paid'),(110,'civil','','dhfbkshdbfj','wolkite city','865412','2024-05-15','2024-05-13','24','running',NULL,'Paid'),(111,'civil','','hello','wolkite city','09','2024-05-08','2024-05-15',NULL,'running',NULL,'unpaid');
/*!40000 ALTER TABLE `cases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientreferences`
--

DROP TABLE IF EXISTS `clientreferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientreferences` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_id` int DEFAULT NULL,
  `reference_name` varchar(255) DEFAULT NULL,
  `reference_mobile` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`)
) ENGINE=MyISAM AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientreferences`
--

LOCK TABLES `clientreferences` WRITE;
/*!40000 ALTER TABLE `clientreferences` DISABLE KEYS */;
INSERT INTO `clientreferences` VALUES (53,44,'',''),(55,46,'Tefera','09000000'),(51,42,'Tefera','0947756304');
/*!40000 ALTER TABLE `clientreferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) DEFAULT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `gender` enum('male','female') DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mobile_number` varchar(20) DEFAULT NULL,
  `alternate_number` varchar(20) DEFAULT NULL,
  `address` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (50,'Henok ','Basazn','Arega','male','henok1234@gmail.com','+251940057552','','wolkite university'),(46,'Amanuel','Tefera','Seifu','male','seifu@gmail.com','+251945546373','','wolkite'),(49,'Sissay ','Teshome','Lema','male','sisay123@gmail.com','+251947756304','','wolkite university'),(44,'Nuaz','Nezif','Musher','male','Nuaz@gmail.com','+251945546373','','wolkite university'),(48,'Kfle','Asres','Meshesha','male','kfle@gmail.com','0947756304','','wolkite university'),(42,'Henok ','Basazn','Muche','male','henokbasazn@gmail.com','+251945546373','','wolkite university');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `court_manager`
--

DROP TABLE IF EXISTS `court_manager`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `court_manager` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'court_manager',
  `status` varchar(50) DEFAULT 'active',
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `court_manager`
--

LOCK TABLES `court_manager` WRITE;
/*!40000 ALTER TABLE `court_manager` DISABLE KEYS */;
INSERT INTO `court_manager` VALUES (27,'Amanuel','Tefera','amani123tefe@gmail.com','+251947756304','wolkite university','Court_Manager','Activated',NULL);
/*!40000 ALTER TABLE `court_manager` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice_clerk`
--

DROP TABLE IF EXISTS `invoice_clerk`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice_clerk` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'invoice_clerk',
  `status` varchar(50) DEFAULT 'active',
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice_clerk`
--

LOCK TABLES `invoice_clerk` WRITE;
/*!40000 ALTER TABLE `invoice_clerk` DISABLE KEYS */;
INSERT INTO `invoice_clerk` VALUES (29,'Amanuel','Tefera','amanuel@gmail.com','0945546373','wolkite university','Invoice_Clerk','Activated',NULL);
/*!40000 ALTER TABLE `invoice_clerk` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice_items`
--

DROP TABLE IF EXISTS `invoice_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice_items` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `invoice_id` int DEFAULT NULL,
  `service` varchar(255) DEFAULT NULL,
  `description` text,
  `amount` decimal(10,2) DEFAULT NULL,
  `paid_status` varchar(255) DEFAULT 'unpaid',
  PRIMARY KEY (`item_id`),
  KEY `fk_invoice_items_invoices` (`invoice_id`),
  CONSTRAINT `fk_invoice_items_invoices` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`invoice_id`) ON DELETE CASCADE,
  CONSTRAINT `invoice_items_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`invoice_id`)
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice_items`
--

LOCK TABLES `invoice_items` WRITE;
/*!40000 ALTER TABLE `invoice_items` DISABLE KEYS */;
INSERT INTO `invoice_items` VALUES (20,NULL,'Service Name','Description of the service',100.00,'Unpaid'),(112,95,'case starter',NULL,1500.00,'Paid'),(113,96,'Case Starter',NULL,25.00,'Paid'),(123,98,'Case Starter','hahaha',25.00,'Unpaid'),(135,98,'Judge Payement','bahaha',300.00,'Unpaid'),(136,99,'Case Starter',NULL,25.00,'Paid'),(137,99,'Judge Payement',NULL,300.00,'Paid'),(138,100,'Case Starter',NULL,25.00,'Paid');
/*!40000 ALTER TABLE `invoice_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `invoice_id` int NOT NULL AUTO_INCREMENT,
  `case_id` int DEFAULT NULL,
  `invoice_number` varchar(255) DEFAULT NULL,
  `invoice_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `note` text,
  `total_amount` int DEFAULT NULL,
  `paid_status` enum('Paid','Unpaid','Partially Paid') DEFAULT NULL,
  PRIMARY KEY (`invoice_id`),
  KEY `case_id` (`case_id`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`case_id`) REFERENCES `cases` (`case_id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT INTO `invoices` VALUES (95,108,'INV-15','2024-05-12','2024-05-12','',1725,'Paid'),(96,109,'INV-16','2024-05-12','2024-05-12','',29,'Paid'),(98,43,'INV-17','2024-05-12','2024-05-12','',374,'Unpaid'),(99,108,'INV-18','2024-05-12','2024-05-14','',374,'Paid'),(100,110,'INV-19','2024-05-13','2024-05-14','paid fully',29,'Paid');
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `judge`
--

DROP TABLE IF EXISTS `judge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `judge` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'judge',
  `status` varchar(50) DEFAULT 'active',
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `judge`
--

LOCK TABLES `judge` WRITE;
/*!40000 ALTER TABLE `judge` DISABLE KEYS */;
INSERT INTO `judge` VALUES (20,'H','B66','hesa1dasd2fd21@gmail.com','0940057552','Debirebirhan','Judge','Activated',NULL),(22,'u','m','ewefswu@gmail.com','0940057552','Debirebirhan','Judge','Activated',NULL),(24,'Henok','Basazn','henok@gmail.com','0940057552','Debirebirhan','Judge','Activated',NULL),(25,'Henok','Basazn','henokboioi1221@gmail.com','0940057552','Debirebirhan','Judge','Activated',NULL),(26,'Henok','Basazn','hen@gmail.com','0940057552','Debirebirhan','Judge','Activated',NULL);
/*!40000 ALTER TABLE `judge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_user_id` (`user_id`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=199 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,24,'You\'ve been assigned to a new case with case number 99','2024-05-10 13:20:36',0),(2,23,'You\'ve been assigned to a new case with case number 99','2024-05-10 13:24:42',1),(3,23,'You\'ve been assigned to a new case with case number 99','2024-05-10 13:42:29',1),(4,24,'You\'ve been assigned to a new case with case number 99','2024-05-10 13:42:33',0),(5,24,'You\'ve been assigned to a new case with case number 99','2024-05-10 14:15:45',0),(6,24,'You\'ve been assigned to a new case with case number 99','2024-05-10 14:29:41',0),(7,24,'You\'ve been assigned to a new case with case number 99','2024-05-10 14:32:07',0),(8,24,'You\'ve been assigned to a new case with case number 99','2024-05-10 14:35:23',0),(9,24,'You\'ve been assigned to a new case with case number 99','2024-05-10 14:35:45',0),(10,24,'You\'ve been assigned to a new case with case number 99','2024-05-10 15:02:22',0),(11,24,'You\'ve been assigned to a new case with case number 99','2024-05-10 15:02:23',0),(12,24,'You\'ve been assigned to a new case with case number 99','2024-05-10 15:02:23',0),(13,24,'You\'ve been assigned to a new case with case number 99','2024-05-10 15:06:58',0),(14,24,'You\'ve been assigned to a new case with case number 99','2024-05-10 15:07:00',0),(15,24,'You\'ve been assigned to a new case with case number 99','2024-05-10 15:07:25',0),(16,24,'You\'ve been assigned to a new case with case number 99','2024-05-10 15:07:26',0),(17,24,'You\'ve been assigned to a new case with case number 99','2024-05-10 15:07:27',0),(18,24,'You\'ve been assigned to a new case with case number 99','2024-05-10 15:07:28',0),(19,24,'You\'ve been assigned to a new case with case number 99','2024-05-10 15:07:45',0),(20,24,'You\'ve been assigned to a new case with case number 99','2024-05-10 15:07:45',0),(21,24,'You\'ve been assigned to a new case with case number 99','2024-05-10 15:07:46',0),(22,8,'A New Case Have Been Added with Case Number 100','2024-05-10 22:02:40',0),(23,8,'A New Case Have Been Added with Case Number 101','2024-05-10 22:05:35',0),(24,8,'A New Case Have Been Added with Case Number 102','2024-05-10 22:10:19',0),(26,8,'A New Case Have Been Added with Case Number 103','2024-05-10 22:13:09',0),(28,8,'A New Case Have Been Added with Case Number 104','2024-05-10 22:31:02',0),(29,27,'The paid status for case 104 has been unpdated to Paid','2024-05-10 22:38:15',0),(30,27,'The paid status for case 103 has been unpdated to Paid','2024-05-10 22:41:26',0),(31,24,'You\'ve been assigned to a new case with case number 103','2024-05-10 22:42:41',0),(32,24,'You\'ve been assigned to a new case with case number 104','2024-05-10 22:42:52',0),(33,24,'You\'ve been assigned to a new case with case number 104','2024-05-10 22:43:07',0),(34,4,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-10 23:10:08',0),(35,2,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-10 23:10:08',1),(36,15,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-10 23:10:08',0),(37,23,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-10 23:10:08',1),(38,19,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-10 23:10:08',1),(40,2,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-10 23:24:15',1),(41,15,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-10 23:24:15',0),(43,4,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-10 23:24:15',0),(44,23,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-10 23:24:15',1),(45,19,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-10 23:24:15',1),(46,14,'Your Case with Document Id 11 has been approved','2024-05-10 23:24:37',0),(47,14,'Your Case with Document Id 12 has been approved','2024-05-10 23:25:01',0),(48,14,'Your Case with Document Id 13 has been approved','2024-05-10 23:25:03',0),(49,14,'Your Case with Document Id 14 has been approved','2024-05-10 23:25:05',0),(51,8,'A New Case Have Been Added with Case Number 105','2024-05-10 23:27:07',0),(52,14,'You\'ve been assigned to a new case with case number 105','2024-05-10 23:27:07',0),(53,2,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-11 00:13:19',1),(54,4,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-11 00:13:19',0),(55,15,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-11 00:13:19',0),(57,23,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-11 00:13:19',1),(58,19,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-11 00:13:19',1),(59,14,'Your Case with Document Id 15 has been approved','2024-05-11 00:13:52',0),(60,27,'The paid status for case 104 has been unpdated to Paid','2024-05-11 09:42:34',0),(61,2,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-11 10:53:53',1),(62,19,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-11 10:53:53',1),(63,4,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-11 10:53:53',0),(64,15,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-11 10:53:53',1),(65,23,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-11 10:53:53',1),(67,14,'Your Case with Document Id 16 has been approved','2024-05-11 10:54:15',0),(69,8,'A New Case Have Been Added with Case Number 106','2024-05-11 11:01:05',0),(70,NULL,'You\'ve been assigned to a new case with case number 106','2024-05-11 11:01:05',1),(71,8,'A New Case Have Been Added with Case Number 107','2024-05-11 15:53:54',0),(73,14,'You\'ve been assigned to a new case with case number 107','2024-05-11 15:53:54',0),(74,27,'The paid status for case 107 has been unpdated to Paid','2024-05-11 15:56:19',0),(75,26,'You\'ve been assigned to a new case with case number 107','2024-05-11 15:57:31',0),(76,27,'The paid status for case 106 has been unpdated to Paid','2024-05-11 15:57:50',0),(77,24,'You\'ve been assigned to a new case with case number 106','2024-05-11 16:23:41',0),(78,27,'The paid status for case 106 has been unpdated to Unpaid','2024-05-11 16:41:44',0),(79,8,'A New Case Have Been Added with Case Number 108','2024-05-12 11:15:34',0),(81,NULL,'You\'ve been assigned to a new case with case number 108','2024-05-12 11:15:34',1),(82,27,'The paid status for case 108 has been unpdated to Paid','2024-05-12 11:20:15',0),(83,24,'You\'ve been assigned to a new case with case number 108','2024-05-12 11:21:19',0),(84,4,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 11:34:24',0),(85,2,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 11:34:24',1),(87,15,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 11:34:24',1),(88,23,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 11:34:24',1),(89,19,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 11:34:24',1),(90,15,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 11:35:03',1),(91,2,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 11:35:03',1),(92,4,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 11:35:03',0),(94,19,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 11:35:03',1),(95,23,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 11:35:03',1),(96,14,'Your Case with Document Id 18 has been approved','2024-05-12 11:36:29',0),(98,14,'You\'ve been assigned to a new case with case number 109','2024-05-12 11:38:20',0),(99,8,'A New Case Have Been Added with Case Number 109','2024-05-12 11:38:20',0),(100,4,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:27:20',0),(101,2,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:27:20',1),(102,15,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:27:20',1),(104,19,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:27:20',1),(105,23,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:27:20',1),(106,14,'Your Case with Document Id 19 has been approved','2024-05-12 14:27:53',0),(107,15,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:30:40',1),(108,2,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:30:40',1),(109,4,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:30:40',0),(111,19,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:30:40',1),(112,23,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:30:40',1),(113,15,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:38:38',1),(114,2,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:38:38',1),(115,4,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:38:38',0),(117,19,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:38:38',1),(118,23,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:38:38',1),(119,4,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:45:40',0),(120,2,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:45:40',1),(121,15,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:45:40',1),(123,19,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:45:40',1),(124,23,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:45:40',1),(125,4,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:49:43',0),(126,2,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:49:43',1),(128,15,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:49:43',1),(129,19,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:49:43',1),(130,23,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 14:49:43',1),(131,27,'The paid status for case 109 has been unpdated to Paid','2024-05-12 14:51:14',0),(132,26,'You\'ve been assigned to a new case with case number 109','2024-05-12 14:57:12',0),(133,27,'The paid status for case null has been unpdated to Paid','2024-05-12 14:58:56',0),(134,27,'The paid status for case 108 has been unpdated to Paid','2024-05-12 15:01:21',0),(135,27,'The paid status for case 108 has been unpdated to Partially Paid','2024-05-12 15:01:45',0),(136,27,'The paid status for case 109 has been unpdated to Paid','2024-05-12 15:08:23',0),(137,27,'The paid status for case 109 has been unpdated to Paid','2024-05-12 15:09:53',0),(138,27,'The paid status for case 109 has been unpdated to Paid','2024-05-12 15:10:28',0),(139,27,'The paid status for case 109 has been unpdated to Paid','2024-05-12 15:13:50',0),(140,27,'The paid status for case 109 has been unpdated to Paid','2024-05-12 15:14:08',0),(141,27,'The paid status for case 109 has been unpdated to Paid','2024-05-12 15:14:59',0),(142,27,'The paid status for case 108 has been unpdated to Paid','2024-05-12 15:18:07',0),(143,27,'The paid status for case 40 has been unpdated to Paid','2024-05-12 15:18:58',0),(144,27,'The paid status for case 40 has been unpdated to Paid','2024-05-12 15:25:22',0),(145,27,'The paid status for case 40 has been unpdated to Paid','2024-05-12 15:25:40',0),(146,27,'The paid status for case 40 has been unpdated to Paid','2024-05-12 15:26:07',0),(147,27,'The paid status for case 40 has been unpdated to Paid','2024-05-12 15:26:49',0),(148,27,'The paid status for case 40 has been unpdated to Paid','2024-05-12 15:26:50',0),(149,27,'The paid status for case 40 has been unpdated to Paid','2024-05-12 15:26:56',0),(150,27,'The paid status for case 43 has been unpdated to Paid','2024-05-12 15:27:30',0),(151,27,'The paid status for case 43 has been unpdated to Unpaid','2024-05-12 15:28:12',0),(152,27,'The paid status for case 43 has been unpdated to Unpaid','2024-05-12 15:28:51',0),(153,27,'The paid status for case 43 has been unpdated to Unpaid','2024-05-12 15:29:16',0),(154,27,'The paid status for case 43 has been unpdated to Partially Paid','2024-05-12 15:36:27',0),(155,27,'The paid status for case 43 has been unpdated to Unpaid','2024-05-12 15:36:45',0),(156,27,'The paid status for case 43 has been unpdated to Unpaid','2024-05-12 15:37:01',0),(157,27,'The paid status for case 43 has been unpdated to Unpaid','2024-05-12 15:37:58',0),(158,27,'The paid status for case 43 has been unpdated to Unpaid','2024-05-12 15:38:16',0),(159,27,'The paid status for case 43 has been unpdated to Partially Paid','2024-05-12 15:38:26',0),(160,27,'The paid status for case 43 has been unpdated to Unpaid','2024-05-12 15:38:43',0),(161,27,'The paid status for case 43 has been unpdated to Unpaid','2024-05-12 15:39:03',0),(162,27,'The paid status for case 43 has been unpdated to Paid','2024-05-12 15:39:40',0),(163,27,'The paid status for case 43 has been unpdated to Paid','2024-05-12 15:39:57',0),(164,27,'The paid status for case 43 has been unpdated to Paid','2024-05-12 15:41:08',0),(165,27,'The paid status for case 43 has been unpdated to Paid','2024-05-12 15:41:11',0),(166,27,'The paid status for case 43 has been unpdated to Paid','2024-05-12 15:41:11',0),(167,27,'The paid status for case 43 has been unpdated to Paid','2024-05-12 15:41:12',0),(168,27,'The paid status for case 43 has been unpdated to Paid','2024-05-12 15:41:13',0),(169,27,'The paid status for case 43 has been unpdated to Paid','2024-05-12 15:41:22',0),(170,27,'The paid status for case 43 has been unpdated to Paid','2024-05-12 15:43:11',0),(171,27,'The paid status for case 43 has been unpdated to Paid','2024-05-12 15:43:22',0),(172,2,'A Desicion has been made for case with caseID 40','2024-05-12 20:40:35',1),(173,4,'A Desicion has been made for case with caseID 40','2024-05-12 20:40:35',0),(174,15,'A Desicion has been made for case with caseID 40','2024-05-12 20:40:35',1),(176,19,'A Desicion has been made for case with caseID 40','2024-05-12 20:40:35',1),(177,23,'A Desicion has been made for case with caseID 40','2024-05-12 20:40:35',1),(178,26,'You\'ve been assigned to a new case with case number 43','2024-05-12 21:55:51',0),(179,27,'The paid status for case 108 has been unpdated to Paid','2024-05-12 22:10:21',0),(180,2,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 22:17:03',1),(181,4,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 22:17:03',0),(182,15,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 22:17:03',1),(183,19,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 22:17:03',1),(184,23,'A new document has been uploaded by the prosecutor by The ID of 14','2024-05-12 22:17:03',1),(185,20,'You\'ve been assigned to a new case with case number 40','2024-05-13 14:38:45',1),(186,22,'You\'ve been assigned to a new case with case number 40','2024-05-13 14:39:00',1),(187,25,'You\'ve been assigned to a new case with case number 43','2024-05-13 15:00:22',0),(188,25,'You\'ve been assigned to a new case with case number 109','2024-05-13 15:08:01',0),(189,8,'A New Case Have Been Added with Case Number 110','2024-05-13 17:11:22',0),(190,NULL,'You\'ve been assigned to a new case with case number 110','2024-05-13 17:11:22',1),(191,27,'The paid status for case 110 has been unpdated to Paid','2024-05-13 17:12:45',0),(192,24,'You\'ve been assigned to a new case with case number 110','2024-05-13 17:13:26',0),(193,8,'A New Case Have Been Added with Case Number 111','2024-05-13 18:27:02',0),(194,NULL,'You\'ve been assigned to a new case with case number 111','2024-05-13 18:27:02',1),(195,24,'You\'ve been assigned to a new case with case number 110','2024-05-13 18:31:22',0),(196,20,'You\'ve been assigned to a new case with case number 110','2024-05-13 18:31:27',1),(197,24,'You\'ve been assigned to a new case with case number 110','2024-05-13 18:31:30',0),(198,24,'You\'ve been assigned to a new case with case number 110','2024-05-13 18:32:23',0);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otherdocumentcases`
--

DROP TABLE IF EXISTS `otherdocumentcases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otherdocumentcases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `case_id` int DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otherdocumentcases`
--

LOCK TABLES `otherdocumentcases` WRITE;
/*!40000 ALTER TABLE `otherdocumentcases` DISABLE KEYS */;
INSERT INTO `otherdocumentcases` VALUES (1,37,'2.1 ES Packaged Enterprise Application Software.pdf',''),(2,37,'3 Development of Enterprise Systems (2).pdf',''),(3,37,'3 Development of Enterprise Systems (2).pdf',''),(4,37,'3 Development of Enterprise Systems (2).pdf',''),(5,37,'3 Development of Enterprise Systems (2).pdf',''),(6,37,'3 Development of Enterprise Systems (2).pdf',''),(7,37,'3 Development of Enterprise Systems (2).pdf',''),(8,37,'3 Development of Enterprise Systems (2).pdf',''),(9,37,'3 Development of Enterprise Systems (2).pdf',''),(10,37,'3 Development of Enterprise Systems (2).pdf',''),(11,37,'3 Development of Enterprise Systems (2).pdf',''),(12,37,'3 Development of Enterprise Systems (2).pdf',''),(13,37,'3 Development of Enterprise Systems (2).pdf',''),(14,37,'3 Development of Enterprise Systems (2).pdf',''),(15,14,'2.2 Categories of PEAS new [Compatibility Mode].pdf',''),(16,14,'2.2 Categories of PEAS new [Compatibility Mode].pdf',''),(17,14,'2.2 Categories of PEAS new [Compatibility Mode].pdf',''),(18,14,'2.2 Categories of PEAS new [Compatibility Mode].pdf',''),(19,14,'2.2 Categories of PEAS new [Compatibility Mode].pdf',''),(20,14,'2.2 Categories of PEAS new [Compatibility Mode].pdf',''),(21,14,'2.2 Categories of PEAS new [Compatibility Mode].pdf',''),(22,80,'3 Development of Enterprise Systems (2).pdf',''),(23,80,'Blog calling final.docx','kshbafjsnd');
/*!40000 ALTER TABLE `otherdocumentcases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `petitioner_case_map`
--

DROP TABLE IF EXISTS `petitioner_case_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `petitioner_case_map` (
  `case_id` int DEFAULT NULL,
  `client_id` int DEFAULT NULL,
  `advocator_id` int DEFAULT NULL,
  `prosecutor_id` int DEFAULT NULL,
  KEY `case_id` (`case_id`),
  KEY `client_id` (`client_id`),
  KEY `advocator_id` (`advocator_id`),
  KEY `prosecutor_id` (`prosecutor_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `petitioner_case_map`
--

LOCK TABLES `petitioner_case_map` WRITE;
/*!40000 ALTER TABLE `petitioner_case_map` DISABLE KEYS */;
INSERT INTO `petitioner_case_map` VALUES (NULL,46,NULL,14),(NULL,46,14,NULL),(40,46,12,NULL),(111,50,13,NULL),(110,49,13,NULL),(NULL,46,NULL,14),(109,48,NULL,14),(108,46,12,NULL),(43,46,NULL,14);
/*!40000 ALTER TABLE `petitioner_case_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prosecutor`
--

DROP TABLE IF EXISTS `prosecutor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prosecutor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'prosecutor',
  `status` varchar(50) DEFAULT 'active',
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prosecutor`
--

LOCK TABLES `prosecutor` WRITE;
/*!40000 ALTER TABLE `prosecutor` DISABLE KEYS */;
/*!40000 ALTER TABLE `prosecutor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prosecutor_documents`
--

DROP TABLE IF EXISTS `prosecutor_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prosecutor_documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `file_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('pending','approved') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `prosecutor_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_prosecutor_id` (`prosecutor_id`)
) ENGINE=MyISAM AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prosecutor_documents`
--

LOCK TABLES `prosecutor_documents` WRITE;
/*!40000 ALTER TABLE `prosecutor_documents` DISABLE KEYS */;
INSERT INTO `prosecutor_documents` VALUES (10,'mother fucker','Individual Assignment.pdf','approved',14),(11,'hello madam','Chapter 4 ERP Implementation.pdf','approved',14),(12,'shdbjashd','1.2 ES Basics.pdf','approved',14),(13,'yes sir','4th Institutional Email.pdf','approved',14),(14,'muahahaha','Assignment.pdf','approved',14),(15,'yejfashdbfms','4th Institutional Email.pdf','approved',14),(16,'thank you','Chapter 4 ERP Implementation.pdf','approved',14),(18,'Hello','Individual Assignment.pdf','approved',14),(19,'Review this code','judge_decision.pdf','approved',14);
/*!40000 ALTER TABLE `prosecutor_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registrar`
--

DROP TABLE IF EXISTS `registrar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registrar` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `address` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `status` varchar(50) DEFAULT 'Activated',
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registrar`
--

LOCK TABLES `registrar` WRITE;
/*!40000 ALTER TABLE `registrar` DISABLE KEYS */;
INSERT INTO `registrar` VALUES (23,'Henok','Basazn','henokbasa12dad21@gmail.com','0940057552','Debirebirhan','Registrar','Activated',NULL);
/*!40000 ALTER TABLE `registrar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reset_tokens`
--

DROP TABLE IF EXISTS `reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reset_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `token` varchar(256) COLLATE utf8mb4_general_ci NOT NULL,
  `expires` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_unique` (`email`),
  KEY `user_email_idx` (`email`),
  CONSTRAINT `reset_tokens_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reset_tokens`
--

LOCK TABLES `reset_tokens` WRITE;
/*!40000 ALTER TABLE `reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `respondent_case_map`
--

DROP TABLE IF EXISTS `respondent_case_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `respondent_case_map` (
  `case_id` int DEFAULT NULL,
  `client_id` int DEFAULT NULL,
  `advocator_id` int DEFAULT NULL,
  KEY `case_id` (`case_id`),
  KEY `client_id` (`client_id`),
  KEY `advocator_id` (`advocator_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `respondent_case_map`
--

LOCK TABLES `respondent_case_map` WRITE;
/*!40000 ALTER TABLE `respondent_case_map` DISABLE KEYS */;
INSERT INTO `respondent_case_map` VALUES (108,44,8),(40,44,9),(NULL,49,13),(110,50,14),(111,44,14),(NULL,42,9),(NULL,48,9),(NULL,48,12),(109,42,12),(109,44,12),(43,44,12);
/*!40000 ALTER TABLE `respondent_case_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `amount` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (2,'Judge Payement',300,'2024-05-06 07:47:13','2024-05-12 11:08:19'),(6,'Court Filing Fees',25,'2024-05-12 11:08:33','2024-05-13 19:54:01');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `password` varchar(60) NOT NULL,
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Judge',
  `profile_picture` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'C:/Users/Henok/fullproject/frontend/src/image/profile picture.png',
  `status` enum('Activated','Deactivated') NOT NULL DEFAULT 'Activated',
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'Henok','Basazn','henokbreraa1221@gmail.com','0940057552','Debirebirhan','hashed_password','Registrar','C:UsersHenokfullprojectfrontendsrcimageprofile picture.png','Activated',NULL),(3,'Sisay','Lema','amanueltefera11@gmail.com','0947756304','wolkite university','$2b$10$ZYDjalZ/SQE88MdmWDG0jeKJOtNHMl14zIRhi.VNiX0LinXwt8zoy','Admin','C:UsersHenokfullprojectfrontendsrcimageprofile picture.png','Activated','1710615300736-hena.jpg'),(4,'Henok','Basazn','henokbasa1221@gmail.com','0940057552','Debirebirhan','$2b$10$Gu8FO2C2.6pJinB2vBpGa.kGMzYYhVjXVvqD5UiyDn1JKHV99hphi','Registrar','C:UsersHenokfullprojectfrontendsrcimageprofile picture.png','Activated','89258d7f-a44c-4ac6-b783-6b9610394fb1.webp'),(8,'Sisya','Teshome','henokbasa@gmail.com','0947756304','wolkite university','$2b$10$qOgNGcUgrt8ria0dBV6JOOWM.pvBiO06lUqbSPcKSQTYg5OGDkP76','Invoice_Clerk','C:/Users/Henok/fullproject/frontend/src/image/profile picture.png','Activated','asset2.jpg'),(12,'Henok','Basazn','hen1221@gmail.com','0940057552','Debirebirhan','$2b$10$zaUecLBUMQKpWQ3e5x.AJuQjpS26I24iMK8xIzBMlC475vkkVGUK.','Admin','C:/Users/Henok/fullproject/frontend/src/image/profile picture.png','Activated','Captura de pantalla 2024-02-11 162831.png'),(13,'Henokkk','Basaznnn','henokbasa122344@gmail.com','0940057552','Debirebirhan','$2b$10$mwIHS84b724aJ1IJP6LJnu.v/lTxCSr5/1e/Awtt2BOXZpbgbDISO','Judge','C:/Users/Henok/fullproject/frontend/src/image/profile picture.png','Activated','hena.jpg'),(14,'sisay','m','u@gmail.com','0940057552','Debirebirhan','$2b$10$6.xgoJnP25.PjiIWP2Ibwu46BzzjRBECjhq.xWESm9Lmb9gxQ3oOy','Proscuter','C:/Users/Henok/fullproject/frontend/src/image/profile picture.png','Activated','photo_2024-01-28_08-43-55.jpg'),(15,'sisay','teshome','sisay@gmail.com','0940057552','Debirebirhan','$2b$10$ZaxZUvyJO0u.JD.KZSIZg.Pf22HoOuUQZzjoMR9AJihnO7jRIpQtO','Registrar','C:/Users/Henok/fullproject/frontend/src/image/profile picture.png','Activated','1710618050634-hena.jpg'),(16,'sisay','teshome','sissay@gmail.com','0940057552','Debirebirhan','$2b$10$Qy/.e.WLt/RyRVTnsYucWekgi/YUAT8IiMiestcBfGsEtYHi4g6Oe','Proscuter','C:/Users/Henok/fullproject/frontend/src/image/profile picture.png','Activated',NULL),(19,'H','B66','hesa1dasd221@gmail.com','0940057552','Debirebirhan','$2b$10$BbXTVTPtOyrxjlqrrH/7ze0fQF5R4Q5SGHllqnlSG8kOO4XOL2mHq','Registrar','C:/Users/Henok/fullproject/frontend/src/image/profile picture.png','Activated',NULL),(20,'H','B66','hesa1dasd2fd21@gmail.com','0940057552','Debirebirhan','$2b$10$O4IaPkZS0j1YWfCyGTciUeb2tTsiNB.oykdkwz6Dnrh/8XYvLdNZ.','Judge','C:/Users/Henok/fullproject/frontend/src/image/profile picture.png','Activated',NULL),(22,'u','m','ewefswu@gmail.com','0940057552','Debirebirhan','$2b$10$d9sd3Kt9UYQtDfAfMOf5f.QgCrFOmiRFoq6Qfvr6v9Mwm7iSiwPy2','Judge','C:/Users/Henok/fullproject/frontend/src/image/profile picture.png','Activated',NULL),(23,'Henok','Basazn','henokbasa12dad21@gmail.com','0940057552','Debirebirhan','$2b$10$I5m1V0LSiPHMNBNlpfg8uOM6HGcpcjXmj3niQXk0Gzt7EIf5osfBi','Registrar','C:/Users/Henok/fullproject/frontend/src/image/profile picture.png','Activated',NULL),(24,'Henok','Basazn','henok@gmail.com','0940057552','Debirebirhan','$2b$10$Pisfe/YodcFi.uUNDcMyIeek/AXC45ws5gK5Pb/XZpRwOpOeK//mW','Judge','C:/Users/Henok/fullproject/frontend/src/image/profile picture.png','Activated','d7fe7818-c967-44bd-89ca-d0f8c6fa47f0.webp'),(25,'Henok','Basazn','henokboioi1221@gmail.com','0940057552','Debirebirhan','$2b$10$AzvHZvjQ0aYX0SWo2jKtVOntPvhbpeYKWgMZVitQz7vEE1/m6J/Fm','Judge','C:/Users/Henok/fullproject/frontend/src/image/profile picture.png','Activated',NULL),(26,'Henok','Basazn','hen@gmail.com','0940057552','Debirebirhan','$2b$10$mBCxsP7lh6rJNCCpch/t5eFQ.6RfI1gWSjV7oe1Kb8hphPKni69BC','Judge','C:/Users/Henok/fullproject/frontend/src/image/profile picture.png','Activated',NULL),(27,'Amanuel','Tefera','amani123tefe@gmail.com','+251947756304','wolkite university','$2b$10$OaCOBpT1R5yxibWlxeCTc.elVyaywMbKBboXdbh4Q5jDcw5YKRr4C','Court_Manager','C:/Users/Henok/fullproject/frontend/src/image/profile picture.png','Activated','asset13.jpg'),(28,'Sisay','Lema','henokbasa122221@gmail.com','0947756304','wolkite university','$2b$10$BpDszTFr4kAQRjpyd5wY0OrEsTJ8E9VVsjKZ5OAGWLHR4tYTu/Wee','Admin','C:/Users/Henok/fullproject/frontend/src/image/profile picture.png','Activated','Screenshot (2).png');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_insert_user` AFTER INSERT ON `users` FOR EACH ROW BEGIN
    IF NEW.role = 'registrar' THEN
        INSERT INTO registrar (id, first_name, last_name, email, phone_number, address, role, status, image)
        VALUES (NEW.id, NEW.first_name, NEW.last_name, NEW.email, NEW.phone_number, NEW.address, NEW.role, NEW.status, NEW.image);
    END IF;

    IF NEW.role = 'judge' THEN
        INSERT INTO judge (id, first_name, last_name, email, phone_number, address, role, status, image)
        VALUES (NEW.id, NEW.first_name, NEW.last_name, NEW.email, NEW.phone_number, NEW.address, NEW.role, NEW.status, NEW.image);
    END IF;

    IF NEW.role = 'prosecutor' THEN
        INSERT INTO prosecutor (id, first_name, last_name, email, phone_number, address, role, status, image)
        VALUES (NEW.id, NEW.first_name, NEW.last_name, NEW.email, NEW.phone_number, NEW.address, NEW.role, NEW.status, NEW.image);
    END IF;

    IF NEW.role = 'admin' THEN
        INSERT INTO admin (id, first_name, last_name, email, phone_number, address, role, status, image)
        VALUES (NEW.id, NEW.first_name, NEW.last_name, NEW.email, NEW.phone_number, NEW.address, NEW.role, NEW.status, NEW.image);
    END IF;

    IF NEW.role = 'court_manager' THEN
        INSERT INTO court_manager (id, first_name, last_name, email, phone_number, address, role, status, image)
        VALUES (NEW.id, NEW.first_name, NEW.last_name, NEW.email, NEW.phone_number, NEW.address, NEW.role, NEW.status, NEW.image);
    END IF;

    IF NEW.role = 'invoice_clerk' THEN
        INSERT INTO invoice_clerk (id, first_name, last_name, email, phone_number, address, role, status, image)
        VALUES (NEW.id, NEW.first_name, NEW.last_name, NEW.email, NEW.phone_number, NEW.address, NEW.role, NEW.status, NEW.image);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `users_judge_type`
--

DROP TABLE IF EXISTS `users_judge_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_judge_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `judge_type` varchar(255) NOT NULL,
  `judge_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `judge_id` (`judge_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_judge_type`
--

LOCK TABLES `users_judge_type` WRITE;
/*!40000 ALTER TABLE `users_judge_type` DISABLE KEYS */;
INSERT INTO `users_judge_type` VALUES (1,'Civil',20),(2,'Civil',22),(3,'Civil',24),(4,'Criminal',25),(5,'Criminal',26);
/*!40000 ALTER TABLE `users_judge_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'court'
--

--
-- Dumping routines for database 'court'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-13 23:10:24

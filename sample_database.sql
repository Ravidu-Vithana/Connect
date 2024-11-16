CREATE DATABASE  IF NOT EXISTS `connect_db` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `connect_db`;
-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: connect_db
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chat`
--

DROP TABLE IF EXISTS `chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_from` int NOT NULL,
  `user_to` int NOT NULL,
  `message` text NOT NULL,
  `date_time` datetime NOT NULL,
  `chat_status_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_chat_user1_idx` (`user_from`),
  KEY `fk_chat_user2_idx` (`user_to`),
  KEY `fk_chat_chat_status1_idx` (`chat_status_id`),
  CONSTRAINT `fk_chat_chat_status1` FOREIGN KEY (`chat_status_id`) REFERENCES `chat_status` (`id`),
  CONSTRAINT `fk_chat_user1` FOREIGN KEY (`user_from`) REFERENCES `user` (`id`),
  CONSTRAINT `fk_chat_user2` FOREIGN KEY (`user_to`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat`
--

LOCK TABLES `chat` WRITE;
/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
INSERT INTO `chat` VALUES (1,2,3,'hi1','2024-10-06 19:53:02',1),(2,3,2,'hi2','2024-10-06 19:54:02',1),(3,2,4,'hi3','2024-10-03 19:55:02',1),(4,2,5,'hi4','2024-10-06 19:56:02',1),(5,3,4,'hi5','2024-10-06 19:57:02',1),(6,4,5,'hi6','2024-10-06 19:58:02',2),(7,2,3,'Hi bro hw are you','2024-10-07 13:22:21',1),(14,2,3,'Adoooo','2024-10-07 15:55:40',1),(15,2,3,'Hello','2024-10-07 16:25:02',1),(16,2,3,'Hi hi','2024-10-07 16:25:51',1),(17,2,3,'Test','2024-10-07 16:34:28',1),(18,2,3,'Testing','2024-10-07 17:42:29',1),(19,2,3,'Test','2024-10-07 17:42:45',1),(20,2,3,'Test','2024-10-07 17:42:47',1),(21,2,3,'Test','2024-10-07 17:42:50',1),(22,2,4,'Hello','2024-10-07 18:14:52',1),(23,2,4,'Hw are you','2024-10-07 18:14:56',1),(24,2,3,'Hi hi bro','2024-10-07 18:33:47',1),(25,2,3,'Hi','2024-10-07 20:44:06',1),(26,2,3,'Test','2024-10-07 20:44:08',1),(27,2,3,'Bokka','2024-10-07 20:44:11',1),(28,2,3,'Gmmk thma','2024-10-07 20:44:23',1),(29,2,3,'Hi hi','2024-10-07 21:02:15',1),(30,2,3,'Hii','2024-10-07 21:06:36',1),(31,2,3,'Helloo','2024-10-07 21:06:39',1),(32,2,3,'Testing','2024-10-07 21:16:31',1),(33,2,3,'Hello','2024-10-07 21:35:51',1),(34,2,3,'Hi hi bro','2024-10-07 21:49:11',1),(35,2,3,'Testing again','2024-10-08 11:35:02',1),(36,2,3,'Testing 2','2024-10-08 11:35:30',1),(37,2,3,'Testing 3','2024-10-08 12:01:44',1),(38,2,3,'Hello hi','2024-10-08 12:03:32',1),(39,2,3,'Hi 3','2024-10-08 12:12:00',1),(40,2,3,'Hi 4','2024-10-08 12:12:17',1),(41,2,3,'Testing message length testing testing testing testing','2024-10-10 15:41:25',1),(42,2,3,'Hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh','2024-10-10 15:42:39',1),(43,2,3,'Mmmmmmmmmmmmmmmmmmmmmmmmmm','2024-10-10 15:43:25',1),(44,2,3,'Testing testing testing testing testing testing mmmmmm testing','2024-10-10 17:49:13',1),(45,2,3,'Testing 2','2024-10-10 17:50:10',1),(46,2,6,'Hi bro','2024-10-10 17:56:39',1),(47,2,6,'Hello','2024-10-10 22:05:46',2),(48,2,3,'Testing msg 1','2024-10-10 22:07:26',1),(49,2,3,'Testing message 2','2024-10-10 22:07:32',1),(50,3,2,'Hi bro how are you','2024-10-10 22:09:13',1),(51,2,3,'Im good, hw r u?','2024-10-10 22:12:36',1),(52,3,5,'Helloâ¦ hw are you','2024-10-10 22:14:50',2),(53,9,2,'Hello ð','2024-10-10 22:32:12',1),(54,2,4,'Hi','2024-10-11 00:41:26',2),(55,2,3,'Hi bro','2024-10-11 01:09:06',1),(56,2,4,'Bro','2024-10-11 08:53:51',2),(57,2,9,'Hi bro','2024-10-11 11:19:29',1),(58,9,2,'Hello hello bro','2024-10-11 11:22:29',1);
/*!40000 ALTER TABLE `chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_status`
--

DROP TABLE IF EXISTS `chat_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_status`
--

LOCK TABLES `chat_status` WRITE;
/*!40000 ALTER TABLE `chat_status` DISABLE KEYS */;
INSERT INTO `chat_status` VALUES (1,'Seen'),(2,'Delivered');
/*!40000 ALTER TABLE `chat_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fname` varchar(20) NOT NULL,
  `lname` varchar(30) NOT NULL,
  `about` varchar(100) NOT NULL DEFAULT 'Hey!! Let''s Connect!',
  `mobile` varchar(10) NOT NULL,
  `password` varchar(45) NOT NULL,
  `joined_date_time` datetime NOT NULL,
  `user_status_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_user_status1_idx` (`user_status_id`),
  CONSTRAINT `fk_user_user_status1` FOREIGN KEY (`user_status_id`) REFERENCES `user_status` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (2,'Raviduuu','Yashithhh','Awesome','0763738202','123@Ryvk','2024-10-06 18:38:05',1),(3,'Tharushaaa','Siriwardana','Hey!! Let\'s Connect!','0763738203','123@Ryvk','2024-10-06 19:17:11',1),(4,'Madusha','Wickramasinghe','Hey!! Let\'s Connect!','0763738204','123@Ryvk','2024-10-06 19:50:11',1),(5,'Nimwara','Wickramasinghe','Hey!! Let\'s Connect!','0763738205','123@Ryvk','2024-10-06 19:51:02',2),(6,'Aakil','Mohomed','Hey!! Let\'s Connect!','0763738206','123@Ryvk','2024-10-07 10:11:12',2),(9,'Pasindu','Dilshan','Hey!! Let\'s Connect!','0763738207','123@Ryvk','2024-10-10 22:21:01',1),(10,'Varshaan','Hariharan','Hey!! Let\'s Connect!','0763738208','123@Ryvk','2024-10-11 11:14:24',1),(11,'Niumal','Silva','Hey!! Let\'s Connect!','0763738209','123@Ryvk','2024-10-11 11:18:32',2);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_status`
--

DROP TABLE IF EXISTS `user_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_status`
--

LOCK TABLES `user_status` WRITE;
/*!40000 ALTER TABLE `user_status` DISABLE KEYS */;
INSERT INTO `user_status` VALUES (1,'Online'),(2,'Offline');
/*!40000 ALTER TABLE `user_status` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-16 20:55:56

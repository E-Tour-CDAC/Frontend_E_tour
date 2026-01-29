-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: e_tour
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `cost_master`
--

DROP TABLE IF EXISTS `cost_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cost_master` (
  `cost_id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `single_person_cost` decimal(10,2) NOT NULL,
  `extra_person_cost` decimal(10,2) NOT NULL,
  `child_with_bed_cost` decimal(10,2) NOT NULL,
  `child_without_bed_cost` decimal(10,2) NOT NULL,
  `valid_from` date NOT NULL,
  `valid_to` date NOT NULL,
  PRIMARY KEY (`cost_id`),
  KEY `fk_cost_category` (`category_id`),
  CONSTRAINT `fk_cost_category` FOREIGN KEY (`category_id`) REFERENCES `category_master` (`category_id`),
  CONSTRAINT `chk_cost_validity` CHECK ((`valid_from` <= `valid_to`))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cost_master`
--

LOCK TABLES `cost_master` WRITE;
/*!40000 ALTER TABLE `cost_master` DISABLE KEYS */;
INSERT INTO `cost_master` VALUES (1,1,35000.00,28000.00,20000.00,15000.00,'2026-01-01','2026-12-31'),(2,2,125000.00,95000.00,70000.00,55000.00,'2026-01-01','2026-12-31'),(3,3,25000.00,20000.00,15000.00,12000.00,'2026-01-01','2026-12-31');
/*!40000 ALTER TABLE `cost_master` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-20  9:04:59

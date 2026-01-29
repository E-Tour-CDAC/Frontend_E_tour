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
-- Table structure for table `booking_header`
--

DROP TABLE IF EXISTS `booking_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_header` (
  `booking_id` int NOT NULL AUTO_INCREMENT,
  `booking_date` date NOT NULL,
  `customer_id` int NOT NULL,
  `tour_id` int NOT NULL,
  `no_of_pax` int NOT NULL,
  `tour_amount` decimal(10,2) NOT NULL,
  `taxes` decimal(10,2) NOT NULL,
  `total_amount` decimal(10,2) GENERATED ALWAYS AS ((`tour_amount` + `taxes`)) STORED,
  `status_id` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`booking_id`),
  KEY `fk_booking_customer` (`customer_id`),
  KEY `fk_booking_tour` (`tour_id`),
  KEY `fk_booking_status` (`status_id`),
  CONSTRAINT `fk_booking_customer` FOREIGN KEY (`customer_id`) REFERENCES `customer_master` (`customer_id`),
  CONSTRAINT `fk_booking_status` FOREIGN KEY (`status_id`) REFERENCES `booking_status_master` (`status_id`),
  CONSTRAINT `fk_booking_tour` FOREIGN KEY (`tour_id`) REFERENCES `tour_master` (`tour_id`),
  CONSTRAINT `chk_no_of_pax` CHECK ((`no_of_pax` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_header`
--

LOCK TABLES `booking_header` WRITE;
/*!40000 ALTER TABLE `booking_header` DISABLE KEYS */;
INSERT INTO `booking_header` (`booking_id`, `booking_date`, `customer_id`, `tour_id`, `no_of_pax`, `tour_amount`, `taxes`, `status_id`) VALUES (1,'2026-01-15',1,1,2,70000.00,3500.00,1),(2,'2026-01-18',2,2,3,285000.00,14250.00,1),(3,'2026-01-20',3,3,4,80000.00,4000.00,1);
/*!40000 ALTER TABLE `booking_header` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-20  9:04:58

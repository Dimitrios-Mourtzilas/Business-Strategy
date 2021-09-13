-- MySQL dump 10.13  Distrib 5.7.35, for osx10.15 (x86_64)
--
-- Host: localhost    Database: business_model
-- ------------------------------------------------------
-- Server version	8.0.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `client`
--

DROP TABLE IF EXISTS `client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client` (
  `clientId` int NOT NULL AUTO_INCREMENT,
  `clientName` varchar(20) NOT NULL,
  `clientCity` varchar(15) NOT NULL,
  `countryCode` char(4) NOT NULL,
  PRIMARY KEY (`clientId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client`
--

LOCK TABLES `client` WRITE;
/*!40000 ALTER TABLE `client` DISABLE KEYS */;
/*!40000 ALTER TABLE `client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `company` (
  `company_id` int NOT NULL AUTO_INCREMENT,
  `company_name` varchar(20) NOT NULL,
  `company_city` varchar(20) NOT NULL,
  `country_code` varchar(20) NOT NULL,
  `year_founded` char(4) DEFAULT 'N/A',
  `empId` int NOT NULL,
  PRIMARY KEY (`company_id`),
  KEY `empId` (`empId`),
  CONSTRAINT `company_ibfk_1` FOREIGN KEY (`empId`) REFERENCES `employee` (`empId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compliantSupplier`
--

DROP TABLE IF EXISTS `compliantSupplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `compliantSupplier` (
  `supplierId` int NOT NULL,
  KEY `supplierId` (`supplierId`),
  CONSTRAINT `compliantSupplier_ibfk_1` FOREIGN KEY (`supplierId`) REFERENCES `supplier` (`supplierId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compliantSupplier`
--

LOCK TABLES `compliantSupplier` WRITE;
/*!40000 ALTER TABLE `compliantSupplier` DISABLE KEYS */;
INSERT INTO `compliantSupplier` VALUES (1000);
/*!40000 ALTER TABLE `compliantSupplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employee` (
  `empId` int NOT NULL AUTO_INCREMENT,
  `empName` varchar(20) NOT NULL,
  `empSurname` varchar(20) NOT NULL,
  `empAge` smallint NOT NULL,
  `empSalary` float DEFAULT '800',
  `empEmail` varchar(20) NOT NULL,
  `empPhone` varchar(20) DEFAULT 'N/A',
  PRIMARY KEY (`empId`),
  UNIQUE KEY `empEmail` (`empEmail`),
  CONSTRAINT `employee_chk_1` CHECK ((`empName` <> _utf8mb4'')),
  CONSTRAINT `employee_chk_2` CHECK ((`empSurname` <> _utf8mb4'')),
  CONSTRAINT `employee_chk_3` CHECK ((`empAge` >= 19)),
  CONSTRAINT `employee_chk_4` CHECK ((`empSalary` >= 0.0)),
  CONSTRAINT `employee_chk_5` CHECK ((`empEmail` <> _utf8mb4''))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `financialReport`
--

DROP TABLE IF EXISTS `financialReport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `financialReport` (
  `report_id` int NOT NULL,
  `starting_period` date NOT NULL,
  `ending_period` date NOT NULL,
  `company_id` int NOT NULL,
  `company_revenue` float NOT NULL,
  `turn_over` float NOT NULL,
  `fixed_costs` float NOT NULL,
  `net_assets` float NOT NULL,
  PRIMARY KEY (`report_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `financialreport_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financialReport`
--

LOCK TABLES `financialReport` WRITE;
/*!40000 ALTER TABLE `financialReport` DISABLE KEYS */;
/*!40000 ALTER TABLE `financialReport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nonCompliantSupplier`
--

DROP TABLE IF EXISTS `nonCompliantSupplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nonCompliantSupplier` (
  `supplierId` int NOT NULL,
  KEY `supplierId` (`supplierId`),
  CONSTRAINT `nonCompliantSupplier_ibfk_1` FOREIGN KEY (`supplierId`) REFERENCES `supplier` (`supplierId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nonCompliantSupplier`
--

LOCK TABLES `nonCompliantSupplier` WRITE;
/*!40000 ALTER TABLE `nonCompliantSupplier` DISABLE KEYS */;
INSERT INTO `nonCompliantSupplier` VALUES (1000),(1000);
/*!40000 ALTER TABLE `nonCompliantSupplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `productId` int NOT NULL AUTO_INCREMENT,
  `productDesc` varchar(20) NOT NULL,
  `productPrice` float DEFAULT '0',
  `productSales` int DEFAULT '0',
  PRIMARY KEY (`productId`),
  CONSTRAINT `product_chk_1` CHECK ((`productDesc` <> _utf8mb4'')),
  CONSTRAINT `product_chk_2` CHECK ((`productPrice` >= 0.0)),
  CONSTRAINT `product_chk_3` CHECK ((`productSales` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `supplier` (
  `supplierId` int NOT NULL,
  `supplierName` varchar(20) NOT NULL,
  `supplierCity` varchar(20) NOT NULL,
  `countryCode` char(4) NOT NULL,
  PRIMARY KEY (`supplierId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
INSERT INTO `supplier` VALUES (1000,'Dimitrios','Athens','GR'),(2000,'Blueprint Furniture','Sofia','BUL'),(2001,'Network LLC','Volos','GR'),(2002,'Nitro Networking','Sofia','BUL'),(2003,'Blue Smart','London','UK'),(2004,'Spectra Digital','Manchester','UK');
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-09-13  8:43:25

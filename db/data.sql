-- MySQL dump 10.13  Distrib 5.7.40, for Linux (x86_64)
--
-- Host: localhost    Database: recipe_blog
-- ------------------------------------------------------
-- Server version	5.7.40-0ubuntu0.18.04.1

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
-- Dumping data for table `articleViews`
--

LOCK TABLES `articleViews` WRITE;
/*!40000 ALTER TABLE `articleViews` DISABLE KEYS */;
INSERT INTO `articleViews` VALUES (1,1,'2024-06-28 17:57:40');
/*!40000 ALTER TABLE `articleViews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `articles`
--

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
INSERT INTO `articles` VALUES (1,'Updated Article Title','This is the updated content of the article.','Updated brief summary of the article.','2024-06-27 11:56:51',NULL,'http://example.com/updated_image.jpg',0,1),(2,'another title','interesting',NULL,'2024-06-27 11:56:51',NULL,NULL,NULL,1),(3,'last one','ok',NULL,'2024-06-27 11:56:51',NULL,NULL,NULL,1),(5,'title 5','abc',NULL,'2024-06-27 12:42:30',NULL,NULL,NULL,NULL),(6,'my new recipe','spfis',NULL,'2024-06-27 15:21:42',NULL,NULL,NULL,NULL),(7,'my new recipe 2','spfisss',NULL,'2024-06-27 15:25:44',NULL,NULL,NULL,NULL),(8,'my new recipe 2','spfisss',NULL,'2024-06-27 15:35:41',NULL,NULL,NULL,NULL),(9,'my new recipe 2','spfisss',NULL,'2024-06-27 16:06:43',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'This is a comment.',1,'2024-06-28 19:03:54',0),(2,'This is a test comment.',1,'2024-07-01 10:20:58',1),(7,'I love water',1,'2024-07-01 11:38:58',23),(8,'I love eggs',1,'2024-07-01 11:39:04',22);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ingredients`
--

LOCK TABLES `ingredients` WRITE;
/*!40000 ALTER TABLE `ingredients` DISABLE KEYS */;
INSERT INTO `ingredients` VALUES (44,'Egg','1',22),(45,'Water','1',23),(46,'Ice','3',23);
/*!40000 ALTER TABLE `ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `recipe_ingredients`
--

LOCK TABLES `recipe_ingredients` WRITE;
/*!40000 ALTER TABLE `recipe_ingredients` DISABLE KEYS */;
/*!40000 ALTER TABLE `recipe_ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `recipes`
--

LOCK TABLES `recipes` WRITE;
/*!40000 ALTER TABLE `recipes` DISABLE KEYS */;
INSERT INTO `recipes` VALUES (22,'Fried Egg',NULL,'Eggs are delicous',NULL,1,1,'2024-07-01 10:25:18','2024-07-01 10:25:18','Break the egg open and fry it on the pan'),(23,'Water',NULL,'Ice is optional',NULL,1,1,'2024-07-01 11:38:46','2024-07-01 11:38:46','You need a cup and water');
/*!40000 ALTER TABLE `recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES ('admin',NULL),('user',NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin',NULL,NULL,'alice',NULL,'2024-06-27 11:55:35','$2b$10$diuRcy9s/OFYI13PObUt8.OcKrOtPidWuzzsNARteQac4GiLeegnq',NULL,'alice10@example.com',NULL),(2,'user',NULL,NULL,'bob',NULL,'2024-06-27 11:55:35',NULL,NULL,'bobo@example.com',NULL),(3,'user',NULL,NULL,'colin',NULL,'2024-06-27 11:55:35','password',NULL,'colin@example.com',NULL),(4,'admin',NULL,NULL,'testuser',NULL,'2024-06-30 13:21:40','$2b$10$3M00shoiXm28PCBLN3jP3Os4jnZtGEIclrOR9Cz3GwLH47yV63w8a',NULL,'testuser@example.com',NULL),(6,'admin',NULL,NULL,'te0stuser',NULL,'2024-06-30 13:40:36','$2b$10$.lAGociUJcurgq6DxgamoOvN6L0idgcnbxUqg7Bgys2xsd23e/l9y',NULL,'test90user@example.com',NULL),(7,'user',NULL,NULL,'spfis22',NULL,'2024-06-30 13:41:34','$2b$10$bBWtA3DgK32FLylJSre/tuNjiXtNrjlcoRFvWmxcAhAErUZr9eCme',NULL,'dhva2241o.uk@gmail.com',NULL),(8,'user',NULL,NULL,'1313aaa',NULL,'2024-06-30 14:01:43','$2b$10$CxuGQmlrjTaFTIrn6g2Ht.PopAlLpB6dgruGmAY/rGstq2AV.NgiG',NULL,'pisfpi@gmail.com',NULL),(9,'user',NULL,NULL,'padqpi99',NULL,'2024-06-30 14:36:08','$2b$10$QDK6QlY6KoB6Y7f7FpnYrOB0PFc7hOyc/nBQEB/TMcc3DRYiiTJMu',NULL,'sopfasopj@gmail.com',NULL),(10,'user',NULL,NULL,'tomakralj',NULL,'2024-06-30 15:45:16','$2b$10$HPjMbDH66fX9ynPtFLyZMu.lLHHQlxSXF2qHep9h5w/6okq7rabZa',NULL,'asdf@gmail.com',NULL),(11,'user',NULL,NULL,'tomatoma',NULL,'2024-07-01 09:51:40','$2b$10$MK0bw5Yrya6g5ZqqwvqpIuBq/umFzKOpE5b3Q61X5w7b/7v.Cwx4y',NULL,'toma@toma.com',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-01 11:56:16

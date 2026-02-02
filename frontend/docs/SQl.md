## -- MySQL dump 10.13 Distrib 8.0.44, for Linux (x86_64)

-- Host: localhost Database: vietsignschool

---

-- Server version 8.0.44

/_!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT _/;
/_!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS _/;
/_!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION _/;
/_!50503 SET NAMES utf8mb4 _/;
/_!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE _/;
/_!40103 SET TIME_ZONE='+00:00' _/;
/_!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 _/;
/_!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 _/;
/_!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' _/;
/_!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 _/;

--
-- Table structure for table `_user`
--

DROP TABLE IF EXISTS `_user`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `_user` (
`id` int NOT NULL,
`email` varchar(255) DEFAULT NULL,
`firstname` varchar(255) DEFAULT NULL,
`lastname` varchar(255) DEFAULT NULL,
`password` varchar(255) DEFAULT NULL,
`role` enum('ADMIN','MANAGER','USER') DEFAULT NULL,
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `_user`
--

LOCK TABLES `_user` WRITE;
/_!40000 ALTER TABLE `_user` DISABLE KEYS _/;
/_!40000 ALTER TABLE `_user` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `answer`
--

DROP TABLE IF EXISTS `answer`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `answer` (
`answer_id` bigint NOT NULL AUTO_INCREMENT,
`created_by` varchar(255) DEFAULT NULL,
`created_date` datetime(6) DEFAULT NULL,
`modified_by` varchar(255) DEFAULT NULL,
`modified_date` datetime(6) DEFAULT NULL,
`content` varchar(255) DEFAULT NULL,
`image_location` varchar(255) DEFAULT NULL,
`is_correct` bit(1) NOT NULL,
`video_location` varchar(255) DEFAULT NULL,
`question_id` bigint DEFAULT NULL,
PRIMARY KEY (`answer_id`),
KEY `FK8frr4bcabmmeyyu60qt7iiblo` (`question_id`),
CONSTRAINT `FK8frr4bcabmmeyyu60qt7iiblo` FOREIGN KEY (`question_id`) REFERENCES `question` (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=346 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `answer`
--

LOCK TABLES `answer` WRITE;
/_!40000 ALTER TABLE `answer` DISABLE KEYS _/;
/_!40000 ALTER TABLE `answer` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `class_room`
--

DROP TABLE IF EXISTS `class_room`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `class_room` (
`class_room_id` bigint NOT NULL AUTO_INCREMENT,
`created_by` varchar(255) DEFAULT NULL,
`created_date` datetime(6) DEFAULT NULL,
`modified_by` varchar(255) DEFAULT NULL,
`modified_date` datetime(6) DEFAULT NULL,
`content` varchar(255) DEFAULT NULL,
`image_location` varchar(255) DEFAULT NULL,
`thumbnail_path` varchar(255) DEFAULT NULL,
`teacher_id` bigint DEFAULT NULL,
`description` varchar(255) DEFAULT NULL,
`class_code` varchar(255) DEFAULT NULL,
`is_teacher_created` tinyint(1) DEFAULT '0',
`status` enum('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
`slug` varchar(255) DEFAULT NULL,
`class_level` enum('Lớp 1','Lớp 2','Lớp 3','Lớp 4','Lớp 5') NOT NULL,
`school_name` varchar(255) DEFAULT NULL,
`school_id` bigint DEFAULT NULL,
PRIMARY KEY (`class_room_id`),
KEY `fk_teacher` (`teacher_id`),
KEY `fk_classroom_school_id` (`school_id`),
CONSTRAINT `fk_classroom_school_id` FOREIGN KEY (`school_id`) REFERENCES `school` (`school_id`),
CONSTRAINT `fk_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `class_room`
--

LOCK TABLES `class_room` WRITE;
/_!40000 ALTER TABLE `class_room` DISABLE KEYS _/;
/_!40000 ALTER TABLE `class_room` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `class_student`
--

DROP TABLE IF EXISTS `class_student`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `class_student` (
`class_student_id` bigint NOT NULL AUTO_INCREMENT,
`class_room_id` bigint NOT NULL,
`user_id` bigint NOT NULL,
`created_date` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
`modified_date` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
PRIMARY KEY (`class_student_id`),
KEY `fk_class_student_classroom` (`class_room_id`),
KEY `fk_class_student_user` (`user_id`),
CONSTRAINT `fk_class_student_classroom` FOREIGN KEY (`class_room_id`) REFERENCES `class_room` (`class_room_id`) ON DELETE CASCADE,
CONSTRAINT `fk_class_student_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `class_student`
--

LOCK TABLES `class_student` WRITE;
/_!40000 ALTER TABLE `class_student` DISABLE KEYS _/;
/_!40000 ALTER TABLE `class_student` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `class_teacher`
--

DROP TABLE IF EXISTS `class_teacher`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `class_teacher` (
`class_teacher_id` bigint NOT NULL AUTO_INCREMENT,
`class_room_id` bigint NOT NULL,
`user_id` bigint NOT NULL,
`created_date` datetime DEFAULT CURRENT_TIMESTAMP,
`modified_date` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`class_teacher_id`),
KEY `fk_class_teacher_classroom` (`class_room_id`),
KEY `fk_class_teacher_user` (`user_id`),
CONSTRAINT `fk_class_teacher_classroom` FOREIGN KEY (`class_room_id`) REFERENCES `class_room` (`class_room_id`) ON DELETE CASCADE,
CONSTRAINT `fk_class_teacher_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `class_teacher`
--

LOCK TABLES `class_teacher` WRITE;
/_!40000 ALTER TABLE `class_teacher` DISABLE KEYS _/;
/_!40000 ALTER TABLE `class_teacher` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `contact` (
`contact_id` bigint NOT NULL AUTO_INCREMENT,
`created_by` varchar(255) DEFAULT NULL,
`created_date` datetime(6) DEFAULT NULL,
`modified_by` varchar(255) DEFAULT NULL,
`modified_date` datetime(6) DEFAULT NULL,
`avatar_location` varchar(255) DEFAULT NULL,
`email` varchar(255) DEFAULT NULL,
`name` varchar(255) DEFAULT NULL,
PRIMARY KEY (`contact_id`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `contact`
--

LOCK TABLES `contact` WRITE;
/_!40000 ALTER TABLE `contact` DISABLE KEYS _/;
/_!40000 ALTER TABLE `contact` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `conversation`
--

DROP TABLE IF EXISTS `conversation`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `conversation` (
`conversation_id` bigint NOT NULL AUTO_INCREMENT,
`created_by` varchar(255) DEFAULT NULL,
`created_date` datetime(6) DEFAULT NULL,
`modified_by` varchar(255) DEFAULT NULL,
`modified_date` datetime(6) DEFAULT NULL,
`conversation_name` varchar(255) DEFAULT NULL,
`conversation_type` enum('GROUP','SINGLE') DEFAULT NULL,
PRIMARY KEY (`conversation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `conversation`
--

LOCK TABLES `conversation` WRITE;
/_!40000 ALTER TABLE `conversation` DISABLE KEYS _/;
/_!40000 ALTER TABLE `conversation` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `data_collection`
--

DROP TABLE IF EXISTS `data_collection`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `data_collection` (
`data_collection_id` bigint NOT NULL AUTO_INCREMENT,
`volunteer_email` varchar(255) DEFAULT NULL,
`created_date` datetime(6) DEFAULT NULL,
`modified_by` varchar(255) DEFAULT NULL,
`modified_date` datetime(6) DEFAULT NULL,
`admin_email` varchar(255) DEFAULT NULL,
`data_location` varchar(255) DEFAULT NULL,
`feed_back` varchar(255) DEFAULT NULL,
`score` float NOT NULL,
`status` int NOT NULL,
`vocabulary_id` bigint DEFAULT NULL,
`created_by` varchar(255) DEFAULT NULL,
`detection_content` varchar(255) DEFAULT NULL,
PRIMARY KEY (`data_collection_id`),
KEY `FKlp6aat9pduh93prfhiykbv1r5` (`vocabulary_id`),
CONSTRAINT `FKlp6aat9pduh93prfhiykbv1r5` FOREIGN KEY (`vocabulary_id`) REFERENCES `vocabulary` (`vocabulary_id`)
) ENGINE=InnoDB AUTO_INCREMENT=160 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `data_collection`
--

LOCK TABLES `data_collection` WRITE;
/_!40000 ALTER TABLE `data_collection` DISABLE KEYS _/;
/_!40000 ALTER TABLE `data_collection` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `exam`
--

DROP TABLE IF EXISTS `exam`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `exam` (
`exam_id` bigint NOT NULL AUTO_INCREMENT,
`created_by` varchar(255) DEFAULT NULL,
`created_date` datetime(6) DEFAULT NULL,
`modified_by` varchar(255) DEFAULT NULL,
`modified_date` datetime(6) DEFAULT NULL,
`is_private` bit(1) NOT NULL,
`name` varchar(255) DEFAULT NULL,
`class_room_id` bigint DEFAULT NULL,
PRIMARY KEY (`exam_id`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `exam`
--

LOCK TABLES `exam` WRITE;
/_!40000 ALTER TABLE `exam` DISABLE KEYS _/;
/_!40000 ALTER TABLE `exam` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `exam_attempt`
--

DROP TABLE IF EXISTS `exam_attempt`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `exam_attempt` (
`attempt_id` bigint NOT NULL AUTO_INCREMENT,
`exam_id` bigint NOT NULL,
`user_id` bigint NOT NULL,
`score` float DEFAULT NULL,
`started_at` datetime DEFAULT CURRENT_TIMESTAMP,
`finished_at` datetime DEFAULT NULL,
PRIMARY KEY (`attempt_id`),
KEY `exam_id` (`exam_id`),
KEY `user_id` (`user_id`),
CONSTRAINT `exam_attempt_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`exam_id`),
CONSTRAINT `exam_attempt_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `exam_attempt`
--

LOCK TABLES `exam_attempt` WRITE;
/_!40000 ALTER TABLE `exam_attempt` DISABLE KEYS _/;
/_!40000 ALTER TABLE `exam_attempt` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `friend_ship`
--

DROP TABLE IF EXISTS `friend_ship`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `friend_ship` (
`created_by` varchar(255) NOT NULL,
`created_date` datetime(6) DEFAULT NULL,
`modified_by` varchar(255) DEFAULT NULL,
`modified_date` datetime(6) DEFAULT NULL,
`status` int NOT NULL,
`send_friend_id` bigint NOT NULL,
`accept_friend_id` bigint NOT NULL,
PRIMARY KEY (`accept_friend_id`,`send_friend_id`),
KEY `FK1aao5ce4qv11rxt2ae94ix7r0` (`send_friend_id`),
CONSTRAINT `FK1aao5ce4qv11rxt2ae94ix7r0` FOREIGN KEY (`send_friend_id`) REFERENCES `user` (`user_id`),
CONSTRAINT `FKg0yu0k5m1wq1yg4usf0xmyuxu` FOREIGN KEY (`accept_friend_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `friend_ship`
--

LOCK TABLES `friend_ship` WRITE;
/_!40000 ALTER TABLE `friend_ship` DISABLE KEYS _/;
/_!40000 ALTER TABLE `friend_ship` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `group_member`
--

DROP TABLE IF EXISTS `group_member`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `group_member` (
`group_member_id` bigint NOT NULL AUTO_INCREMENT,
`created_by` varchar(255) DEFAULT NULL,
`created_date` datetime(6) DEFAULT NULL,
`modified_by` varchar(255) DEFAULT NULL,
`modified_date` datetime(6) DEFAULT NULL,
`is_active` bit(1) NOT NULL,
`last_activity` datetime(6) DEFAULT NULL,
`contact_id` bigint DEFAULT NULL,
`conversation_id` bigint DEFAULT NULL,
PRIMARY KEY (`group_member_id`),
KEY `FKqbnnx666uxh38dff4uanvgw88` (`contact_id`),
KEY `FKh9ojh95jsbqa9k94mk9sjs64k` (`conversation_id`),
CONSTRAINT `FKh9ojh95jsbqa9k94mk9sjs64k` FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`conversation_id`),
CONSTRAINT `FKqbnnx666uxh38dff4uanvgw88` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`contact_id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `group_member`
--

LOCK TABLES `group_member` WRITE;
/_!40000 ALTER TABLE `group_member` DISABLE KEYS _/;
/_!40000 ALTER TABLE `group_member` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `introduction`
--

DROP TABLE IF EXISTS `introduction`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `introduction` (
`introduction_id` bigint NOT NULL AUTO_INCREMENT,
`created_by` varchar(255) DEFAULT NULL,
`created_date` datetime(6) DEFAULT NULL,
`modified_by` varchar(255) DEFAULT NULL,
`modified_date` datetime(6) DEFAULT NULL,
`body` text,
`footer` text,
`title` text,
PRIMARY KEY (`introduction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `introduction`
--

LOCK TABLES `introduction` WRITE;
/_!40000 ALTER TABLE `introduction` DISABLE KEYS _/;
/_!40000 ALTER TABLE `introduction` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `lesson`
--

DROP TABLE IF EXISTS `lesson`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `lesson` (
`lesson_id` bigint NOT NULL AUTO_INCREMENT,
`created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
`created_date` datetime(6) DEFAULT NULL,
`modified_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
`modified_date` datetime(6) DEFAULT NULL,
`class_room_id` bigint DEFAULT NULL,
`image_location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
`lesson_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
`video_location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
PRIMARY KEY (`lesson_id`),
UNIQUE KEY `lesson_id` (`lesson_id`)
) ENGINE=InnoDB AUTO_INCREMENT=152 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `lesson`
--

LOCK TABLES `lesson` WRITE;
/_!40000 ALTER TABLE `lesson` DISABLE KEYS _/;
/_!40000 ALTER TABLE `lesson` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `message` (
`message_id` bigint NOT NULL AUTO_INCREMENT,
`created_by` varchar(255) DEFAULT NULL,
`created_date` datetime(6) DEFAULT NULL,
`modified_by` varchar(255) DEFAULT NULL,
`modified_date` datetime(6) DEFAULT NULL,
`content` varchar(255) DEFAULT NULL,
`media_location` varchar(255) DEFAULT NULL,
`message_type` enum('TEXT','VIDEO') DEFAULT NULL,
`status` int NOT NULL,
`group_member_id` bigint DEFAULT NULL,
PRIMARY KEY (`message_id`),
KEY `FKggk1gfstbl8c40323lcq45iij` (`group_member_id`),
CONSTRAINT `FKggk1gfstbl8c40323lcq45iij` FOREIGN KEY (`group_member_id`) REFERENCES `group_member` (`group_member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=489 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/_!40000 ALTER TABLE `message` DISABLE KEYS _/;
/_!40000 ALTER TABLE `message` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `mobile`
--

DROP TABLE IF EXISTS `mobile`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `mobile` (
`mobile_id` bigint NOT NULL AUTO_INCREMENT,
`created_by` varchar(255) DEFAULT NULL,
`created_date` datetime(6) DEFAULT NULL,
`modified_by` varchar(255) DEFAULT NULL,
`modified_date` datetime(6) DEFAULT NULL,
`mobile_location` varchar(255) DEFAULT NULL,
PRIMARY KEY (`mobile_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `mobile`
--

LOCK TABLES `mobile` WRITE;
/_!40000 ALTER TABLE `mobile` DISABLE KEYS _/;
/_!40000 ALTER TABLE `mobile` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `organization`
--

DROP TABLE IF EXISTS `organization`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `organization` (
`organization_id` bigint NOT NULL AUTO_INCREMENT,
`parent_id` bigint DEFAULT NULL,
`name` varchar(255) NOT NULL,
`slug` varchar(255) DEFAULT NULL,
`type` enum('EDU_SYSTEM','CENTER','SCHOOL','DEPARTMENT','FACILITY') NOT NULL COMMENT 'Loại tổ chức',
`address` varchar(255) DEFAULT NULL,
`city` varchar(100) DEFAULT NULL,
`ward` varchar(100) DEFAULT NULL,
`street` varchar(255) DEFAULT NULL,
`phone` varchar(50) DEFAULT NULL,
`email` varchar(255) DEFAULT NULL,
`status` enum('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
`modified_by` varchar(255) DEFAULT NULL,
`modified_date` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
`is_manager` tinyint(1) DEFAULT '0' COMMENT 'Phụ trách chính',
`assigned_by` varchar(255) DEFAULT NULL COMMENT 'Người phân công',
`assigned_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (`organization_id`),
KEY `fk_org_parent` (`parent_id`),
CONSTRAINT `fk_org_parent` FOREIGN KEY (`parent_id`) REFERENCES `organization` (`organization_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `organization`
--

LOCK TABLES `organization` WRITE;
/_!40000 ALTER TABLE `organization` DISABLE KEYS _/;
INSERT INTO `organization` VALUES (1,NULL,'Bộ Giáo dục và Đào tạo','bo-giao-duc-va-djao-tao','EDU_SYSTEM','35 Đại Cồ Việt','Hà Nội',NULL,NULL,'123456789','contact@moet.gov.vn','ACTIVE','admin@gmail.com','2025-12-30 12:52:30.000000',0,NULL,'2026-01-08 15:45:14'),(2,1,'Sở Giáo dục và Đào tạo Hà Nội','so-giao-duc-va-djao-tao-ha-noi','CENTER','23 Quang Trung','Hà Nội',NULL,NULL,'02438253026','sogddt@hanoi.gov.vn','ACTIVE',NULL,'2025-12-30 12:24:31.149552',0,NULL,'2026-01-08 15:45:14'),(3,2,'Trường THPT Chu Văn An','truong-thpt-chu-van-an','SCHOOL','Số 10 Thụy Khuê','Hà Nội',NULL,NULL,'02438232980','c3chuvanan@hanoi.edu.vn','ACTIVE',NULL,'2025-12-30 12:24:43.632431',0,NULL,'2026-01-08 15:45:14'),(4,2,'Trường THPT Kim Liên','truong-thpt-kim-lien','SCHOOL','Đặng Văn Ngữ','Hà Nội',NULL,NULL,'02435740033','thptkimlien@hanoi.edu.vn','ACTIVE',NULL,'2025-12-30 12:25:26.719330',0,NULL,'2026-01-08 15:45:14');
/_!40000 ALTER TABLE `organization` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `organization_manager`
--

DROP TABLE IF EXISTS `organization_manager`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `organization_manager` (
`id` bigint NOT NULL AUTO_INCREMENT,
`organization_id` bigint NOT NULL,
`user_id` bigint NOT NULL,
`role_in_org` enum('SUPER_ADMIN','CENTER_ADMIN','SCHOOL_ADMIN','TEACHER','STUDENT','USER') COLLATE utf8mb4_unicode_ci NOT NULL,
`is_primary` tinyint(1) DEFAULT '0',
`assigned_date` datetime DEFAULT CURRENT_TIMESTAMP,
`assigned_by` bigint DEFAULT NULL COMMENT 'User ID who assigned this role',
`modified_date` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last modification date',
PRIMARY KEY (`id`),
UNIQUE KEY `organization_id` (`organization_id`,`user_id`),
KEY `user_id` (`user_id`),
KEY `fk_org_manager_assigned_by` (`assigned_by`),
CONSTRAINT `fk_org_manager_assigned_by` FOREIGN KEY (`assigned_by`) REFERENCES `user` (`user_id`) ON DELETE SET NULL,
CONSTRAINT `organization_manager_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`organization_id`),
CONSTRAINT `organization_manager_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `organization_manager`
--

LOCK TABLES `organization_manager` WRITE;
/_!40000 ALTER TABLE `organization_manager` DISABLE KEYS _/;
INSERT INTO `organization_manager` VALUES (1,1,1,'SUPER_ADMIN',1,'2026-01-04 16:29:16',NULL,NULL);
/_!40000 ALTER TABLE `organization_manager` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `part`
--

DROP TABLE IF EXISTS `part`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `part` (
`part_id` bigint NOT NULL AUTO_INCREMENT,
`created_by` varchar(255) DEFAULT NULL,
`created_date` datetime(6) DEFAULT NULL,
`modified_by` varchar(255) DEFAULT NULL,
`modified_date` datetime(6) DEFAULT NULL,
`lesson_id` bigint DEFAULT NULL,
`part_name` varchar(255) DEFAULT NULL,
PRIMARY KEY (`part_id`)
) ENGINE=InnoDB AUTO_INCREMENT=357 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `part`
--

LOCK TABLES `part` WRITE;
/_!40000 ALTER TABLE `part` DISABLE KEYS _/;
/_!40000 ALTER TABLE `part` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `part_image`
--

DROP TABLE IF EXISTS `part_image`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `part_image` (
`part_image_id` bigint NOT NULL AUTO_INCREMENT,
`created_by` varchar(255) DEFAULT NULL,
`created_date` datetime(6) DEFAULT NULL,
`modified_by` varchar(255) DEFAULT NULL,
`modified_date` datetime(6) DEFAULT NULL,
`image_location` varchar(255) DEFAULT NULL,
`part_id` bigint DEFAULT NULL,
PRIMARY KEY (`part_image_id`)
) ENGINE=InnoDB AUTO_INCREMENT=195 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `part_image`
--

LOCK TABLES `part_image` WRITE;
/_!40000 ALTER TABLE `part_image` DISABLE KEYS _/;
/_!40000 ALTER TABLE `part_image` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `part_video`
--

DROP TABLE IF EXISTS `part_video`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `part_video` (
`part_video_id` bigint NOT NULL AUTO_INCREMENT,
`created_by` varchar(255) DEFAULT NULL,
`created_date` datetime(6) DEFAULT NULL,
`modified_by` varchar(255) DEFAULT NULL,
`modified_date` datetime(6) DEFAULT NULL,
`part_id` bigint DEFAULT NULL,
`video_location` varchar(255) DEFAULT NULL,
PRIMARY KEY (`part_video_id`)
) ENGINE=InnoDB AUTO_INCREMENT=252 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `part_video`
--

LOCK TABLES `part_video` WRITE;
/_!40000 ALTER TABLE `part_video` DISABLE KEYS _/;
/_!40000 ALTER TABLE `part_video` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `part_view`
--

DROP TABLE IF EXISTS `part_view`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `part_view` (
`part_view_id` bigint NOT NULL AUTO_INCREMENT,
`user_id` bigint NOT NULL,
`part_id` bigint NOT NULL DEFAULT '0',
`lesson_id` bigint DEFAULT NULL,
`last_viewed_at` timestamp NOT NULL,
`view_count` bigint DEFAULT '0',
`created_date` timestamp NULL DEFAULT NULL,
PRIMARY KEY (`part_view_id`),
KEY `fk_partview_user` (`user_id`),
KEY `fk_partview_part` (`part_id`),
KEY `fk_partview_lesson` (`lesson_id`),
CONSTRAINT `fk_partview_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lesson` (`lesson_id`) ON DELETE CASCADE,
CONSTRAINT `fk_partview_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `part_view`
--

LOCK TABLES `part_view` WRITE;
/_!40000 ALTER TABLE `part_view` DISABLE KEYS _/;
/_!40000 ALTER TABLE `part_view` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `password_reset_tokens` (
`id` int NOT NULL AUTO_INCREMENT,
`user_id` bigint NOT NULL,
`email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`expires_at` datetime NOT NULL,
`used` tinyint(1) DEFAULT '0',
`created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (`id`),
UNIQUE KEY `token` (`token`),
KEY `idx_token` (`token`),
KEY `idx_email` (`email`),
KEY `idx_user_id` (`user_id`),
CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/_!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS _/;
INSERT INTO `password_reset_tokens` VALUES (10,298,'vuquangduy13032002@gmail.com','0cd81b3b898549425e9bd4cd2aba6c3efe78980df7254b73762d0eb1bdc40d7e','2026-01-10 12:33:11',0,'2026-01-10 05:18:37'),(13,305,'quangduy13032002@gmail.com','76872a895e8aeea8843236c4200c408427d79421e9a64b318a97939d0fc81468','2026-01-10 12:42:01',1,'2026-01-10 05:27:26');
/_!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `permissions` (
`permission_id` int NOT NULL AUTO_INCREMENT,
`code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
`name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`description` text COLLATE utf8mb4_unicode_ci,
`module` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Module: USER, CLASS, COURSE, ORGANIZATION, etc.',
`created_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (`permission_id`),
UNIQUE KEY `code` (`code`),
KEY `idx_code` (`code`),
KEY `idx_module` (`module`)
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/_!40000 ALTER TABLE `permissions` DISABLE KEYS _/;
INSERT INTO `permissions` VALUES (1,'HOME_VIEW','Xem trang chủ','Truy cập trang chủ','HOME','2026-01-09 08:21:32'),(2,'DASHBOARD_VIEW','Xem dashboard','Xem trang tổng quan','DASHBOARD','2026-01-09 08:21:32'),(3,'USER_VIEW','Xem người dùng','Xem danh sách và chi tiết người dùng','USER','2026-01-09 08:21:45'),(4,'USER_CREATE','Tạo người dùng','Tạo người dùng mới','USER','2026-01-09 08:21:45'),(5,'USER_UPDATE','Cập nhật người dùng','Chỉnh sửa thông tin người dùng','USER','2026-01-09 08:21:45'),(6,'USER_DELETE','Xóa người dùng','Xóa người dùng khỏi hệ thống','USER','2026-01-09 08:21:45'),(7,'USER_ASSIGN_ROLE','Gán vai trò','Gán vai trò cho người dùng','USER','2026-01-09 08:21:45'),(8,'ORGANIZATION_VIEW','Xem cơ sở','Xem danh sách và chi tiết cơ sở','ORGANIZATION','2026-01-09 08:21:53'),(9,'ORGANIZATION_CREATE','Tạo cơ sở','Tạo cơ sở mới','ORGANIZATION','2026-01-09 08:21:53'),(10,'ORGANIZATION_UPDATE','Cập nhật cơ sở','Chỉnh sửa thông tin cơ sở','ORGANIZATION','2026-01-09 08:21:53'),(11,'ORGANIZATION_DELETE','Xóa cơ sở','Xóa cơ sở khỏi hệ thống','ORGANIZATION','2026-01-09 08:21:53'),(12,'LEARNING_VIEW','Xem học tập','Xem nội dung học tập','LEARNING','2026-01-09 08:22:16'),(13,'LEARNING_CREATE','Tạo bài học','Tạo nội dung học tập mới','LEARNING','2026-01-09 08:22:16'),(14,'LEARNING_UPDATE','Cập nhật bài học','Chỉnh sửa nội dung học tập','LEARNING','2026-01-09 08:22:16'),(15,'LEARNING_DELETE','Xóa bài học','Xóa nội dung học tập','LEARNING','2026-01-09 08:22:16'),(16,'LEARNING_STUDY','Học tập','Quyền học tập (dành cho học sinh)','LEARNING','2026-01-09 08:22:16'),(17,'CLASS_VIEW','Xem lớp học','Xem danh sách và chi tiết lớp học','CLASS','2026-01-09 08:22:30'),(18,'CLASS_CREATE','Tạo lớp học','Tạo lớp học mới','CLASS','2026-01-09 08:22:30'),(19,'CLASS_UPDATE','Cập nhật lớp học','Chỉnh sửa thông tin lớp học','CLASS','2026-01-09 08:22:30'),(20,'CLASS_DELETE','Xóa lớp học','Xóa lớp học','CLASS','2026-01-09 08:22:30'),(21,'CLASS_REGISTER','Đăng ký lớp học','Đăng ký tham gia lớp học (học sinh)','CLASS','2026-01-09 08:22:30'),(22,'NOTIFICATION_VIEW','Xem thông báo','Xem danh sách thông báo','NOTIFICATION','2026-01-09 08:23:18'),(23,'NOTIFICATION_CREATE','Tạo thông báo','Tạo thông báo mới','NOTIFICATION','2026-01-09 08:23:18'),(24,'NOTIFICATION_UPDATE','Cập nhật thông báo','Chỉnh sửa thông báo','NOTIFICATION','2026-01-09 08:23:18'),(25,'NOTIFICATION_DELETE','Xóa thông báo','Xóa thông báo','NOTIFICATION','2026-01-09 08:23:18'),(26,'TOOL_VIEW','Xem công cụ','Xem danh sách công cụ','TOOL','2026-01-09 08:23:18'),(27,'TOOL_CREATE','Tạo công cụ','Tạo công cụ mới','TOOL','2026-01-09 08:23:18'),(28,'TOOL_UPDATE','Cập nhật công cụ','Chỉnh sửa công cụ','TOOL','2026-01-09 08:23:18'),(29,'TOOL_DELETE','Xóa công cụ','Xóa công cụ','TOOL','2026-01-09 08:23:18'),(30,'EXAM_VIEW','Xem kiểm tra','Xem danh sách bài kiểm tra','EXAM','2026-01-09 08:23:18'),(31,'EXAM_CREATE','Tạo bài kiểm tra','Tạo bài kiểm tra mới','EXAM','2026-01-09 08:23:18'),(32,'EXAM_UPDATE','Cập nhật bài kiểm tra','Chỉnh sửa bài kiểm tra','EXAM','2026-01-09 08:23:18'),(33,'EXAM_DELETE','Xóa bài kiểm tra','Xóa bài kiểm tra','EXAM','2026-01-09 08:23:18'),(34,'EXAM_TAKE','Làm bài kiểm tra','Tham gia làm bài kiểm tra (học sinh)','EXAM','2026-01-09 08:23:18'),(35,'EXAM_GRADE','Chấm điểm','Chấm điểm bài kiểm tra (giáo viên)','EXAM','2026-01-09 08:23:18'),(36,'STATISTICS_VIEW','Xem thống kê','Xem báo cáo thống kê','STATISTICS','2026-01-09 08:23:18'),(37,'STATISTICS_EXPORT','Xuất thống kê','Xuất báo cáo thống kê','STATISTICS','2026-01-09 08:23:18'),(38,'DICTIONARY_VIEW','Xem từ điển','Xem từ điển ngôn ngữ ký hiệu','DICTIONARY','2026-01-09 08:23:18'),(39,'DICTIONARY_CREATE','Tạo từ điển','Thêm từ vào từ điển','DICTIONARY','2026-01-09 08:23:18'),(40,'DICTIONARY_UPDATE','Cập nhật từ điển','Chỉnh sửa từ trong từ điển','DICTIONARY','2026-01-09 08:23:18'),(41,'DICTIONARY_DELETE','Xóa từ điển','Xóa từ khỏi từ điển','DICTIONARY','2026-01-09 08:23:18'),(42,'GAME_VIEW','Xem trò chơi','Xem và chơi trò chơi','GAME','2026-01-09 08:23:18'),(43,'GAME_CREATE','Tạo trò chơi','Tạo trò chơi mới','GAME','2026-01-09 08:23:18'),(44,'GAME_UPDATE','Cập nhật trò chơi','Chỉnh sửa trò chơi','GAME','2026-01-09 08:23:18'),(45,'GAME_DELETE','Xóa trò chơi','Xóa trò chơi','GAME','2026-01-09 08:23:18'),(46,'SYSTEM_ADMIN','Quản trị hệ thống','Toàn quyền quản trị hệ thống','SYSTEM','2026-01-09 08:23:18'),(47,'SETTING_VIEW','Xem cài đặt','Xem cài đặt hệ thống','SYSTEM','2026-01-09 08:23:18'),(48,'SETTING_UPDATE','Cập nhật cài đặt','Chỉnh sửa cài đặt hệ thống','SYSTEM','2026-01-09 08:23:18'),(49,'COURSE_VIEW','Xem khóa học','Xem danh sách khóa học','COURSE','2026-01-09 08:23:18'),(50,'COURSE_CREATE','Tạo khóa học','Tạo khóa học mới','COURSE','2026-01-09 08:23:18'),(51,'COURSE_UPDATE','Cập nhật khóa học','Chỉnh sửa khóa học','COURSE','2026-01-09 08:23:18'),(52,'COURSE_DELETE','Xóa khóa học','Xóa khóa học','COURSE','2026-01-09 08:23:18');
/_!40000 ALTER TABLE `permissions` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `question` (
`question_id` bigint NOT NULL AUTO_INCREMENT,
`created_by` varchar(255) DEFAULT NULL,
`created_date` datetime(6) DEFAULT NULL,
`modified_by` varchar(255) DEFAULT NULL,
`modified_date` datetime(6) DEFAULT NULL,
`content` varchar(2000) DEFAULT NULL,
`explanation` varchar(2000) DEFAULT NULL,
`image_location` varchar(255) DEFAULT NULL,
`video_location` varchar(255) DEFAULT NULL,
`file_type` enum('EXISTED','NOT_EXISTED','TEXT') DEFAULT NULL,
`question_type` enum('MULTIPLE_ANSWERS','ONE_ANSWER') DEFAULT NULL,
`class_room_id` bigint DEFAULT NULL,
PRIMARY KEY (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/_!40000 ALTER TABLE `question` DISABLE KEYS _/;
/_!40000 ALTER TABLE `question` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `question_exam_mapping`
--

DROP TABLE IF EXISTS `question_exam_mapping`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `question_exam_mapping` (
`question_exam_id` bigint NOT NULL AUTO_INCREMENT,
`exam_id` bigint NOT NULL,
`question_id` bigint NOT NULL,
PRIMARY KEY (`question_exam_id`)
) ENGINE=InnoDB AUTO_INCREMENT=248 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `question_exam_mapping`
--

LOCK TABLES `question_exam_mapping` WRITE;
/_!40000 ALTER TABLE `question_exam_mapping` DISABLE KEYS _/;
/_!40000 ALTER TABLE `question_exam_mapping` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `question_exam_user_mapping`
--

DROP TABLE IF EXISTS `question_exam_user_mapping`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `question_exam_user_mapping` (
`question_exam_user_id` bigint NOT NULL AUTO_INCREMENT,
`exam_id` bigint NOT NULL,
`question_id` bigint NOT NULL,
`selected_answers` varbinary(255) DEFAULT NULL,
`minio_path` varchar(500) DEFAULT NULL COMMENT 'Đường dẫn file trong MinIO',
`ai_answer` varchar(255) DEFAULT NULL,
`ai_result` bit(1) DEFAULT NULL,
`is_correct` bit(1) DEFAULT NULL,
`score` float DEFAULT NULL,
`user_id` bigint NOT NULL,
`attempt_id` bigint DEFAULT NULL,
PRIMARY KEY (`question_exam_user_id`),
KEY `fk_attempt` (`attempt_id`),
CONSTRAINT `fk_attempt` FOREIGN KEY (`attempt_id`) REFERENCES `exam_attempt` (`attempt_id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `question_exam_user_mapping`
--

LOCK TABLES `question_exam_user_mapping` WRITE;
/_!40000 ALTER TABLE `question_exam_user_mapping` DISABLE KEYS _/;
/_!40000 ALTER TABLE `question_exam_user_mapping` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `role` (
`code` varchar(255) NOT NULL,
`description` varchar(255) DEFAULT NULL,
`name` varchar(255) DEFAULT NULL,
PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/_!40000 ALTER TABLE `role` DISABLE KEYS _/;
INSERT INTO `role` VALUES ('CENTER_ADMIN',NULL,NULL),('SCHOOL_ADMIN',NULL,'School Administrator'),('STUDENT',NULL,NULL),('SUPER_ADMIN',NULL,'Super Administrator'),('TEACHER',NULL,NULL),('USER',NULL,NULL);
/_!40000 ALTER TABLE `role` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `role_permissions` (
`id` bigint NOT NULL AUTO_INCREMENT,
`role_code` varchar(255) NOT NULL,
`permission_code` varchar(255) NOT NULL,
`created_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (`id`),
UNIQUE KEY `uk_role_permission` (`role_code`,`permission_code`),
KEY `idx_role` (`role_code`),
KEY `idx_permission` (`permission_code`),
CONSTRAINT `fk_role_permission_role` FOREIGN KEY (`role_code`) REFERENCES `role` (`code`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=910 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/_!40000 ALTER TABLE `role_permissions` DISABLE KEYS _/;
INSERT INTO `role_permissions` VALUES (53,'CENTER_ADMIN','HOME_VIEW','2026-01-09 08:23:56'),(54,'CENTER_ADMIN','DASHBOARD_VIEW','2026-01-09 08:23:56'),(55,'CENTER_ADMIN','USER_VIEW','2026-01-09 08:23:56'),(56,'CENTER_ADMIN','USER_CREATE','2026-01-09 08:23:56'),(57,'CENTER_ADMIN','USER_UPDATE','2026-01-09 08:23:56'),(58,'CENTER_ADMIN','ORGANIZATION_VIEW','2026-01-09 08:23:56'),(59,'CENTER_ADMIN','LEARNING_VIEW','2026-01-09 08:23:56'),(60,'CENTER_ADMIN','LEARNING_CREATE','2026-01-09 08:23:56'),(61,'CENTER_ADMIN','LEARNING_UPDATE','2026-01-09 08:23:56'),(62,'CENTER_ADMIN','LEARNING_DELETE','2026-01-09 08:23:56'),(63,'CENTER_ADMIN','CLASS_VIEW','2026-01-09 08:23:56'),(64,'CENTER_ADMIN','CLASS_CREATE','2026-01-09 08:23:56'),(65,'CENTER_ADMIN','CLASS_UPDATE','2026-01-09 08:23:56'),(66,'CENTER_ADMIN','CLASS_DELETE','2026-01-09 08:23:56'),(67,'CENTER_ADMIN','NOTIFICATION_VIEW','2026-01-09 08:23:56'),(68,'CENTER_ADMIN','NOTIFICATION_CREATE','2026-01-09 08:23:56'),(69,'CENTER_ADMIN','NOTIFICATION_UPDATE','2026-01-09 08:23:56'),(70,'CENTER_ADMIN','NOTIFICATION_DELETE','2026-01-09 08:23:56'),(71,'CENTER_ADMIN','TOOL_VIEW','2026-01-09 08:23:56'),(72,'CENTER_ADMIN','TOOL_CREATE','2026-01-09 08:23:56'),(73,'CENTER_ADMIN','TOOL_UPDATE','2026-01-09 08:23:56'),(74,'CENTER_ADMIN','TOOL_DELETE','2026-01-09 08:23:56'),(75,'CENTER_ADMIN','EXAM_VIEW','2026-01-09 08:23:56'),(76,'CENTER_ADMIN','EXAM_CREATE','2026-01-09 08:23:56'),(77,'CENTER_ADMIN','EXAM_UPDATE','2026-01-09 08:23:56'),(78,'CENTER_ADMIN','EXAM_DELETE','2026-01-09 08:23:56'),(79,'CENTER_ADMIN','EXAM_GRADE','2026-01-09 08:23:56'),(80,'CENTER_ADMIN','STATISTICS_VIEW','2026-01-09 08:23:56'),(81,'CENTER_ADMIN','STATISTICS_EXPORT','2026-01-09 08:23:56'),(82,'CENTER_ADMIN','DICTIONARY_VIEW','2026-01-09 08:23:56'),(83,'CENTER_ADMIN','GAME_VIEW','2026-01-09 08:23:56'),(84,'CENTER_ADMIN','GAME_CREATE','2026-01-09 08:23:56'),(85,'CENTER_ADMIN','GAME_UPDATE','2026-01-09 08:23:56'),(86,'CENTER_ADMIN','GAME_DELETE','2026-01-09 08:23:56'),(87,'CENTER_ADMIN','COURSE_VIEW','2026-01-09 08:23:56'),(88,'CENTER_ADMIN','COURSE_CREATE','2026-01-09 08:23:56'),(89,'CENTER_ADMIN','COURSE_UPDATE','2026-01-09 08:23:56'),(127,'TEACHER','HOME_VIEW','2026-01-09 08:23:56'),(128,'TEACHER','DASHBOARD_VIEW','2026-01-09 08:23:56'),(129,'TEACHER','NOTIFICATION_VIEW','2026-01-09 08:23:56'),(130,'TEACHER','CLASS_VIEW','2026-01-09 08:23:56'),(131,'TEACHER','CLASS_UPDATE','2026-01-09 08:23:56'),(132,'TEACHER','LEARNING_VIEW','2026-01-09 08:23:56'),(133,'TEACHER','LEARNING_CREATE','2026-01-09 08:23:56'),(134,'TEACHER','LEARNING_UPDATE','2026-01-09 08:23:56'),(135,'TEACHER','STATISTICS_VIEW','2026-01-09 08:23:56'),(136,'TEACHER','EXAM_VIEW','2026-01-09 08:23:56'),(137,'TEACHER','EXAM_CREATE','2026-01-09 08:23:56'),(138,'TEACHER','EXAM_UPDATE','2026-01-09 08:23:56'),(139,'TEACHER','EXAM_GRADE','2026-01-09 08:23:56'),(140,'TEACHER','DICTIONARY_VIEW','2026-01-09 08:23:56'),(141,'TEACHER','GAME_VIEW','2026-01-09 08:23:56'),(142,'TEACHER','COURSE_VIEW','2026-01-09 08:23:56'),(143,'TEACHER','COURSE_UPDATE','2026-01-09 08:23:56'),(144,'STUDENT','HOME_VIEW','2026-01-09 08:23:56'),(145,'STUDENT','DASHBOARD_VIEW','2026-01-09 08:23:56'),(146,'STUDENT','NOTIFICATION_VIEW','2026-01-09 08:23:56'),(147,'STUDENT','LEARNING_VIEW','2026-01-09 08:23:56'),(148,'STUDENT','LEARNING_STUDY','2026-01-09 08:23:56'),(149,'STUDENT','STATISTICS_VIEW','2026-01-09 08:23:56'),(150,'STUDENT','EXAM_VIEW','2026-01-09 08:23:56'),(151,'STUDENT','EXAM_TAKE','2026-01-09 08:23:56'),(152,'STUDENT','CLASS_VIEW','2026-01-09 08:23:56'),(153,'STUDENT','CLASS_REGISTER','2026-01-09 08:23:56'),(154,'STUDENT','DICTIONARY_VIEW','2026-01-09 08:23:56'),(155,'STUDENT','GAME_VIEW','2026-01-09 08:23:56'),(156,'STUDENT','COURSE_VIEW','2026-01-09 08:23:56'),(157,'USER','HOME_VIEW','2026-01-09 08:23:56'),(158,'USER','DASHBOARD_VIEW','2026-01-09 08:23:56'),(159,'USER','COURSE_VIEW','2026-01-09 08:23:56'),(160,'SUPER_ADMIN','HOME_VIEW','2026-01-09 08:27:37'),(161,'SUPER_ADMIN','DASHBOARD_VIEW','2026-01-09 08:27:37'),(162,'SUPER_ADMIN','USER_VIEW','2026-01-09 08:27:37'),(163,'SUPER_ADMIN','USER_CREATE','2026-01-09 08:27:37'),(164,'SUPER_ADMIN','USER_UPDATE','2026-01-09 08:27:37'),(165,'SUPER_ADMIN','USER_DELETE','2026-01-09 08:27:37'),(166,'SUPER_ADMIN','USER_ASSIGN_ROLE','2026-01-09 08:27:37'),(167,'SUPER_ADMIN','ORGANIZATION_VIEW','2026-01-09 08:27:37'),(168,'SUPER_ADMIN','ORGANIZATION_CREATE','2026-01-09 08:27:37'),(169,'SUPER_ADMIN','ORGANIZATION_UPDATE','2026-01-09 08:27:37'),(170,'SUPER_ADMIN','ORGANIZATION_DELETE','2026-01-09 08:27:37'),(171,'SUPER_ADMIN','LEARNING_VIEW','2026-01-09 08:27:37'),(172,'SUPER_ADMIN','LEARNING_CREATE','2026-01-09 08:27:37'),(173,'SUPER_ADMIN','LEARNING_UPDATE','2026-01-09 08:27:37'),(174,'SUPER_ADMIN','LEARNING_DELETE','2026-01-09 08:27:37'),(175,'SUPER_ADMIN','LEARNING_STUDY','2026-01-09 08:27:37'),(176,'SUPER_ADMIN','CLASS_VIEW','2026-01-09 08:27:37'),(177,'SUPER_ADMIN','CLASS_CREATE','2026-01-09 08:27:37'),(178,'SUPER_ADMIN','CLASS_UPDATE','2026-01-09 08:27:37'),(179,'SUPER_ADMIN','CLASS_DELETE','2026-01-09 08:27:37'),(180,'SUPER_ADMIN','CLASS_REGISTER','2026-01-09 08:27:37'),(181,'SUPER_ADMIN','NOTIFICATION_VIEW','2026-01-09 08:27:37'),(182,'SUPER_ADMIN','NOTIFICATION_CREATE','2026-01-09 08:27:37'),(183,'SUPER_ADMIN','NOTIFICATION_UPDATE','2026-01-09 08:27:37'),(184,'SUPER_ADMIN','NOTIFICATION_DELETE','2026-01-09 08:27:37'),(185,'SUPER_ADMIN','TOOL_VIEW','2026-01-09 08:27:37'),(186,'SUPER_ADMIN','TOOL_CREATE','2026-01-09 08:27:37'),(187,'SUPER_ADMIN','TOOL_UPDATE','2026-01-09 08:27:37'),(188,'SUPER_ADMIN','TOOL_DELETE','2026-01-09 08:27:37'),(189,'SUPER_ADMIN','EXAM_VIEW','2026-01-09 08:27:37'),(190,'SUPER_ADMIN','EXAM_CREATE','2026-01-09 08:27:37'),(191,'SUPER_ADMIN','EXAM_UPDATE','2026-01-09 08:27:37'),(192,'SUPER_ADMIN','EXAM_DELETE','2026-01-09 08:27:37'),(193,'SUPER_ADMIN','EXAM_TAKE','2026-01-09 08:27:37'),(194,'SUPER_ADMIN','EXAM_GRADE','2026-01-09 08:27:37'),(195,'SUPER_ADMIN','STATISTICS_VIEW','2026-01-09 08:27:37'),(196,'SUPER_ADMIN','STATISTICS_EXPORT','2026-01-09 08:27:37'),(197,'SUPER_ADMIN','DICTIONARY_VIEW','2026-01-09 08:27:37'),(198,'SUPER_ADMIN','DICTIONARY_CREATE','2026-01-09 08:27:37'),(199,'SUPER_ADMIN','DICTIONARY_UPDATE','2026-01-09 08:27:37'),(200,'SUPER_ADMIN','DICTIONARY_DELETE','2026-01-09 08:27:37'),(201,'SUPER_ADMIN','GAME_VIEW','2026-01-09 08:27:37'),(202,'SUPER_ADMIN','GAME_CREATE','2026-01-09 08:27:37'),(203,'SUPER_ADMIN','GAME_UPDATE','2026-01-09 08:27:37'),(204,'SUPER_ADMIN','GAME_DELETE','2026-01-09 08:27:37'),(205,'SUPER_ADMIN','SYSTEM_ADMIN','2026-01-09 08:27:37'),(206,'SUPER_ADMIN','SETTING_VIEW','2026-01-09 08:27:37'),(207,'SUPER_ADMIN','SETTING_UPDATE','2026-01-09 08:27:37'),(208,'SUPER_ADMIN','COURSE_VIEW','2026-01-09 08:27:37'),(209,'SUPER_ADMIN','COURSE_CREATE','2026-01-09 08:27:37'),(210,'SUPER_ADMIN','COURSE_UPDATE','2026-01-09 08:27:37'),(211,'SUPER_ADMIN','COURSE_DELETE','2026-01-09 08:27:37'),(249,'SCHOOL_ADMIN','HOME_VIEW','2026-01-09 08:27:37'),(250,'SCHOOL_ADMIN','DASHBOARD_VIEW','2026-01-09 08:27:37'),(251,'SCHOOL_ADMIN','USER_VIEW','2026-01-09 08:27:37'),(252,'SCHOOL_ADMIN','USER_CREATE','2026-01-09 08:27:37'),(253,'SCHOOL_ADMIN','USER_UPDATE','2026-01-09 08:27:37'),(254,'SCHOOL_ADMIN','ORGANIZATION_VIEW','2026-01-09 08:27:37'),(255,'SCHOOL_ADMIN','LEARNING_VIEW','2026-01-09 08:27:37'),(256,'SCHOOL_ADMIN','LEARNING_CREATE','2026-01-09 08:27:37'),(257,'SCHOOL_ADMIN','LEARNING_UPDATE','2026-01-09 08:27:37'),(258,'SCHOOL_ADMIN','LEARNING_DELETE','2026-01-09 08:27:37'),(259,'SCHOOL_ADMIN','CLASS_VIEW','2026-01-09 08:27:37'),(260,'SCHOOL_ADMIN','CLASS_CREATE','2026-01-09 08:27:37'),(261,'SCHOOL_ADMIN','CLASS_UPDATE','2026-01-09 08:27:37'),(262,'SCHOOL_ADMIN','CLASS_DELETE','2026-01-09 08:27:37'),(263,'SCHOOL_ADMIN','NOTIFICATION_VIEW','2026-01-09 08:27:37'),(264,'SCHOOL_ADMIN','NOTIFICATION_CREATE','2026-01-09 08:27:37'),(265,'SCHOOL_ADMIN','NOTIFICATION_UPDATE','2026-01-09 08:27:37'),(266,'SCHOOL_ADMIN','NOTIFICATION_DELETE','2026-01-09 08:27:37'),(267,'SCHOOL_ADMIN','TOOL_VIEW','2026-01-09 08:27:37'),(268,'SCHOOL_ADMIN','TOOL_CREATE','2026-01-09 08:27:37'),(269,'SCHOOL_ADMIN','TOOL_UPDATE','2026-01-09 08:27:37'),(270,'SCHOOL_ADMIN','TOOL_DELETE','2026-01-09 08:27:37'),(271,'SCHOOL_ADMIN','EXAM_VIEW','2026-01-09 08:27:37'),(272,'SCHOOL_ADMIN','EXAM_CREATE','2026-01-09 08:27:37'),(273,'SCHOOL_ADMIN','EXAM_UPDATE','2026-01-09 08:27:37'),(274,'SCHOOL_ADMIN','EXAM_DELETE','2026-01-09 08:27:37'),(275,'SCHOOL_ADMIN','EXAM_GRADE','2026-01-09 08:27:37'),(276,'SCHOOL_ADMIN','STATISTICS_VIEW','2026-01-09 08:27:37'),(277,'SCHOOL_ADMIN','STATISTICS_EXPORT','2026-01-09 08:27:37'),(278,'SCHOOL_ADMIN','DICTIONARY_VIEW','2026-01-09 08:27:37'),(279,'SCHOOL_ADMIN','GAME_VIEW','2026-01-09 08:27:37'),(280,'SCHOOL_ADMIN','GAME_CREATE','2026-01-09 08:27:37'),(281,'SCHOOL_ADMIN','GAME_UPDATE','2026-01-09 08:27:37'),(282,'SCHOOL_ADMIN','GAME_DELETE','2026-01-09 08:27:37'),(283,'SCHOOL_ADMIN','COURSE_VIEW','2026-01-09 08:27:37'),(284,'SCHOOL_ADMIN','COURSE_CREATE','2026-01-09 08:27:37'),(285,'SCHOOL_ADMIN','COURSE_UPDATE','2026-01-09 08:27:37');
/_!40000 ALTER TABLE `role_permissions` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `school`
--

DROP TABLE IF EXISTS `school`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `school` (
`school_id` bigint NOT NULL AUTO_INCREMENT,
`name` varchar(255) NOT NULL,
`image_location` varchar(255) DEFAULT NULL,
`created_date` timestamp NULL DEFAULT NULL,
`modified_date` timestamp NULL DEFAULT NULL,
PRIMARY KEY (`school_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `school`
--

LOCK TABLES `school` WRITE;
/_!40000 ALTER TABLE `school` DISABLE KEYS _/;
/_!40000 ALTER TABLE `school` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `sequence_table`
--

DROP TABLE IF EXISTS `sequence_table`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `sequence_table` (
`SEQUENCE_NAME` varchar(255) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
`NEXT_VAL` bigint NOT NULL,
PRIMARY KEY (`SEQUENCE_NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `sequence_table`
--

LOCK TABLES `sequence_table` WRITE;
/_!40000 ALTER TABLE `sequence_table` DISABLE KEYS _/;
/_!40000 ALTER TABLE `sequence_table` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `student_profile`
--

DROP TABLE IF EXISTS `student_profile`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `student_profile` (
`student_profile_id` bigint NOT NULL AUTO_INCREMENT,
`student_code` varchar(255) NOT NULL,
`user_id` bigint NOT NULL,
`created_date` datetime DEFAULT CURRENT_TIMESTAMP,
`modified_date` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`student_profile_id`),
KEY `fk_student_profile_user` (`user_id`),
CONSTRAINT `fk_student_profile_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `student_profile`
--

LOCK TABLES `student_profile` WRITE;
/_!40000 ALTER TABLE `student_profile` DISABLE KEYS _/;
/_!40000 ALTER TABLE `student_profile` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `token`
--

DROP TABLE IF EXISTS `token`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `token` (
`id` int NOT NULL,
`expired` bit(1) NOT NULL,
`revoked` bit(1) NOT NULL,
`token` varchar(255) DEFAULT NULL,
`token_type` enum('BEARER') DEFAULT NULL,
`user_id` int DEFAULT NULL,
PRIMARY KEY (`id`),
UNIQUE KEY `UK_pddrhgwxnms2aceeku9s2ewy5` (`token`),
KEY `FKiblu4cjwvyntq3ugo31klp1c6` (`user_id`),
CONSTRAINT `FKiblu4cjwvyntq3ugo31klp1c6` FOREIGN KEY (`user_id`) REFERENCES `_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `token`
--

LOCK TABLES `token` WRITE;
/_!40000 ALTER TABLE `token` DISABLE KEYS _/;
/_!40000 ALTER TABLE `token` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `token_seq`
--

DROP TABLE IF EXISTS `token_seq`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `token_seq` (
`next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `token_seq`
--

LOCK TABLES `token_seq` WRITE;
/_!40000 ALTER TABLE `token_seq` DISABLE KEYS _/;
/_!40000 ALTER TABLE `token_seq` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `tool`
--

DROP TABLE IF EXISTS `tool`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `tool` (
`tool_id` bigint NOT NULL AUTO_INCREMENT,
`name` varchar(255) NOT NULL,
`code` varchar(100) NOT NULL,
`description` text,
`status` enum('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
`created_by` varchar(255) DEFAULT NULL,
`created_date` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
`modified_by` varchar(255) DEFAULT NULL,
`modified_date` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
PRIMARY KEY (`tool_id`),
UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `tool`
--

LOCK TABLES `tool` WRITE;
/_!40000 ALTER TABLE `tool` DISABLE KEYS _/;
/_!40000 ALTER TABLE `tool` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `tool_chatbox_ai`
--

DROP TABLE IF EXISTS `tool_chatbox_ai`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `tool_chatbox_ai` (
`chatbox_id` bigint NOT NULL AUTO_INCREMENT,
`tool_id` bigint NOT NULL,
`model_name` varchar(255) NOT NULL,
`description` text,
`status` enum('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
PRIMARY KEY (`chatbox_id`),
KEY `fk_tool_chatbox_tool` (`tool_id`),
CONSTRAINT `fk_tool_chatbox_tool` FOREIGN KEY (`tool_id`) REFERENCES `tool` (`tool_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `tool_chatbox_ai`
--

LOCK TABLES `tool_chatbox_ai` WRITE;
/_!40000 ALTER TABLE `tool_chatbox_ai` DISABLE KEYS _/;
/_!40000 ALTER TABLE `tool_chatbox_ai` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `tool_game`
--

DROP TABLE IF EXISTS `tool_game`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `tool_game` (
`game_id` bigint NOT NULL AUTO_INCREMENT,
`tool_id` bigint NOT NULL,
`name` varchar(255) NOT NULL,
`description` text,
`thumbnail` varchar(500) DEFAULT NULL,
`game_url` varchar(500) DEFAULT NULL,
`status` enum('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
PRIMARY KEY (`game_id`),
KEY `fk_tool_game_tool` (`tool_id`),
CONSTRAINT `fk_tool_game_tool` FOREIGN KEY (`tool_id`) REFERENCES `tool` (`tool_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `tool_game`
--

LOCK TABLES `tool_game` WRITE;
/_!40000 ALTER TABLE `tool_game` DISABLE KEYS _/;
/_!40000 ALTER TABLE `tool_game` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `tool_notification`
--

DROP TABLE IF EXISTS `tool_notification`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `tool_notification` (
`notification_id` bigint NOT NULL AUTO_INCREMENT,
`tool_id` bigint NOT NULL,
`title` varchar(255) NOT NULL,
`message` text NOT NULL,
`sender_id` bigint DEFAULT NULL,
`target_type` enum('USER','CLASS','ORGANIZATION','ALL') DEFAULT 'USER',
`target_id` bigint DEFAULT NULL,
`status` enum('UNREAD','READ','SENT') DEFAULT 'SENT',
`created_date` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
PRIMARY KEY (`notification_id`),
KEY `fk_tool_notification_tool` (`tool_id`),
CONSTRAINT `fk_tool_notification_tool` FOREIGN KEY (`tool_id`) REFERENCES `tool` (`tool_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `tool_notification`
--

LOCK TABLES `tool_notification` WRITE;
/_!40000 ALTER TABLE `tool_notification` DISABLE KEYS _/;
/_!40000 ALTER TABLE `tool_notification` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `topic`
--

DROP TABLE IF EXISTS `topic`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `topic` (
`topic_id` bigint NOT NULL AUTO_INCREMENT,
`created_by` varchar(255) DEFAULT NULL,
`created_id` bigint DEFAULT NULL,
`created_date` datetime(6) DEFAULT NULL,
`modified_by` varchar(255) DEFAULT NULL,
`modified_date` datetime(6) DEFAULT NULL,
`content` varchar(255) DEFAULT NULL,
`description` varchar(255) DEFAULT NULL,
`image_location` varchar(255) DEFAULT NULL,
`video_location` varchar(255) DEFAULT NULL,
`is_private` bit(1) NOT NULL,
`class_room_id` bigint DEFAULT NULL,
PRIMARY KEY (`topic_id`),
KEY `FKt6gi0syesp2u7dh9ahh5qckoe` (`class_room_id`),
KEY `idx_topic_is_private` (`is_private`),
KEY `fk_topic_creator_id` (`created_id`),
CONSTRAINT `fk_topic_classroom` FOREIGN KEY (`class_room_id`) REFERENCES `class_room` (`class_room_id`) ON DELETE CASCADE,
CONSTRAINT `fk_topic_creator_id` FOREIGN KEY (`created_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
CONSTRAINT `FKt6gi0syesp2u7dh9ahh5qckoe` FOREIGN KEY (`class_room_id`) REFERENCES `class_room` (`class_room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `topic`
--

LOCK TABLES `topic` WRITE;
/_!40000 ALTER TABLE `topic` DISABLE KEYS _/;
/_!40000 ALTER TABLE `topic` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `user` (
`user_id` bigint NOT NULL AUTO_INCREMENT,
`created_by` varchar(255) DEFAULT NULL,
`created_date` datetime(6) DEFAULT NULL,
`modified_by` varchar(255) DEFAULT NULL,
`modified_date` datetime(6) DEFAULT NULL,
`address` varchar(255) DEFAULT NULL,
`avatar_location` varchar(255) DEFAULT NULL,
`birth_day` datetime(6) DEFAULT NULL,
`email` varchar(255) DEFAULT NULL,
`gender` enum('FEMALE','MALE') DEFAULT NULL,
`is_oauth2` bit(1) DEFAULT b'0',
`approval_status` enum('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING' COMMENT 'Trạng thái phê duyệt: PENDING=Chờ duyệt, APPROVED=Đã duyệt, REJECTED=Từ chối',
`approved_by` varchar(255) DEFAULT NULL COMMENT 'Email của người phê duyệt/từ chối tài khoản',
`approved_date` datetime DEFAULT NULL COMMENT 'Ngày phê duyệt/từ chối tài khoản',
`rejection_reason` text COMMENT 'Lý do từ chối tài khoản (chỉ khi REJECTED)',
`name` varchar(255) DEFAULT NULL,
`password` varchar(255) DEFAULT NULL,
`phone_number` varchar(255) DEFAULT NULL,
`code` varchar(255) DEFAULT NULL,
`is_deleted` bit(1) NOT NULL,
`username` varchar(255) DEFAULT NULL,
`slug` varchar(255) DEFAULT NULL,
`house_street` varchar(255) DEFAULT NULL,
`ward` varchar(255) DEFAULT NULL,
`city` varchar(255) DEFAULT NULL,
`is_super_admin` tinyint(1) DEFAULT '0',
`school_id` bigint DEFAULT NULL,
PRIMARY KEY (`user_id`),
UNIQUE KEY `UK_ob8kqyqqgmefl0aco34akdtpe` (`email`),
UNIQUE KEY `username` (`username`),
KEY `FKn3vfurnv0p6bkguxp0os8t1t7` (`code`),
KEY `fk_user_school_id` (`school_id`),
KEY `idx_approval_status` (`approval_status`),
CONSTRAINT `fk_user_role` FOREIGN KEY (`code`) REFERENCES `role` (`code`) ON DELETE SET NULL,
CONSTRAINT `fk_user_school_id` FOREIGN KEY (`school_id`) REFERENCES `school` (`school_id`),
CONSTRAINT `FKn3vfurnv0p6bkguxp0os8t1t7` FOREIGN KEY (`code`) REFERENCES `role` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=309 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/_!40000 ALTER TABLE `user` DISABLE KEYS _/;
INSERT INTO `user` VALUES (1,'admin@gmail.com','2024-04-08 10:04:56.677000','anonymousUser','2024-12-21 20:20:19.789000','ĐHBK Hà Nội','https://wesign.ibme.edu.vn/upload/hust-app//image_picker_0B7158E3-93CE-4BB7-A7E2-393D8A15B5E4-22035-000043E0AE196869.jpg',NULL,'admin@gmail.com',NULL,_binary '\0','PENDING',NULL,NULL,NULL,'admin','iBMElab2024','0912834422','ADMIN',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(2,'anonymousUser','2024-04-08 10:16:07.382000','admin@gmail.com','2024-06-17 08:38:44.194000',NULL,NULL,NULL,'quynh12712053@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Phạm Văn Quỳnh 127','hust',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(3,'anonymousUser','2024-04-08 10:17:30.930000','admin@gmail.com','2024-07-30 07:47:17.228000',NULL,NULL,NULL,'quynh171217@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Pham Van Quynh 17','hust',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(4,'anonymousUser','2024-04-08 12:21:15.974000','truong8dt@gmail.com','2024-06-14 14:05:58.384000','Bắc Ninh','https://wesign.ibme.edu.vn/upload/hust-app//image.png','2001-01-10 00:00:00.000000','truong8dt@gmail.com','MALE',\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Văn Trường','12345aA@','0978803231','TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(5,'anonymousUser','2024-04-08 12:22:35.147000','truongnguyenduc935@gmail.com','2024-05-22 14:40:47.434000',NULL,'https://wesign.ibme.edu.vn/upload/hust-app//Banner%20Khuye%CC%82%CC%81n%20Ma%CC%83i%20Te%CC%82%CC%81t.png','2001-01-17 00:00:00.000000','truongnguyenduc935@gmail.com','MALE',\_binary '\0','PENDING',NULL,NULL,NULL,'Minh Nguyễn','123456aA@',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(6,'anonymousUser','2024-04-08 14:25:46.558000','doanhtv2759@gmail.com','2024-07-17 01:13:27.823000','NamDinh','https://wesign.ibme.edu.vn/upload/media-general//Vui%20m%E1%BB%ABng0%20.jpg','2024-04-08 00:00:00.000000','doanhtv2759@gmail.com','MALE',\_binary '\0','PENDING',NULL,NULL,NULL,'Doanh','s','0372232323','USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(7,'anonymousUser','2024-04-08 15:55:43.514000','anonymousUser','2024-04-08 15:55:43.514000',NULL,NULL,NULL,'huy@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Hoàng Huy','123456',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(8,'anonymousUser','2024-04-11 04:48:45.079000','vdoanh301@gmail.com','2024-04-16 15:08:04.686000','Hanoi','https://wesign.ibme.edu.vn/upload/media-general//9d9e23b9802028befafb052f7c2af883.jpg','2024-04-11 00:00:00.000000','vdoanh301@gmail.com','MALE',\_binary '\0','PENDING',NULL,NULL,NULL,'DoanhPro','s','032323232','USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(10,'anonymousUser','2024-04-13 02:14:22.016000','chuyenp32@gmail.com','2024-12-30 06:42:33.457000','nhà Ha noi','https://wesign.ibme.edu.vn/upload/hust-app//1000274402.jpg','2024-11-22 00:00:00.000000','chuyenp32@gmail.com','MALE',\_binary '\0','PENDING',NULL,NULL,NULL,'chuyen 10 nguoi yeu','123123','chuyen 10 nguoi yeu','TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(11,'anonymousUser','2024-04-13 02:30:55.342000','anonymousUser','2024-04-13 02:30:55.342000',NULL,NULL,NULL,'phamdoan060801@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'chuyendz','123456789',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(12,'anonymousUser','2024-04-15 11:31:34.039000','hqhuy.bme@gmail.com','2024-04-17 05:05:49.140000','Hà Nội 6',NULL,'2024-04-17 00:00:00.000000','hqhuy.bme@gmail.com','MALE',\_binary '\0','PENDING',NULL,NULL,NULL,'Hoàng Huy BME','123456','0912834422','USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(13,'anonymousUser','2024-05-04 04:27:33.953000','vunhatlinh04092001@gmail.com','2024-05-04 04:30:20.023000','Hà Nội','https://wesign.ibme.edu.vn/upload/media-general//1000000339.jpg','2001-04-09 00:00:00.000000','vunhatlinh04092001@gmail.com','MALE',\_binary '\0','PENDING',NULL,NULL,NULL,'Linh K','123456','0375020889','USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(16,'anonymousUser','2024-05-16 14:58:09.077000','anonymousUser','2024-05-16 14:58:09.077000',NULL,NULL,NULL,'testwesign2@yopmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Văn An','12345aA@',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(20,'anonymousUser','2024-05-18 09:01:31.174000','anonymousUser','2024-05-18 09:01:31.174000',NULL,NULL,NULL,'testwesignew@yopmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'nguyễn Văn A','123456aA@',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(21,'anonymousUser','2024-05-23 06:23:10.709000','anonymousUser','2024-05-23 06:23:10.709000',NULL,NULL,NULL,'vutuananh25082000@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Vũ Tuấn Anh','Nganlanyeuem123',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(22,'anonymousUser','2024-05-25 02:22:16.739000','anonymousUser','2024-05-25 02:22:16.739000',NULL,NULL,NULL,'minhnguyen123@yopmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Văn Minh','123456aA@',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(23,'anonymousUser','2024-06-01 03:02:26.349000','anonymousUser','2024-06-01 03:02:26.349000',NULL,NULL,NULL,'2004hoangcuc@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Hoàng Cúc','hoangcuc2807',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(24,'anonymousUser','2024-06-06 01:38:01.048000','anonymousUser','2024-06-06 01:38:01.048000',NULL,NULL,NULL,'angelmirinda1@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyen M','6789',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(25,'anonymousUser','2024-06-14 16:16:02.500000','anonymousUser','2024-06-14 16:16:02.500000',NULL,NULL,NULL,'annguyen123@yopmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Văn An','123456aA@',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(26,'anonymousUser','2024-06-14 16:42:02.415000','anonymousUser','2024-06-14 16:42:02.415000',NULL,NULL,NULL,'bennguyen1@yopmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'nguyễn Văn Ben','123456aA@',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(27,'anonymousUser','2024-06-14 16:42:02.415000','hocsinh@gmail.com','2025-12-30 11:19:32.000000',NULL,NULL,NULL,'hocsinh@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Học Sinh','123456','0023123124','USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(28,'anonymousUser','2024-06-14 16:42:02.415000','giaovien@gmail.com','2025-09-16 14:34:06.000000','Giáp Bát, quận Hoàng Mai, Hà Nội','https://wesign.ibme.edu.vn/upload/hust-app//%E1%BA%A3nh%20s.jpg','1975-09-20 00:00:00.000000','giaovien@gmail.com','MALE',\_binary '\0','PENDING',NULL,NULL,NULL,'Đỗ Thanh Sơn','123456','0936377621','TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(29,'anonymousUser','2024-06-19 07:56:05.442000','admin@gmail.com','2024-06-19 07:57:02.996000',NULL,NULL,NULL,'phamquynhltbn12@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Phạm Văn Quỳnh','Hust@2024$',NULL,'TEACHER',_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(30,'anonymousUser','2024-06-23 13:17:40.641000','anonymousUser','2024-06-23 13:17:40.641000',NULL,NULL,NULL,'tbi398360@gmail.com',NULL,_binary '\0','PENDING',NULL,NULL,NULL,'vippro','s',NULL,'USER',_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(31,'anonymousUser','2024-07-04 03:27:20.992000','anonymousUser','2024-07-04 03:27:20.992000',NULL,NULL,NULL,'caominhducpx@gmail.com',NULL,_binary '\0','PENDING',NULL,NULL,NULL,'Cao Minh Đức','Caoduc01@',NULL,'ADMIN',_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(32,'anonymousUser','2024-07-04 03:28:02.491000','anonymousUser','2024-07-04 03:28:02.491000',NULL,NULL,NULL,'alexnguyenabc113@gmail.com',NULL,_binary '\0','PENDING',NULL,NULL,NULL,'Alex Nguyen','ZfeNLnWU5KmvxTZ@',NULL,'USER',_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(33,'anonymousUser','2024-07-06 03:24:16.597000','bennguyen2@yopmail.com','2024-07-07 14:20:21.368000','Bắc Ninh','https://wesign.ibme.edu.vn/upload/hust-app//download.jpg','2001-01-10 00:00:00.000000','bennguyen2@yopmail.com','MALE',_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Văn Minh','123456aA@','0982733343','TEACHER',_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(34,'anonymousUser','2024-07-06 03:25:55.593000','vdo646185@gmail.com','2024-07-06 03:27:51.021000','Ha lội','https://wesign.ibme.edu.vn/upload/media-general//Screenshot_20240705-234010.jpg','2024-07-06 00:00:00.000000','vdo646185@gmail.com','FEMALE',_binary '\0','PENDING',NULL,NULL,NULL,'quynh','s','0282828282','USER',_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(35,'anonymousUser','2024-07-10 04:21:13.163000','anonymousUser','2024-07-10 04:21:13.163000',NULL,NULL,NULL,'fossbk@gmail.com',NULL,_binary '\0','PENDING',NULL,NULL,NULL,'Tình nguyện viên','123456qQ@',NULL,'USER',_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(36,'anonymousUser','2024-08-28 08:15:08.224000','anonymousUser','2024-08-28 08:15:08.224000',NULL,NULL,NULL,'voviethoang952002@gmail.com',NULL,_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Văn A','Home123@',NULL,'USER',_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(37,'anonymousUser','2024-09-13 07:33:27.719000','anonymousUser','2024-09-13 07:33:27.719000',NULL,NULL,NULL,'maidinhsonqwer@gmail.com',NULL,_binary '\0','PENDING',NULL,NULL,NULL,'sonbeo','Son301104@',NULL,'USER',_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(38,'anonymousUser','2024-09-13 07:33:51.741000','anonymousUser','2024-09-13 07:33:51.741000',NULL,NULL,NULL,'tamtran10202@gmail.com',NULL,_binary '\0','PENDING',NULL,NULL,NULL,'Lương Đăng Khoa','Khoa123@',NULL,'USER',_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(39,'anonymousUser','2024-09-13 07:34:44.110000','anonymousUser','2024-09-13 07:34:44.110000',NULL,NULL,NULL,'hotuyet6129@gmail.com',NULL,_binary '\0','PENDING',NULL,NULL,NULL,'Bế Tuyết','Tuyet@204',NULL,'USER',_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(40,'anonymousUser','2024-09-13 07:37:10.351000','anonymousUser','2024-09-13 07:37:10.351000',NULL,NULL,NULL,'banhminhungnuoc@gmail.com',NULL,_binary '\0','PENDING',NULL,NULL,NULL,'nguyễn ngọc anh','Anh@040304028091',NULL,'USER',_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(41,'anonymousUser','2024-09-13 07:51:03.467000','anonymousUser','2024-09-13 07:51:03.467000',NULL,NULL,NULL,'luongdiemquynh3503@gmail.com',NULL,_binary '\0','PENDING',NULL,NULL,NULL,'Lương Diễm Quỳnh','Diemquynh0305@',NULL,'USER',_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(42,'anonymousUser','2024-09-16 09:53:49.240000','anonymousUser','2024-09-16 09:53:49.240000',NULL,NULL,NULL,'bien4math@gmail.com',NULL,_binary '\0','PENDING',NULL,NULL,NULL,'Bien Linh','1$Vuilennao',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(43,'anonymousUser','2024-09-19 02:59:20.861000','anonymousUser','2024-09-19 02:59:20.861000',NULL,NULL,NULL,'thuymien302@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Văn Thị Hà Thương','Ht0987590105!',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(44,'anonymousUser','2024-09-20 03:50:53.828000','admin@gmail.com','2024-09-20 13:50:47.618000',NULL,NULL,NULL,'foss.bk@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Hoàng Quang Huy','123456qQ@',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(45,'anonymousUser','2024-09-20 03:55:14.307000','admin@gmail.com','2024-09-28 04:27:07.241000',NULL,NULL,NULL,'ibme.lab@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'iBME Lab','123456qQ@',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(46,'anonymousUser','2024-09-23 15:35:59.918000','anonymousUser','2024-09-23 15:35:59.918000',NULL,NULL,NULL,'hoanm2001@yahoo.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'a','Matkhau@23',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(47,'anonymousUser','2024-09-28 08:26:50.558000','anonymousUser','2024-09-28 08:26:50.558000',NULL,NULL,NULL,'thugiang1412@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Trần Thu Giang','NH8uV9TPY8hvngx!',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(48,'anonymousUser','2024-09-28 13:46:52.219000','transontung0805@gmail.com','2024-11-29 03:08:26.454000','113 ngõ 75 Đường Giải Phóng, Phường Đồng Tâm, Quận Hai Bà Trưng, Hà Nội',NULL,'2005-05-08 00:00:00.000000','transontung0805@gmail.com','MALE',\_binary '\0','PENDING',NULL,NULL,NULL,'Trần Sơn Tùng','Sontung@205','0359931605','USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(49,'anonymousUser','2024-10-01 10:02:17.692000','anonymousUser','2024-10-01 10:02:17.692000',NULL,NULL,NULL,'hang.nm233958@sis.hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Hang','#Fance85',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(50,'anonymousUser','2024-10-02 03:22:59.760000','admin@gmail.com','2024-10-02 03:23:56.452000',NULL,NULL,NULL,'anhvubme@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Giáo viên demo','123456qQ@',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(51,'anonymousUser','2024-10-04 02:53:28.120000','anonymousUser','2024-10-04 02:53:28.120000',NULL,NULL,NULL,'Tranquangminhkimlien@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Trần Quang Minh','Meocon352005#',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(52,'anonymousUser','2024-11-05 03:17:36.973000','anonymousUser','2024-11-05 03:17:36.973000',NULL,NULL,NULL,'rebelgal@lazyios.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'ReOla','a',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(53,'anonymousUser','2024-11-05 13:48:57.134000','anonymousUser','2024-11-05 13:48:57.134000',NULL,NULL,NULL,'pro20063@aenomail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'rito','a',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(54,'anonymousUser','2024-11-06 03:04:08.709000','anonymousUser','2024-11-06 03:04:08.709000',NULL,NULL,NULL,'jakobbille@thaitudang.xyz',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Jako','a',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(55,'anonymousUser','2024-11-06 14:43:05.546000','anonymousUser','2024-11-06 14:43:05.546000',NULL,NULL,NULL,'afnuomo@abdulsamentayan.shop',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Woo','a',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(56,'anonymousUser','2024-11-07 02:19:54.268000','anonymousUser','2024-11-07 02:19:54.268000',NULL,NULL,NULL,'djams82@bbcvnews.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Dji','a',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(57,'anonymousUser','2024-11-08 08:45:20.349000','anonymousUser','2024-11-08 08:45:20.349000',NULL,NULL,NULL,'partyrichy@dodoberat.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'dodo','a',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(58,'anonymousUser','2024-11-11 04:46:39.401000','anonymousUser','2024-11-11 04:46:39.401000',NULL,NULL,NULL,'nick124@code-gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'MNicl','a',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(59,'anonymousUser','2024-11-22 02:38:33.158000','admin@gmail.com','2024-11-22 02:38:59.407000',NULL,NULL,NULL,'huy.hoangquang@hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Giáo viên','12345678qQ@',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(60,'anonymousUser','2024-11-22 09:03:22.940000','test_cpd_111@yopmail.com','2024-11-22 09:09:54.718000',NULL,NULL,'2000-01-01 00:00:00.000000','test_cpd_111@yopmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Quynh Test','hust',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(61,'anonymousUser','2024-11-23 09:00:57.096000','anonymousUser','2024-11-23 09:00:57.096000',NULL,NULL,NULL,'accfarmrok2011@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'string','123123',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(62,'anonymousUser','2024-11-23 10:31:33.032000','gameofpvchuyen@gmail.com','2024-11-23 10:34:54.597000',NULL,NULL,NULL,'gameofpvchuyen@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'dhdh','123123',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(63,'anonymousUser','2024-11-26 15:45:49.623000','admin@gmail.com','2024-11-27 17:53:55.473000',NULL,NULL,NULL,'mhmhuong04@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Hương','123@Bc456',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(64,'anonymousUser','2024-11-26 15:55:13.228000','admin@gmail.com','2024-11-27 17:53:50.160000',NULL,NULL,NULL,'dunglevpr@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'le dung','@Dung192',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(66,'anonymousUser','2024-11-26 15:59:55.982000','dung.lq235301@sis.hust.edu.vn','2024-11-27 10:32:39.644000','some where',NULL,'2024-11-11 00:00:00.000000','dung.lq235301@sis.hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'le dung','@Dung196','0123456789','USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(67,'anonymousUser','2024-11-26 16:04:28.494000','admin@gmail.com','2024-11-27 17:53:52.120000',NULL,NULL,NULL,'phamdangmaihuonga2k26cvatn@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Pham Huong','BTSarmy287@',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(70,'anonymousUser','2024-11-27 01:52:02.985000','anonymousUser','2024-11-27 01:52:02.985000',NULL,NULL,NULL,'minhhang1485@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Học sinh','12345@Aa',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(71,'anonymousUser','2024-11-28 02:26:29.890000','anonymousUser','2024-11-28 02:26:29.890000',NULL,NULL,NULL,'mainthanh986@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Thanh Mai','Ws@56789',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(72,'anonymousUser','2024-11-28 12:06:18.867000','anonymousUser','2024-11-28 12:06:18.867000',NULL,NULL,NULL,'hoangchi2109@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Học sinh','123456qQ@',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(73,'anonymousUser','2024-11-28 12:32:09.032000','admin@gmail.com','2024-11-28 12:32:21.724000',NULL,NULL,NULL,'ibme.lab.24@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Giáo viên','123456qQ@',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(74,'anonymousUser','2024-11-29 01:55:20.829000','anonymousUser','2024-11-29 01:55:20.829000',NULL,NULL,NULL,'zuybp05@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Bùi Phương Duy','Comboinsec1503@',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(75,'anonymousUser','2024-11-29 01:55:20.829000','anonymousUser','2024-11-29 01:55:20.829000',NULL,NULL,NULL,'Vinh.LQ233988@sis.hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Lưu Quang Vinh','123456qQ@',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(76,'anonymousUser','2024-11-29 01:55:23.176000','anonymousUser','2024-11-29 01:55:23.176000',NULL,NULL,NULL,'huy.bq233961@sis.hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Bùi Quang Huy','123456qQ@',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(77,'anonymousUser','2024-11-29 01:55:36.549000','anonymousUser','2024-11-29 01:55:36.549000',NULL,NULL,NULL,'ngan.nk233977@sis.hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Ngan.NK233977@sis.hust.edu.vn','Ngannguyen@.1403',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(78,'anonymousUser','2024-11-29 01:55:49.235000','anonymousUser','2024-11-29 01:55:49.235000',NULL,NULL,NULL,'Chau.HTD233955@sis.hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Hoàng Thị Diệu Châu','yi@1CZw!Sg62AYC',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(79,'anonymousUser','2024-11-29 01:56:01.961000','anonymousUser','2024-11-29 01:56:01.961000',NULL,NULL,NULL,'Nhi.TY233979@sis.hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Trần Yến Nhi','123456qQ@',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(80,'anonymousUser','2024-11-29 01:56:15.544000','anonymousUser','2024-11-29 01:56:15.544000',NULL,NULL,NULL,'Khanh.DT233962@sis.hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Đặng Trung Khánh','123456qQ@',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(81,'anonymousUser','2024-11-29 01:56:22.616000','anonymousUser','2024-11-29 01:56:22.616000',NULL,NULL,NULL,'thuong.np233984@sis.hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Phi Thường','123456qQ@',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(82,'anonymousUser','2024-11-29 01:56:45.107000','anonymousUser','2024-11-29 01:56:45.107000',NULL,NULL,NULL,'Anh.NT233952@sis.hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Thế Anh','123456qQ@',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(83,'anonymousUser','2024-11-29 01:57:40.457000','anonymousUser','2024-11-29 01:57:40.457000',NULL,NULL,NULL,'Truong.ND233985@sis.hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Đoàn Trưởng','123456qQ@',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(84,'anonymousUser','2024-11-29 01:57:53.420000','anonymousUser','2024-11-29 01:57:53.420000',NULL,NULL,NULL,'lam.tn233963@sis.hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Trần Ngọc Lâm','Tranngoclam05@@@',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(85,'anonymousUser','2024-11-29 01:58:25.327000','anonymousUser','2024-11-29 01:58:25.327000',NULL,NULL,NULL,'Bach.TV233954@sis.hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Trần Việt Bách','B@chmau181',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(86,'anonymousUser','2024-11-29 01:58:55.434000','anonymousUser','2024-11-29 01:58:55.434000',NULL,NULL,NULL,'minh.nq233969@sis.hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Quang Minh','123456qQ@',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(87,'anonymousUser','2024-11-29 01:58:55.753000','anonymousUser','2024-11-29 01:58:55.753000',NULL,NULL,NULL,'Linh.NK233964@sis.hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Khánh Linh','Linhanh5b1@',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(88,'anonymousUser','2024-11-29 01:59:32.145000','anonymousUser','2024-11-29 01:59:32.145000',NULL,NULL,NULL,'Bach.DX233953@sis.hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Đinh Xuân Bách','123456qQ@',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(89,'anonymousUser','2024-11-29 02:00:40.071000','anonymousUser','2024-11-29 02:00:40.071000',NULL,NULL,NULL,'Anh.NH233951@sis.hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Hoàng Anh','123456qQ@',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(90,'anonymousUser','2024-11-29 02:01:07.722000','anonymousUser','2024-11-29 02:01:07.722000',NULL,NULL,NULL,'Anh.DQ233950@sis.hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Đinh Quang Anh','123456qQ@',NULL,'USER',\_binary '',NULL,NULL,NULL,NULL,NULL,0,NULL),(91,'anonymousUser','2024-11-29 02:01:40.798000','anonymousUser','2024-11-29 02:01:40.798000',NULL,NULL,NULL,'Khoa.LH239648@sis.hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Lê Hà Khoa','Hakhoa05!',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(92,'anonymousUser','2024-11-29 02:03:48.450000','anonymousUser','2024-11-29 02:03:48.450000',NULL,NULL,NULL,'Loc.TQ233966@sis.hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Trần Quốc Lộc','123456qQ@',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(93,'anonymousUser','2024-11-29 02:05:04.433000','anonymousUser','2024-11-29 02:05:04.433000',NULL,NULL,NULL,'Nam.NH233974@sis.hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Yukino Yukinoshita','Namepcam2005!',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(94,'anonymousUser','2024-11-29 02:12:43.482000','anonymousUser','2024-11-29 02:12:43.482000',NULL,NULL,NULL,'nemofish0512@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Lưu Hoàng Sơn','Sobinmtp0512@',NULL,'USER',\_binary '',NULL,NULL,NULL,NULL,NULL,0,NULL),(95,'anonymousUser','2024-11-29 03:09:15.349000','anonymousUser','2024-11-29 03:09:15.349000',NULL,NULL,NULL,'Minh.TQ233971@sis.hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Trần Quang Minh','Meocon352005#',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(96,'anonymousUser','2024-11-29 03:11:04.224000','anonymousUser','2024-11-29 03:11:04.224000',NULL,NULL,NULL,'Tung.TS233986@sis.hust.edu.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Trần Sơn Tùng','Sontung@205',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(97,'anonymousUser','2024-11-30 04:07:51.783000','anonymousUser','2024-11-30 04:07:51.783000',NULL,NULL,NULL,'nguyenjunior98@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Minh Đức','123443211',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(98,'anonymousUser','2024-11-30 07:54:27.013000','anonymousUser','2025-07-02 02:16:03.000000',NULL,NULL,NULL,'vietanhhb2304@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Bùi Việt Anh','23042003',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(99,'anonymousUser','2024-11-30 10:30:46.037000','anonymousUser','2024-11-30 10:30:46.037000',NULL,NULL,NULL,'dominhkhoa222@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Đỗ Minh Khoa','khoa',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(100,'anonymousUser','2024-12-02 08:37:27.303000','anonymousUser','2024-12-04 03:07:33.382000',NULL,NULL,NULL,'phamthuhien1416@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Phạm Thị Thu Hiền','ATtbBCBrO96X',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(101,'anonymousUser','2024-12-02 08:46:22.017000','admin@gmail.com','2024-12-02 08:47:07.012000',NULL,NULL,NULL,'nguyenmai273@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Thị Tuyết Mai','Nguyenmai123@',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(102,'anonymousUser','2024-12-02 08:46:58.023000','dts.son2009@gmail.com','2024-12-14 00:21:57.636000','Giáp Bát, quận Hoàng Mai, Hà Nội','https://wesign.ibme.edu.vn/upload/hust-app//93284bd8-cc89-4055-b4aa-92ffe86bb6a2-1_all_128301.jpg','1975-09-20 00:00:00.000000','dts.son2009@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Đỗ Thanh Sơn','123456qQ@','0936377621','TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(103,'anonymousUser','2024-12-02 08:52:04.168000','linhnoona@gmail.com','2024-12-02 09:05:28.854000','39 Hoàng Ngân','https://wesign.ibme.edu.vn/upload/hust-app//z6090106437350_3a3c64fb667efea633f57b94df3332bc.jpg','1985-03-26 00:00:00.000000','linhnoona@gmail.com','FEMALE',\_binary '\0','PENDING',NULL,NULL,NULL,'Linh Thị Sơn','linh1985','0397578798','TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(104,'anonymousUser','2024-12-02 09:04:29.278000','bich.bguyen@gmail.com','2024-12-16 06:43:01.344000',NULL,NULL,NULL,'bich.bguyen@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Bích Ngân','1q2w3e!@',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(105,'anonymousUser','2024-12-02 09:32:20.659000','admin@gmail.com','2024-12-02 09:42:23.688000',NULL,NULL,NULL,'doanthihang20019909x@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Doãn Thị Hằng','123456qQ@',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(109,'anonymousUser','2024-12-03 09:09:28.343000','anonymousUser','2025-06-12 02:23:00.000000',NULL,NULL,NULL,'khanhmlll2k6@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'vũ quang khánh','101006',NULL,'USER',\_binary '',NULL,NULL,NULL,NULL,NULL,0,NULL),(110,'anonymousUser','2024-12-04 02:44:44.876000','admin@gmail.com','2025-06-27 11:06:52.000000','Cầu Giấy, Hà Nội',NULL,'1979-06-23 00:00:00.000000','ttthiep@yahoo.com.vn',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Tran Thi Thiep','Thiephieu15!',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(111,'anonymousUser','2024-12-04 15:44:05.119000','admin@gmail.com','2025-04-27 09:47:36.000000',NULL,NULL,NULL,'hangfance@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Giáo viên','#Hang1408',NULL,'TEACHER',\_binary '',NULL,NULL,NULL,NULL,NULL,0,NULL),(112,'anonymousUser','2024-12-04 15:47:42.539000','admin@gmail.com','2025-04-27 09:49:13.000000',NULL,NULL,NULL,'avanthana1485@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Teacher','#Fance85',NULL,'TEACHER',\_binary '',NULL,NULL,NULL,NULL,NULL,0,NULL),(113,'anonymousUser','2024-12-06 03:26:33.155000','anonymousUser','2024-12-06 03:26:33.155000',NULL,NULL,NULL,'ngdungzack25@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Dung','Test123456!',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(114,'anonymousUser','2024-12-08 02:22:03.299000','admin@gmail.com','2025-06-27 11:06:40.000000','Cầu Giấy, Hà Nội',NULL,'1983-12-09 00:00:00.000000','hoagiomai@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Lê Thị Thúy Hoa','Thuyhoa123@',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(115,'anonymousUser','2024-12-10 00:56:54.761000','admin@gmail.com','2025-06-27 11:05:51.000000','Đống Đa, Hà Nội',NULL,'1976-01-15 00:00:00.000000','nguyenkieuninh2326@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Thị Kiều Ninh','Ninh1988@',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,1),(116,'anonymousUser','2024-12-10 01:13:23.334000','admin@gmail.com','2025-06-27 11:05:27.000000','Thanh Xuân, Hà Nội',NULL,'1993-08-12 00:00:00.000000','unglan99@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Ứng Thị Lan','Baongoc2016@',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,1),(117,'anonymousUser','2024-12-19 06:27:31.749000','anonymousUser','2025-06-18 17:22:51.000000','Không có',NULL,'2009-09-11 00:00:00.000000','string@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Hiếu','string',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(118,'anonymousUser','2024-12-19 06:28:29.783000','anonymousUser','2025-06-27 11:04:40.000000','Kosmo Tây Hồ',NULL,'1995-02-07 00:00:00.000000','string1@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Giáo Viên Test','string',NULL,'TEACHER',\_binary '',NULL,NULL,NULL,NULL,NULL,0,3),(119,'admin@gmail.com','2024-12-19 09:11:44.734000','admin@gmail.com','2025-06-18 17:22:38.000000','Ba Đình',NULL,'2010-11-18 00:00:00.000000','gameofpvc@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Lê Đức','123123',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,3),(120,'admin@gmail.com','2024-12-19 09:15:05.958000','admin@gmail.com','2025-04-26 11:54:53.000000','Không có',NULL,NULL,'aSDC@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'asfasfa','123123',NULL,'USER',\_binary '',NULL,NULL,NULL,NULL,NULL,0,1),(121,'admin@gmail.com','2024-12-19 09:17:58.152000','admin@gmail.com','2025-06-18 17:22:15.000000','Không có',NULL,'2010-04-09 00:00:00.000000','wda@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Huỳnh','123123',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(122,'admin@gmail.com','2024-12-19 09:22:51.947000','admin@gmail.com','2025-04-27 09:37:54.000000','Không có',NULL,NULL,'dddd@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Duy','123123',NULL,'USER',\_binary '',NULL,NULL,NULL,NULL,NULL,0,2),(123,'chuyenp32@gmail.com','2024-12-20 02:32:11.330000','chuyenp32@gmail.com','2025-06-18 17:22:04.000000','C5HUST',NULL,'2010-01-15 00:00:00.000000','cute@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Chuyen','123123',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,3),(124,'admin@gmail.com','2025-04-23 17:39:20.000000','admin@gmail.com','2026-01-09 23:45:20.000000','2Trần Đại Nghĩa',NULL,NULL,'abcd@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn bảy','123456',NULL,'USER',\_binary '',NULL,NULL,NULL,NULL,'Hà Nội',0,2),(130,NULL,NULL,NULL,'2025-04-27 14:55:50.000000','Bình Dương',NULL,NULL,'ronaldo@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Ronaldo','123456',NULL,'USER',\_binary '',NULL,NULL,NULL,NULL,NULL,0,1),(131,NULL,NULL,NULL,'2025-04-27 14:55:49.000000','Hải Phòng',NULL,NULL,'pinkey@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'pinkey','123456',NULL,'USER',\_binary '',NULL,NULL,NULL,NULL,NULL,0,2),(132,NULL,NULL,NULL,'2025-05-28 19:24:16.000000','bdn',NULL,'2025-04-09 00:00:00.000000','messi@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Messi','123456',NULL,'TEACHER',\_binary '',NULL,NULL,NULL,NULL,NULL,0,2),(133,NULL,NULL,NULL,'2025-04-27 14:56:19.000000','Laos',NULL,NULL,'nguyễnvănb@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Văn B','123456',NULL,'USER',\_binary '',NULL,NULL,NULL,NULL,NULL,0,1),(134,NULL,NULL,NULL,'2025-06-18 17:21:53.000000','Ngọc Khánh',NULL,'2010-10-12 00:00:00.000000','tranthic@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Van Duc','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,1),(135,NULL,NULL,NULL,'2025-05-07 16:26:47.000000','abbc',NULL,NULL,'bai4@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'ABC','123456',NULL,'TEACHER',\_binary '',NULL,NULL,NULL,NULL,NULL,0,2),(136,NULL,NULL,NULL,'2025-06-27 11:04:32.000000','1 Trần Đại Nghĩa',NULL,'1985-05-22 00:00:00.000000','duy@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Duy','123456',NULL,'TEACHER',\_binary '',NULL,NULL,NULL,NULL,NULL,0,2),(137,NULL,NULL,NULL,'2025-06-18 17:21:44.000000','ĐHBK Hà Nội',NULL,'2009-08-21 00:00:00.000000','trananhduc@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Anh Duc','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,1),(144,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'doanthihang@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Doãn Thị Hằng','123456',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(145,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'linhthison@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Linh Thị Sơn','123456',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(146,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'phamthithuhien@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Phạm Thị Thu Hiền','123456',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(147,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'nguyenbichngan@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Bích Ngân','123456',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(148,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'nguyenthituyetmai@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Thị Tuyết Mai','123456',NULL,'TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(149,NULL,NULL,NULL,'2025-10-29 04:32:07.000000',NULL,NULL,NULL,'vuthithuhuong@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Vũ Thị Thu Hường','123456','0999999999','TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(150,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'maibaoson@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Mai Bảo Sơn','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(151,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'nguyenthiphuonganh@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Thị Phương Anh','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(152,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'leduyhung@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Lê Duy Hùng','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(153,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'doquanghung@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Đỗ Quang Hưng','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(154,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'buiphuonglinh@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Bùi Phương Linh','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(155,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'chutienmanh@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Chử Tiến Mạnh','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(156,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'letruongson@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Lê Trường Sơn','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(157,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'vuphuckhang@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Vũ Phúc Khang','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(158,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'nguyenthingocanh@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Thị Ngọc Ánh','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(159,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'dinhtrongchien@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Đinh Trọng Chiến','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(160,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'dothidung@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Đỗ Thị Dung','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(161,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'nguyenvietngochuy@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Viết Ngọc Huy','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(162,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'nguyengiahung@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Gia Hưng','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(163,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'hoangthuylinh@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Hoàng Thuỳ Linh','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(164,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'nguyenthuphuong@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Thu Phương','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(165,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'tranducvuong@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Trần Đức Vương','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(166,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'dotiendat@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Đỗ Tiến Đạt','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(167,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'nguyenngocbaochau@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Ngọc Bảo Châu','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(168,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'nguyendinhduong@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Đình Dương','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(169,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'nguyendinhhainam@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Đình Hải Nam','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(170,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'phamngankhanh@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Phạm Ngân Khánh','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(171,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'nongquocthang@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nông Quốc Thắng','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(172,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'doanhvu@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Đỗ Anh Vũ','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(173,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'tranhuongnhi@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Trần Hương Nhi','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(174,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'quachluutuankhang@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Quách Lưu Tuấn Khang','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(175,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'nguyenhaanh@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Hà Anh','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(176,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'nguyenvanbao@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Văn Bảo','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(177,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'huynhngocanchi@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Huỳnh Ngọc An Chi','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(178,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'phamhuyenly@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Phạm Huyền Ly','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(179,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'phamtueminh@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Phạm Tuệ Minh','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(180,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'tavietbaonam@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Tạ Viết Bảo Nam','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(181,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'hathiphuongthao@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Hà Thị Phương Thảo','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(182,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'nguyenchitrong@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Chí Trọng','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(183,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'nguyenthituoi@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Thị Tươi','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(184,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'vuquocviet@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Vũ Quốc Việt','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(185,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'dinhtienvu@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Đinh Tiến Vũ','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(186,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'tranvanhuy@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Trần Văn Huy','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(187,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'hoangvietdung@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Hoàng Việt Dũng','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(188,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'nguyenthihai@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Thị Hái','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(189,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'nguyenvankhoa@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Văn Khoa','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(190,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'hoangxuannhat@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Hoàng Xuân Nhật','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(191,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'lenguyenanphu@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Lê Nguyễn An Phú','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(192,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'hoangtrunghieu@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Hoàng Trung Hiếu','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(193,NULL,NULL,NULL,'2025-10-03 15:53:05.000000',NULL,NULL,NULL,'dinhquoctruong@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Đinh Quốc Trường','123456',NULL,'USER',\_binary '',NULL,NULL,NULL,NULL,NULL,0,2),(194,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'tranvunhathuy@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Trần Vũ Nhật Huy','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(195,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'buikieumylinh@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Bùi Kiều Mỹ Linh','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(196,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'phamducphat@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Phạm Đức Phát','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(197,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'nguyenhoangnam@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Hoàng Nam','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(198,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'buivietanh@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Bùi Việt Anh','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(199,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'trinhtuankiet@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Trịnh Tuấn Kiệt','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(200,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'nguyenhoanganh@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Hoàng Anh','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(212,NULL,NULL,NULL,'2025-10-29 04:32:02.000000',NULL,NULL,NULL,'hoangquanghuy@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Hoàng Quang Huy','123456','0999999999','TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,3),(213,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'vuquangduy@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Vũ Quang Duy','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,3),(214,NULL,NULL,NULL,'2025-10-29 04:31:52.000000',NULL,NULL,NULL,'trananhvu@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Trần Anh Vũ','123456','0999999999','TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,3),(217,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'hocsinh1a@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Học sinh 1A','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,3),(218,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'nguyentuandat@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Tuấn Đạt','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(219,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'nguyenvana@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Văn A','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,3),(222,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'nguyenvand@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyên Văn D','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(223,NULL,NULL,NULL,'2025-10-08 09:32:48.000000',NULL,NULL,NULL,'tranthia@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Trần Thị A','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(224,NULL,NULL,NULL,'2025-10-29 04:31:48.000000',NULL,NULL,NULL,'tranthib@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Trần Thị B','123456','0999999999','TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(226,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'tranthid@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Trần thị D','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(227,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'tranvanhai@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Trần Văn Hải','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(230,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'tranvanf@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Trần Văn F','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(232,NULL,NULL,NULL,'2025-10-24 23:58:10.000000',NULL,NULL,NULL,'tranvang@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Trần Văn G','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(233,NULL,NULL,NULL,'2025-10-23 07:37:05.000000',NULL,NULL,NULL,'c@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'c','123456',NULL,'TEACHER',\_binary '',NULL,NULL,NULL,NULL,NULL,0,2),(234,NULL,NULL,NULL,'2025-10-23 07:37:07.000000',NULL,NULL,NULL,'d@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'d','123456',NULL,'TEACHER',\_binary '',NULL,NULL,NULL,NULL,NULL,0,2),(239,NULL,NULL,NULL,'2025-10-25 00:02:05.000000',NULL,NULL,NULL,'u@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'ư','123456',NULL,'USER',\_binary '',NULL,NULL,NULL,NULL,NULL,0,2),(241,NULL,NULL,NULL,'2025-10-25 00:04:26.000000',NULL,NULL,NULL,'us@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'ưs','123456',NULL,'USER',\_binary '',NULL,NULL,NULL,NULL,NULL,0,2),(243,NULL,NULL,NULL,'2025-10-27 06:26:08.000000',NULL,NULL,NULL,'e@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'e','123456',NULL,'USER',\_binary '',NULL,NULL,NULL,NULL,NULL,0,3),(244,NULL,NULL,NULL,'2025-10-29 04:31:44.000000',NULL,NULL,NULL,'thanhcongnguyen0908@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Thành Công','0123456789','0999999999','TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(250,NULL,NULL,NULL,'2025-10-29 04:31:13.000000',NULL,NULL,NULL,'haiquang1997@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Quang Hải','0123456789','0999999999','TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(251,NULL,NULL,NULL,'2025-10-28 02:33:14.000000',NULL,NULL,NULL,'testkt1@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'test kt 1','123456',NULL,'TEACHER',\_binary '',NULL,NULL,NULL,NULL,NULL,0,3),(257,NULL,NULL,NULL,'2025-10-29 04:30:58.000000',NULL,NULL,NULL,'testkt12@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'test kt 12','123456','0999999999','TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(259,NULL,NULL,NULL,'2025-10-28 02:57:54.000000',NULL,NULL,NULL,'test2@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'test 2','123456',NULL,'TEACHER',\_binary '',NULL,NULL,NULL,NULL,NULL,0,2),(262,NULL,NULL,NULL,'2025-10-30 07:21:05.000000',NULL,NULL,NULL,'hoanghuy0893@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Hoàng Huy','123456','0983120223','TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,3),(268,NULL,NULL,NULL,'2025-10-28 04:30:26.000000',NULL,NULL,NULL,'testkt13@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'test kt 13','123456',NULL,'TEACHER',\_binary '',NULL,NULL,NULL,NULL,NULL,0,2),(270,NULL,NULL,NULL,'2025-10-29 04:25:38.000000',NULL,NULL,NULL,'teacher123@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Quang Hải','0966555552','0912456789','TEACHER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(273,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'hocsinh1@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'test kt 14','0999999999',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,3),(274,NULL,NULL,NULL,'2025-10-28 15:13:57.000000',NULL,NULL,NULL,'xuantiennguyen88@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Xuân Tiến','0312256568','0132232434','USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(276,NULL,NULL,NULL,'2025-10-28 15:12:47.000000',NULL,NULL,NULL,'tuanduc092@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Tuấn Đức','0223256666','0913164588','USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(278,NULL,NULL,NULL,'2025-10-28 10:35:54.000000',NULL,NULL,NULL,'haianhpham@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Phạm Hải Anh','0123456789','0123456782','USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,3),(280,NULL,NULL,NULL,'2025-10-30 07:20:13.000000','string',NULL,NULL,'johndoe@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'John Doe','123456','0915545219','USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,2),(282,NULL,NULL,NULL,NULL,'string',NULL,NULL,'john@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'John','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(285,NULL,NULL,NULL,NULL,'string',NULL,NULL,'phi@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Phi','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(287,NULL,NULL,NULL,NULL,'string',NULL,NULL,'linh@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Linh','123456',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(290,'anonymousUser',NULL,NULL,NULL,NULL,NULL,NULL,'kilian@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Hello Kitty','$2b$10$KtRhbgBKHzn3/PrxVY/1MuNdQ9KNM37znmrlwGU5K9MowYcCHz4AO','0987654321','USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(291,'anonymousUser',NULL,NULL,NULL,NULL,NULL,NULL,'tvanvinh293@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Tran Van Vinh','Vanvinh293@',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(292,'anonymousUser',NULL,NULL,NULL,NULL,NULL,NULL,'newuser@example.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Văn A','password123',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(293,'anonymousUser',NULL,NULL,NULL,NULL,NULL,NULL,'linhvv.312201@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'vulinh','vulinh10',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(294,'anonymousUser',NULL,NULL,NULL,NULL,NULL,NULL,'linhvv.312@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'vu linh','vulinh10',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(295,'anonymousUser',NULL,NULL,NULL,NULL,NULL,NULL,'user@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Văn A','password123',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(296,'anonymousUser',NULL,NULL,NULL,NULL,NULL,NULL,'donaltrump@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Donald Trump','password123',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(297,'anonymousUser',NULL,NULL,NULL,NULL,NULL,NULL,'test@test.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Test User','Password123!',NULL,'STUDENT',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(298,'anonymousUser',NULL,NULL,'2026-01-10 02:25:49.000000',NULL,NULL,NULL,'vuquangduy13032002@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Vũ Quang DUy','vuquangduy2002',NULL,'STUDENT',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(299,'anonymousUser',NULL,NULL,NULL,NULL,NULL,NULL,'hihihi@example.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Văn A','password123',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(300,'anonymousUser',NULL,NULL,NULL,NULL,NULL,NULL,'hihihaai@example.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Văn A','password123',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(301,'anonymousUser',NULL,NULL,NULL,NULL,NULL,NULL,'hihihaasi@example.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Văn A','passwor',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(302,'anonymousUser',NULL,NULL,NULL,NULL,NULL,NULL,'hihihaassi@example.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Văn A','p',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(303,'anonymousUser',NULL,NULL,NULL,NULL,NULL,NULL,'obiitoo113@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Tran Van Vinh','Vanvinh293@',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(304,'anonymousUser',NULL,NULL,NULL,NULL,NULL,NULL,'test1@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'test1','vulinh10',NULL,'STUDENT',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(305,'anonymousUser',NULL,NULL,'2026-01-10 05:28:37.000000',NULL,NULL,NULL,'quangduy13032002@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Vũ Quang Duy','vuquangduy1332k2',NULL,'STUDENT',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(306,'anonymousUser',NULL,NULL,NULL,NULL,NULL,NULL,'phi.chudang@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'phi','Vanvinh293@',NULL,'USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(307,'admin@gmail.com','2026-01-10 03:21:34.000000',NULL,NULL,NULL,NULL,NULL,'tranvanvinh@gmail.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Trần Văn Vinh','123456',NULL,'STUDENT',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL),(308,'anonymousUser',NULL,NULL,NULL,NULL,NULL,NULL,'newuser11@example.com',NULL,\_binary '\0','PENDING',NULL,NULL,NULL,'Nguyễn Văn A','password123','0123456789','USER',\_binary '\0',NULL,NULL,NULL,NULL,NULL,0,NULL);
/_!40000 ALTER TABLE `user` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `user_exam_mapping`
--

DROP TABLE IF EXISTS `user_exam_mapping`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `user_exam_mapping` (
`user_exam_id` bigint NOT NULL AUTO_INCREMENT,
`exam_id` bigint NOT NULL,
`is_finish` bit(1) NOT NULL,
`score` float NOT NULL,
`user_id` bigint NOT NULL,
PRIMARY KEY (`user_exam_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1606 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `user_exam_mapping`
--

LOCK TABLES `user_exam_mapping` WRITE;
/_!40000 ALTER TABLE `user_exam_mapping` DISABLE KEYS _/;
/_!40000 ALTER TABLE `user_exam_mapping` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `user_log`
--

DROP TABLE IF EXISTS `user_log`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `user_log` (
`log_id` bigint NOT NULL AUTO_INCREMENT,
`user_id` int DEFAULT NULL COMMENT 'User thực hiện hành động (NULL nếu là system hoặc anonymous)',
`action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Loại hành động (PERMISSION_GRANTED, LOGIN, etc.)',
`resource` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Tài nguyên bị tác động (user_permissions, user, etc.)',
`resource_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'ID của resource (optional)',
`details` json DEFAULT NULL COMMENT 'Chi tiết hành động dạng JSON',
`ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'IPv4 hoặc IPv6',
`user_agent` text COLLATE utf8mb4_unicode_ci COMMENT 'Browser/device information',
`status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'SUCCESS' COMMENT 'SUCCESS, FAILED, DENIED',
`created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (`log_id`),
KEY `idx_user_id` (`user_id`),
KEY `idx_action` (`action`),
KEY `idx_resource` (`resource`),
KEY `idx_created_at` (`created_at`),
KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `user_log`
--

LOCK TABLES `user_log` WRITE;
/_!40000 ALTER TABLE `user_log` DISABLE KEYS _/;
/_!40000 ALTER TABLE `user_log` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `user_permissions`
--

DROP TABLE IF EXISTS `user_permissions`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `user_permissions` (
`id` bigint NOT NULL AUTO_INCREMENT,
`user_id` bigint NOT NULL,
`permission_code` varchar(255) NOT NULL,
`is_granted` tinyint(1) DEFAULT '1' COMMENT '1: granted, 0: denied',
`organization_id` bigint DEFAULT NULL COMMENT 'NULL = global permission',
`granted_by` varchar(255) DEFAULT NULL,
`created_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (`id`),
UNIQUE KEY `uk_user_permission` (`user_id`,`permission_code`,`organization_id`),
KEY `idx_user` (`user_id`),
KEY `idx_permission` (`permission_code`),
CONSTRAINT `fk_user_permissions_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `user_permissions`
--

LOCK TABLES `user_permissions` WRITE;
/_!40000 ALTER TABLE `user_permissions` DISABLE KEYS _/;
/_!40000 ALTER TABLE `user_permissions` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `user_practice_mapping`
--

DROP TABLE IF EXISTS `user_practice_mapping`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `user_practice_mapping` (
`user_practice_id` bigint NOT NULL AUTO_INCREMENT,
`user_id` bigint NOT NULL,
`exam_id` bigint NOT NULL,
`score` decimal(10,2) DEFAULT NULL,
`is_finish` bit(1) DEFAULT b'0',
`created_date` datetime DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (`user_practice_id`),
KEY `fk_user_practice_mapping_user` (`user_id`),
KEY `fk_user_practice_mapping_exam` (`exam_id`),
CONSTRAINT `fk_user_practice_mapping_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=171 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `user_practice_mapping`
--

LOCK TABLES `user_practice_mapping` WRITE;
/_!40000 ALTER TABLE `user_practice_mapping` DISABLE KEYS _/;
/_!40000 ALTER TABLE `user_practice_mapping` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `user_statistic`
--

DROP TABLE IF EXISTS `user_statistic`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `user_statistic` (
`user_statistic_id` bigint NOT NULL AUTO_INCREMENT,
`total_classes_joined` bigint DEFAULT '0',
`vocabulary_views` bigint DEFAULT '0',
`tests_completed` bigint DEFAULT '0',
`average_score` decimal(10,2) DEFAULT '0.00',
`user_id` bigint NOT NULL,
`created_date` datetime DEFAULT CURRENT_TIMESTAMP,
`modified_date` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
`lesson_views` bigint DEFAULT '0',
PRIMARY KEY (`user_statistic_id`),
UNIQUE KEY `user_id` (`user_id`),
CONSTRAINT `fk_user_statistic_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=281 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `user_statistic`
--

LOCK TABLES `user_statistic` WRITE;
/_!40000 ALTER TABLE `user_statistic` DISABLE KEYS _/;
/_!40000 ALTER TABLE `user_statistic` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `version`
--

DROP TABLE IF EXISTS `version`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `version` (
`VER_ID` bigint NOT NULL,
`SCHEMA_VERSION` varchar(127) NOT NULL,
`VERSION_COMMENT` varchar(255) DEFAULT NULL,
PRIMARY KEY (`VER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `version`
--

LOCK TABLES `version` WRITE;
/_!40000 ALTER TABLE `version` DISABLE KEYS _/;
/_!40000 ALTER TABLE `version` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `video_exam_mapping`
--

DROP TABLE IF EXISTS `video_exam_mapping`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `video_exam_mapping` (
`video_exam_id` bigint NOT NULL AUTO_INCREMENT,
`video_url` varchar(255) NOT NULL,
`exam_id` bigint NOT NULL,
`user_id` bigint NOT NULL,
`created_date` datetime DEFAULT CURRENT_TIMESTAMP,
`ai_answer` varchar(255) DEFAULT NULL,
PRIMARY KEY (`video_exam_id`),
KEY `fk_user` (`user_id`),
CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=192 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `video_exam_mapping`
--

LOCK TABLES `video_exam_mapping` WRITE;
/_!40000 ALTER TABLE `video_exam_mapping` DISABLE KEYS _/;
/_!40000 ALTER TABLE `video_exam_mapping` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `vocabulary`
--

DROP TABLE IF EXISTS `vocabulary`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `vocabulary` (
`vocabulary_id` bigint NOT NULL AUTO_INCREMENT,
`created_by` varchar(255) DEFAULT NULL,
`created_date` datetime(6) DEFAULT NULL,
`modified_by` varchar(255) DEFAULT NULL,
`modified_date` datetime(6) DEFAULT NULL,
`content` varchar(255) DEFAULT NULL,
`topic_id` bigint DEFAULT NULL,
`note` varchar(255) DEFAULT NULL,
`vocabulary_type` enum('PARAGRAPH','SENTENCE','WORD') DEFAULT NULL,
`part_id` bigint DEFAULT NULL,
`lesson_id` bigint DEFAULT NULL,
`description` varchar(255) DEFAULT NULL,
`is_private` bit(1) NOT NULL DEFAULT b'0',
`class_room_id` bigint DEFAULT NULL,
`images_path` text,
`videos_path` text,
`slug` varchar(255) DEFAULT NULL,
`status` enum('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
`created_id` bigint NOT NULL,
PRIMARY KEY (`vocabulary_id`),
KEY `FKdtg3eitwnfxdem5ick6ocp3kn` (`topic_id`),
KEY `idx_vocabulary_id` (`vocabulary_id`),
KEY `idx_vocabulary_combined` (`topic_id`,`vocabulary_type`,`created_by`),
KEY `fk_vocabulary_classroom` (`class_room_id`),
CONSTRAINT `fk_vocabulary_classroom` FOREIGN KEY (`class_room_id`) REFERENCES `class_room` (`class_room_id`) ON DELETE SET NULL,
CONSTRAINT `fk_vocabulary_topic` FOREIGN KEY (`topic_id`) REFERENCES `topic` (`topic_id`) ON DELETE SET NULL,
CONSTRAINT `FKdtg3eitwnfxdem5ick6ocp3kn` FOREIGN KEY (`topic_id`) REFERENCES `topic` (`topic_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2699 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `vocabulary`
--

LOCK TABLES `vocabulary` WRITE;
/_!40000 ALTER TABLE `vocabulary` DISABLE KEYS _/;
/_!40000 ALTER TABLE `vocabulary` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `vocabulary_exam_mapping`
--

DROP TABLE IF EXISTS `vocabulary_exam_mapping`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `vocabulary_exam_mapping` (
`vocabulary_exam_id` bigint NOT NULL AUTO_INCREMENT,
`vocabulary_id` bigint NOT NULL,
`exam_id` bigint NOT NULL,
`content` varchar(256) DEFAULT NULL,
`created_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (`vocabulary_exam_id`),
KEY `fk_exam` (`exam_id`),
KEY `fk_vocabulary` (`vocabulary_id`),
CONSTRAINT `fk_vocabulary` FOREIGN KEY (`vocabulary_id`) REFERENCES `vocabulary` (`vocabulary_id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `vocabulary_exam_mapping`
--

LOCK TABLES `vocabulary_exam_mapping` WRITE;
/_!40000 ALTER TABLE `vocabulary_exam_mapping` DISABLE KEYS _/;
/_!40000 ALTER TABLE `vocabulary_exam_mapping` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `vocabulary_image`
--

DROP TABLE IF EXISTS `vocabulary_image`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `vocabulary_image` (
`vocabulary_image_id` bigint NOT NULL AUTO_INCREMENT,
`created_by` varchar(255) DEFAULT NULL,
`created_date` datetime(6) DEFAULT NULL,
`modified_by` varchar(255) DEFAULT NULL,
`modified_date` datetime(6) DEFAULT NULL,
`image_location` varchar(255) DEFAULT NULL,
`is_primary` bit(1) NOT NULL,
`vocabulary_id` bigint DEFAULT NULL,
PRIMARY KEY (`vocabulary_image_id`),
KEY `FKlnpmkqih9sri9d63gj3foc5oo` (`vocabulary_id`),
CONSTRAINT `FKlnpmkqih9sri9d63gj3foc5oo` FOREIGN KEY (`vocabulary_id`) REFERENCES `vocabulary` (`vocabulary_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2609 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `vocabulary_image`
--

LOCK TABLES `vocabulary_image` WRITE;
/_!40000 ALTER TABLE `vocabulary_image` DISABLE KEYS _/;
/_!40000 ALTER TABLE `vocabulary_image` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `vocabulary_video`
--

DROP TABLE IF EXISTS `vocabulary_video`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `vocabulary_video` (
`vocabulary_video_id` bigint NOT NULL AUTO_INCREMENT,
`created_by` varchar(255) DEFAULT NULL,
`created_date` datetime(6) DEFAULT NULL,
`modified_by` varchar(255) DEFAULT NULL,
`modified_date` datetime(6) DEFAULT NULL,
`is_primary` bit(1) NOT NULL,
`video_location` varchar(255) DEFAULT NULL,
`vocabulary_id` bigint DEFAULT NULL,
PRIMARY KEY (`vocabulary_video_id`),
KEY `FKrg36qrk5reo4fidttev18jmuf` (`vocabulary_id`),
CONSTRAINT `FKrg36qrk5reo4fidttev18jmuf` FOREIGN KEY (`vocabulary_id`) REFERENCES `vocabulary` (`vocabulary_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2628 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `vocabulary_video`
--

LOCK TABLES `vocabulary_video` WRITE;
/_!40000 ALTER TABLE `vocabulary_video` DISABLE KEYS _/;
/_!40000 ALTER TABLE `vocabulary_video` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `vocabulary_view`
--

DROP TABLE IF EXISTS `vocabulary_view`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `vocabulary_view` (
`vocabulary_view_id` bigint NOT NULL AUTO_INCREMENT,
`user_id` bigint NOT NULL,
`vocabulary_id` bigint NOT NULL,
`last_viewed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
`view_count` bigint NOT NULL DEFAULT '1',
`created_date` timestamp NULL DEFAULT NULL,
PRIMARY KEY (`vocabulary_view_id`),
KEY `fk_vocabulary_view_user` (`user_id`),
KEY `fk_vocabulary_view_vocabulary` (`vocabulary_id`),
CONSTRAINT `fk_vocabulary_view_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
CONSTRAINT `fk_vocabulary_view_vocabulary` FOREIGN KEY (`vocabulary_id`) REFERENCES `vocabulary` (`vocabulary_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `vocabulary_view`
--

LOCK TABLES `vocabulary_view` WRITE;
/_!40000 ALTER TABLE `vocabulary_view` DISABLE KEYS _/;
/_!40000 ALTER TABLE `vocabulary_view` ENABLE KEYS _/;
UNLOCK TABLES;
/_!40103 SET TIME_ZONE=@OLD_TIME_ZONE _/;

/_!40101 SET SQL_MODE=@OLD_SQL_MODE _/;
/_!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS _/;
/_!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS _/;
/_!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT _/;
/_!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS _/;
/_!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION _/;
/_!40111 SET SQL_NOTES=@OLD_SQL_NOTES _/;

-- Dump completed on 2026-01-29 8:05:37

/*
SQLyog Community v13.1.9 (64 bit)
MySQL - 10.4.25-MariaDB : Database - db_seton
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`db_seton` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `db_seton`;

/*Table structure for table `attachments` */

DROP TABLE IF EXISTS `attachments`;

CREATE TABLE `attachments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `upload_time` datetime NOT NULL DEFAULT current_timestamp(),
  `task_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  CONSTRAINT `attachments_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `attachments` */

/*Table structure for table `checklists` */

DROP TABLE IF EXISTS `checklists`;

CREATE TABLE `checklists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `is_checked` int(1) NOT NULL DEFAULT 0 COMMENT '0 = not checked, 1 = checked',
  `task_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  CONSTRAINT `checklists_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

/*Data for the table `checklists` */
INSERT INTO `checklists`(`id`,`title`,`is_checked`,`task_id`) VALUES 
(1, 'User Model', 1, 1),
(2, 'Project Model', 1, 1),
(3, 'Task Model', 1, 1),
(4, 'Subtask Model', 0, 1),
(5, 'Setup Schema', 0, 4),
(6, 'Create ERD', 1, 4),
(7, 'Design Home Page', 0, 5),
(8, 'Design Login Page', 0, 5),
(9, 'Implement Login', 0, 6),
(10, 'Implement Registration', 0, 6),
(11, 'Connect to External API', 0, 7),
(12, 'Parse API Response', 0, 7),
(13, 'Create Homepage Component', 0, 8),
(14, 'Create Dashboard Component', 0, 8),
(15, 'Setup Server', 1, 9),
(16, 'Create REST Endpoints', 0, 9),
(17, 'Write Unit Tests', 0, 10),
(18, 'Conduct Integration Tests', 0, 10),
(19, 'Setup CI/CD', 0, 11),
(20, 'Deploy to Production', 0, 11),
(21, 'Prepare Training Materials', 0, 12),
(22, 'Schedule Training Sessions', 0, 12),
(23, 'Create Feedback Form', 0, 13),
(24, 'Analyze Feedback', 0, 13);

/*Table structure for table `comments` */

DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` text NOT NULL,
  `time` datetime NOT NULL DEFAULT current_timestamp(),
  `user_email` varchar(255) NOT NULL,
  `task_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_email` (`user_email`),
  KEY `task_id` (`task_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_email`) REFERENCES `users` (`email`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `comments` */
INSERT INTO `comments`(`id`,`value`,`time`,`user_email`,`task_id`) VALUES
(1, 'Great progress on the models!', '2024-05-14 10:00:00', 'jessica.s21@mhs.istts.ac.id', 1),
(2, 'Need to review the CRUD commands.', '2024-05-14 12:00:00', 'febrian.a21@mhs.istts.ac.id', 2),
(3, 'Middleware implementation is pending.', '2024-05-15 09:00:00', 'ivan.s21@mhs.istts.ac.id', 3),
(4, 'Database schema needs some changes.', '2024-05-15 11:00:00', 'john.doe21@gmail.com', 4),
(5, 'UI design is coming along nicely.', '2024-05-16 14:00:00', 'jane.doe21@gmail.com', 5),
(6, 'Authentication module is ready for review.', '2024-05-17 16:00:00', 'michael.smith21@yahoo.com', 6),
(7, 'API integration needs more testing.', '2024-05-18 18:00:00', 'susan.jones21@gmail.com', 7),
(8, 'Frontend components are looking good.', '2024-05-19 20:00:00', 'robert.brown21@yahoo.com', 8),
(9, 'Backend services are almost done.', '2024-05-20 22:00:00', 'linda.davis21@gmail.com', 9),
(10, 'Testing phase has started.', '2024-05-21 08:00:00', 'david.miller21@yahoo.com', 10),
(11, 'Deployment scheduled for tomorrow.', '2024-05-22 10:00:00', 'barbara.wilson21@gmail.com', 11),
(12, 'Training materials are ready.', '2024-05-23 12:00:00', 'james.moore21@gmail.com', 12),
(13, 'User feedback is positive.', '2024-05-24 14:00:00', 'patricia.taylor21@gmail.com', 13);

/*Table structure for table `labels` */

DROP TABLE IF EXISTS `labels`;

CREATE TABLE `labels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `color` varchar(7) NOT NULL COMMENT 'hex code di json',
  `task_id` int(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  CONSTRAINT `labels_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

/*Data for the table `labels` */
INSERT INTO `labels`(`id`,`title`,`color`,`task_id`) VALUES 
(1, 'Database', '0E9794', 1),
(2, 'Coding', '008FAE', 1),
(3, 'Models', '0C81BD', 2),
(4, 'Design', '666EB7', 5),
(5, 'Setup', '965599', 4),
(6, 'Authentication', 'AD3F6B', 6),
(7, 'API', '0E9794', 7),
(8, 'Frontend', '008FAE', 8),
(9, 'Backend', '0C81BD', 9),
(10, 'Testing', '666EB7', 10),
(11, 'Deployment', '965599', 11),
(12, 'Training', 'AD3F6B', 12),
(13, 'Feedback', '0E9794', 13);

/*Table structure for table `project_members` */

DROP TABLE IF EXISTS `project_members`;

CREATE TABLE `project_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `member_email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `member_email` (`member_email`),
  CONSTRAINT `project_members_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `project_members_ibfk_2` FOREIGN KEY (`member_email`) REFERENCES `users` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

/*Data for the table `project_members` */
INSERT INTO `project_members`(`id`,`project_id`,`member_email`) VALUES 
(1, 1, 'febrian.a21@mhs.istts.ac.id'),
(2, 2, 'ivan.s21@mhs.istts.ac.id'),
(3, 1, 'jessica.s21@mhs.istts.ac.id'),
(4, 1, 'christopher.ach21@mhs.istts.ac.id'),
(5, 2, 'john.doe21@gmail.com'),
(6, 3, 'jane.doe21@gmail.com'),
(7, 3, 'michael.smith21@yahoo.com'),
(8, 4, 'susan.jones21@gmail.com'),
(9, 4, 'robert.brown21@yahoo.com'),
(10, 5, 'linda.davis21@gmail.com'),
(11, 5, 'david.miller21@yahoo.com'),
(12, 6, 'barbara.wilson21@gmail.com'),
(13, 6, 'james.moore21@gmail.com'),
(14, 7, 'patricia.taylor21@gmail.com'),
(15, 7, 'christopher.ach21@mhs.istts.ac.id'),
(16, 8, 'febrian.a21@mhs.istts.ac.id'),
(17, 8, 'ivan.s21@mhs.istts.ac.id'),
(18, 9, 'jessica.s21@mhs.istts.ac.id'),
(19, 9, 'john.doe21@gmail.com'),
(20, 10, 'jane.doe21@gmail.com');

/*Table structure for table `projects` */

DROP TABLE IF EXISTS `projects`;

CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `start` datetime NOT NULL,
  `deadline` datetime NOT NULL,
  `pm_email` varchar(255) NOT NULL,
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '0 = ongoing, 1 = completed',
  PRIMARY KEY (`id`),
  KEY `pm_email` (`pm_email`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`pm_email`) REFERENCES `users` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*Data for the table `projects` */
INSERT INTO `projects`(`id`,`name`,`description`,`start`,`deadline`,`pm_email`,`status`) VALUES 
(1, 'Project Management Web App', 'Aplikasi web manajemen proyek adalah platform yang dirancang untuk membantu tim dan individu mengelola proyek-proyek mereka dengan lebih efisien.', '2024-05-10 00:00:00', '2024-05-24 23:59:59', 'ivan.s21@mhs.istts.ac.id', 0),
(2, 'HR Assessment Website', 'Develop a website to access HR competence', '2024-05-22 00:00:00', '2024-05-31 23:59:59', 'febrian.a21@mhs.istts.ac.id', 0),
(3, 'E-commerce Platform', 'Building an e-commerce platform for online shopping.', '2024-06-01 00:00:00', '2024-06-15 23:59:59', 'john.doe21@gmail.com', 0),
(4, 'Social Media Analytics', 'Developing a tool to analyze social media trends.', '2024-06-05 00:00:00', '2024-06-20 23:59:59', 'jane.doe21@gmail.com', 0),
(5, 'Inventory Management System', 'Creating a system to manage inventory for retail stores.', '2024-06-10 00:00:00', '2024-06-25 23:59:59', 'michael.smith21@yahoo.com', 0),
(6, 'Online Learning Platform', 'Developing a platform for online courses and learning.', '2024-06-12 00:00:00', '2024-06-30 23:59:59', 'susan.jones21@gmail.com', 0),
(7, 'Healthcare Management System', 'Building a management system for healthcare facilities.', '2024-06-15 00:00:00', '2024-07-01 23:59:59', 'robert.brown21@yahoo.com', 0),
(8, 'Travel Booking Website', 'Creating a website for booking travel and accommodations.', '2024-06-18 00:00:00', '2024-07-05 23:59:59', 'linda.davis21@gmail.com', 0),
(9, 'Real Estate Listing Platform', 'Developing a platform for real estate listings and sales.', '2024-06-20 00:00:00', '2024-07-10 23:59:59', 'david.miller21@yahoo.com', 0),
(10, 'Fitness Tracking App', 'Building a mobile app for tracking fitness activities.', '2024-06-22 00:00:00', '2024-07-15 23:59:59', 'barbara.wilson21@gmail.com', 0);

/*Table structure for table `task_teams` */

DROP TABLE IF EXISTS `task_teams`;

CREATE TABLE `task_teams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) NOT NULL,
  `team_email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  KEY `team_email` (`team_email`),
  CONSTRAINT `task_teams_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`),
  CONSTRAINT `task_teams_ibfk_2` FOREIGN KEY (`team_email`) REFERENCES `users` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*Data for the table `task_teams` */
INSERT INTO `task_teams`(`id`,`task_id`,`team_email`) VALUES 
(1, 1, 'jessica.s21@mhs.istts.ac.id'),
(2, 1, 'febrian.a21@mhs.istts.ac.id'),
(3, 3, 'ivan.s21@mhs.istts.ac.id'),
(4, 2, 'christopher.ach21@mhs.istts.ac.id'),
(5, 4, 'jessica.s21@mhs.istts.ac.id'),
(6, 5, 'febrian.a21@mhs.istts.ac.id'),
(7, 6, 'john.doe21@gmail.com'),
(8, 7, 'jane.doe21@gmail.com'),
(9, 8, 'michael.smith21@yahoo.com'),
(10, 9, 'susan.jones21@gmail.com'),
(11, 10, 'robert.brown21@yahoo.com'),
(12, 11, 'linda.davis21@gmail.com'),
(13, 12, 'david.miller21@yahoo.com'),
(14, 13, 'barbara.wilson21@gmail.com'),
(15, 1, 'patricia.taylor21@gmail.com'),
(16, 2, 'james.moore21@gmail.com'),
(17, 3, 'linda.davis21@gmail.com'),
(18, 4, 'barbara.wilson21@gmail.com'),
(19, 5, 'john.doe21@gmail.com'),
(20, 6, 'jane.doe21@gmail.com');

/*Table structure for table `tasks` */

DROP TABLE IF EXISTS `tasks`;

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `deadline` datetime NOT NULL,
  `description` text NOT NULL,
  `priority` int(1) NOT NULL COMMENT '0 = low, 1 = medium, 2 = high',
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '0 = upcoming, 1 = ongoing, 2 = submitted, 3 = revision, 4 = completed',
  `pic_email` varchar(255) NOT NULL,
  `project_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pic_email` (`pic_email`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`pic_email`) REFERENCES `users` (`email`),
  CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

/*Data for the table `tasks` */
INSERT INTO `tasks`(`id`,`title`,`deadline`,`description`,`priority`,`status`,`pic_email`,`project_id`) VALUES 
(1, 'Create Models', '2024-05-17 23:59:59', 'Create All Models of Backend', 2, 1, 'ivan.s21@mhs.istts.ac.id', 1),
(2, 'CRUD Tasks', '2024-05-15 23:59:59', 'Make All CRUD Command For User', 2, 1, 'febrian.a21@mhs.istts.ac.id', 1),
(3, 'Create Middleware', '2024-05-16 23:59:59', 'Create All Middleware', 1, 0, 'febrian.a21@mhs.istts.ac.id', 2),
(4, 'Setup Database', '2024-05-18 23:59:59', 'Setup the initial database schema', 3, 4, 'john.doe21@gmail.com', 1),
(5, 'Design UI', '2024-05-19 23:59:59', 'Create the initial UI design', 2, 3, 'jane.doe21@gmail.com', 2),
(6, 'Create Authentication', '2024-05-20 23:59:59', 'Develop authentication and authorization', 2, 0, 'michael.smith21@yahoo.com', 3),
(7, 'API Integration', '2024-05-21 23:59:59', 'Integrate external APIs', 3, 2, 'susan.jones21@gmail.com', 4),
(8, 'Frontend Development', '2024-05-22 23:59:59', 'Build the frontend components', 2, 0, 'robert.brown21@yahoo.com', 5),
(9, 'Backend Development', '2024-05-23 23:59:59', 'Develop backend services', 2, 2, 'linda.davis21@gmail.com', 6),
(10, 'Testing & QA', '2024-05-24 23:59:59', 'Perform testing and quality assurance', 1, 0, 'david.miller21@yahoo.com', 7),
(11, 'Deployment', '2024-05-25 23:59:59', 'Deploy the application to production', 1, 3, 'barbara.wilson21@gmail.com', 8),
(12, 'User Training', '2024-05-26 23:59:59', 'Conduct user training sessions', 2, 3, 'james.moore21@gmail.com', 9),
(13, 'Collect Feedback', '2024-05-27 23:59:59', 'Collect feedback from users', 3, 1, 'patricia.taylor21@gmail.com', 10);

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL COMMENT 'null = google auth',
  `auth_token` varchar(255) DEFAULT NULL,
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '0 = non aktif / non verified, 1 = aktif',
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `users` */
INSERT INTO `users`(`email`,`name`,`profile_picture`,`password`,`auth_token`,`status`) VALUES 
('christopher.ach21@mhs.istts.ac.id','Christopher Alfonsius Calvin Harsono',NULL,'$2b$10$fXpnfTai3rCvaG89hMCJ1.N8CFKk8Qa4XKefwm8HgkPrzB6CRNgAO',NULL,1),
('febrian.a21@mhs.istts.ac.id','Febrian Alexandro',NULL,'$2b$12$MgmRThnd4zyZT.hpQYZulOPheAL6y/uRGpXOLjWX2KSZzxlgCBRfe',NULL,1),
('ivan.s21@mhs.istts.ac.id','Ivan Susanto',NULL,'$2b$10$longOCZ.G5KJdHJiyXkaBO7kaW.DqrqJUWmy8mYcfDKCB6RHFEk5q',NULL,1),
('jessica.s21@mhs.istts.ac.id','Jessica Susanto',NULL,'$2b$12$6Fik40h0ep7doKZFg9R73.gdgoNnj6EzBtQnCpb5cuHyuMeN5muLm',NULL,1),
('john.doe21@gmail.com', 'John Doe', NULL, '$2b$12$6Fik40h0ep7doKZFg9R73.gdgoNnj6EzBtQnCpb5cuHyuMeN5muLm', NULL, 1),
('jane.doe21@gmail.com', 'Jane Doe', NULL, '$2b$12$6Fik40h0ep7doKZFg9R73.gdgoNnj6EzBtQnCpb5cuHyuMeN5muLm', NULL, 0),
('michael.smith21@yahoo.com', 'Michael Smith', NULL, '$2b$12$6Fik40h0ep7doKZFg9R73.gdgoNnj6EzBtQnCpb5cuHyuMeN5muLm', NULL, 1),
('susan.jones21@gmail.com', 'Susan Jones', NULL, '$2b$12$6Fik40h0ep7doKZFg9R73.gdgoNnj6EzBtQnCpb5cuHyuMeN5muLm', NULL, 0),
('robert.brown21@yahoo.com', 'Robert Brown', NULL, '$2b$12$6Fik40h0ep7doKZFg9R73.gdgoNnj6EzBtQnCpb5cuHyuMeN5muLm', NULL, 1),
('linda.davis21@gmail.com', 'Linda Davis', NULL, '$2b$12$6Fik40h0ep7doKZFg9R73.gdgoNnj6EzBtQnCpb5cuHyuMeN5muLm', NULL, 1),
('david.miller21@yahoo.com', 'David Miller', NULL, '$2b$10$VL6JXfLHC3h1BvV9Ho.bDOjb/JmRh5zGq8htO64jT7xQiH8YZQysS', NULL, 0),
('barbara.wilson21@gmail.com', 'Barbara Wilson', NULL, '$2b$12$6Fik40h0ep7doKZFg9R73.gdgoNnj6EzBtQnCpb5cuHyuMeN5muLm', NULL, 1),
('james.moore21@gmail.com', 'James Moore', NULL, '$2b$12$6Fik40h0ep7doKZFg9R73.gdgoNnj6EzBtQnCpb5cuHyuMeN5muLm', NULL, 1),
('patricia.taylor21@gmail.com', 'Patricia Taylor', NULL, '$2b$12$6Fik40h0ep7doKZFg9R73.gdgoNnj6EzBtQnCpb5cuHyuMeN5muLm', NULL, 1);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

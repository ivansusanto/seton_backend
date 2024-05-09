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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `checklists` */

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `labels` */

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

insert  into `project_members`(`id`,`project_id`,`member_email`) values 
(1,1,'febrian.a21@mhs.istts.ac.id'),
(2,2,'ivan.s21@mhs.istts.ac.id'),
(3,1,'jessica.s21@mhs.istts.ac.id'),
(4,1,'christopher.ach21@mhs.istts.ac.id');

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

insert  into `projects`(`id`,`name`,`description`,`start`,`deadline`,`pm_email`,`status`) values 
(1,'Project Management Web App','Aplikasi web manajemen proyek adalah platform yang dirancang untuk membantu tim dan individu mengelola proyek-proyek mereka dengan lebih efisien.','2024-05-10 00:00:00','2024-05-24 23:59:59','ivan.s21@mhs.istts.ac.id',0),
(2,'HR Assessment Website','Develop a website to access HR competence','2024-05-22 00:00:00','2024-05-31 23:59:59','febrian.a21@mhs.istts.ac.id',0);

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

insert  into `task_teams`(`id`,`task_id`,`team_email`) values 
(1,1,'jessica.s21@mhs.istts.ac.id'),
(2,1,'febrian.a21@mhs.istts.ac.id'),
(3,3,'ivan.s21@mhs.istts.ac.id'),
(4,2,'christopher.ach21@mhs.istts.ac.id');

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

insert  into `tasks`(`id`,`title`,`deadline`,`description`,`priority`,`status`,`pic_email`,`project_id`) values 
(1,'Create Models','2024-05-17 23:59:59','Create All Models of Backend',2,1,'ivan.s21@mhs.istts.ac.id',1),
(2,'CRUD Tasks','2024-05-15 23:59:59','Make All CRUD Command For User',2,1,'febrian.a21@mhs.istts.ac.id',1),
(3,'Create Middleware','2024-05-16 23:59:59','Create All Middleware',1,0,'febrian.a21@mhs.istts.ac.id',2);

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

insert  into `users`(`email`,`name`,`profile_picture`,`password`,`auth_token`,`status`) values 
('christopher.ach21@mhs.istts.ac.id','Christopher Alfonsius Calvin Harsono',NULL,'$2b$10$fXpnfTai3rCvaG89hMCJ1.N8CFKk8Qa4XKefwm8HgkPrzB6CRNgAO',NULL,1),
('febrian.a21@mhs.istts.ac.id','Febrian Alexandro',NULL,'$2b$12$MgmRThnd4zyZT.hpQYZulOPheAL6y/uRGpXOLjWX2KSZzxlgCBRfe',NULL,1),
('ivan.s21@mhs.istts.ac.id','Ivan Susanto',NULL,'$2b$10$longOCZ.G5KJdHJiyXkaBO7kaW.DqrqJUWmy8mYcfDKCB6RHFEk5q',NULL,1),
('jessica.s21@mhs.istts.ac.id','Jessica Susanto',NULL,'$2b$12$6Fik40h0ep7doKZFg9R73.gdgoNnj6EzBtQnCpb5cuHyuMeN5muLm',NULL,1);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

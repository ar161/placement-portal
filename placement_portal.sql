-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Jul 31, 2024 at 04:43 PM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 8.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `placement_portal`
--

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `drive_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `date_applied` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `drives`
--

CREATE TABLE `drives` (
  `drive_id` int(11) NOT NULL,
  `company_name` varchar(100) NOT NULL,
  `batch` int(11) DEFAULT NULL,
  `eligibility_10th` double DEFAULT NULL,
  `eligibility_12th` double DEFAULT NULL,
  `eligibility_cgpa` double DEFAULT NULL,
  `package_type` enum('fix','range') DEFAULT NULL,
  `package_amount` varchar(100) DEFAULT NULL,
  `bond` int(11) DEFAULT NULL,
  `date_of_drive` date DEFAULT NULL,
  `application_deadline` date DEFAULT NULL,
  `job_location` varchar(255) DEFAULT NULL,
  `job_role` varchar(255) DEFAULT NULL,
  `job_description` text DEFAULT NULL,
  `drive_result_declared` tinyint(1) DEFAULT 0,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `drive_for`
--

CREATE TABLE `drive_for` (
  `drive_id` int(11) NOT NULL,
  `program_id` int(11) NOT NULL,
  `stream_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `placed`
--

CREATE TABLE `placed` (
  `drive_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `placement_officers`
--

CREATE TABLE `placement_officers` (
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contact_no` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `programs`
--

CREATE TABLE `programs` (
  `program_id` int(11) NOT NULL,
  `program_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `rounds`
--

CREATE TABLE `rounds` (
  `round_id` int(11) NOT NULL,
  `drive_id` int(11) DEFAULT NULL,
  `round_name` varchar(200) DEFAULT NULL,
  `round_description` text DEFAULT NULL,
  `round_date` date DEFAULT NULL,
  `round_result_declared` tinyint(1) DEFAULT 0,
  `drive_round_sequence` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `selected`
--

CREATE TABLE `selected` (
  `drive_id` int(11) NOT NULL,
  `round_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `streams`
--

CREATE TABLE `streams` (
  `stream_id` int(11) NOT NULL,
  `stream_name` varchar(50) NOT NULL,
  `program_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `student_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `program_id` int(11) DEFAULT NULL,
  `stream_id` int(11) DEFAULT NULL,
  `batch` year(4) DEFAULT NULL,
  `cgpa` double DEFAULT NULL,
  `backlogs` int(11) DEFAULT NULL,
  `tenth_percent` double DEFAULT NULL,
  `twelth_percent` double DEFAULT NULL,
  `is_master` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`drive_id`,`student_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `drives`
--
ALTER TABLE `drives`
  ADD PRIMARY KEY (`drive_id`);

--
-- Indexes for table `drive_for`
--
ALTER TABLE `drive_for`
  ADD PRIMARY KEY (`drive_id`,`program_id`,`stream_id`),
  ADD KEY `program_id` (`program_id`),
  ADD KEY `stream_id` (`stream_id`);

--
-- Indexes for table `placed`
--
ALTER TABLE `placed`
  ADD PRIMARY KEY (`drive_id`,`student_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `placement_officers`
--
ALTER TABLE `placement_officers`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `programs`
--
ALTER TABLE `programs`
  ADD PRIMARY KEY (`program_id`),
  ADD UNIQUE KEY `program_name` (`program_name`);

--
-- Indexes for table `rounds`
--
ALTER TABLE `rounds`
  ADD PRIMARY KEY (`round_id`),
  ADD KEY `drive_id` (`drive_id`);

--
-- Indexes for table `selected`
--
ALTER TABLE `selected`
  ADD PRIMARY KEY (`drive_id`,`round_id`,`student_id`),
  ADD KEY `round_id` (`round_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `streams`
--
ALTER TABLE `streams`
  ADD PRIMARY KEY (`stream_id`),
  ADD KEY `program_id` (`program_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `fk_program_id` (`program_id`),
  ADD KEY `fk_stream_id` (`stream_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `drives`
--
ALTER TABLE `drives`
  MODIFY `drive_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `placement_officers`
--
ALTER TABLE `placement_officers`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `programs`
--
ALTER TABLE `programs`
  MODIFY `program_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rounds`
--
ALTER TABLE `rounds`
  MODIFY `round_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `streams`
--
ALTER TABLE `streams`
  MODIFY `stream_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`drive_id`) REFERENCES `drives` (`drive_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE;

--
-- Constraints for table `drive_for`
--
ALTER TABLE `drive_for`
  ADD CONSTRAINT `drive_for_ibfk_1` FOREIGN KEY (`drive_id`) REFERENCES `drives` (`drive_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `drive_for_ibfk_2` FOREIGN KEY (`program_id`) REFERENCES `programs` (`program_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `drive_for_ibfk_3` FOREIGN KEY (`stream_id`) REFERENCES `streams` (`stream_id`) ON DELETE CASCADE;

--
-- Constraints for table `placed`
--
ALTER TABLE `placed`
  ADD CONSTRAINT `placed_ibfk_1` FOREIGN KEY (`drive_id`) REFERENCES `drives` (`drive_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `placed_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE;

--
-- Constraints for table `placement_officers`
--
ALTER TABLE `placement_officers`
  ADD CONSTRAINT `fk_user_placement_officer` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `placement_officers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `rounds`
--
ALTER TABLE `rounds`
  ADD CONSTRAINT `rounds_ibfk_1` FOREIGN KEY (`drive_id`) REFERENCES `drives` (`drive_id`) ON DELETE CASCADE;

--
-- Constraints for table `selected`
--
ALTER TABLE `selected`
  ADD CONSTRAINT `selected_ibfk_1` FOREIGN KEY (`drive_id`) REFERENCES `drives` (`drive_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `selected_ibfk_2` FOREIGN KEY (`round_id`) REFERENCES `rounds` (`round_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `selected_ibfk_3` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE;

--
-- Constraints for table `streams`
--
ALTER TABLE `streams`
  ADD CONSTRAINT `streams_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`program_id`) ON DELETE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `fk_program_id` FOREIGN KEY (`program_id`) REFERENCES `programs` (`program_id`),
  ADD CONSTRAINT `fk_stream_id` FOREIGN KEY (`stream_id`) REFERENCES `streams` (`stream_id`),
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

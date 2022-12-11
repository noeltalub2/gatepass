-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 11, 2022 at 06:20 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gatepass`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `firstname`, `lastname`, `email`, `username`, `password`) VALUES
(1, 'Noel Michael', 'Talub', 'admin@gmail.com', 'admin', '$2b$15$OYnJjzYx1uqEc6OkzcwP8uLWNNxG17nxMblu9Ux4sFLikq1Ta8C1u');

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `course_id` varchar(45) NOT NULL,
  `course_name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`course_id`, `course_name`) VALUES
('BAT', 'Bachelor in Automotive Technology'),
('CADT', 'BSIT in Civil & Drafting Technology'),
('CMPT', 'BSIT in Computer Technology'),
('ELTR', 'BSIT in Electrical Technology'),
('EXTR', 'BSIT in Electronics Technology'),
('FPSM', 'BSIT in Food Processing & Service Mgt'),
('GT', 'BSIT in Garments Technology');

-- --------------------------------------------------------

--
-- Table structure for table `faculty`
--

CREATE TABLE `faculty` (
  `faculty_id` int(11) NOT NULL,
  `email` varchar(45) NOT NULL,
  `phonenumber` varchar(45) NOT NULL,
  `firstname` varchar(45) NOT NULL,
  `lastname` varchar(45) NOT NULL,
  `avatar` varchar(45) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `faculty`
--

INSERT INTO `faculty` (`faculty_id`, `email`, `phonenumber`, `firstname`, `lastname`, `avatar`, `password`) VALUES
(1, 'faculty@gmail.com', '09166666666', 'Noel', 'Talub', 'default.png', '$2b$15$7qWSonvDnZV5JUy5Ox4axevuRnHVejMmH6i6er2Rhu0GwfOT/Q9RO'),
(2, 'alyssaaoalin@gmail.com', '09663876812', 'Alyssa', 'Aoalin', 'default.png', '$2b$15$4Y6JanSXI6rmmxgmjJFaKu/5xOAAVyg6EMcLphu8rvZ5K5Oee7jWO');

-- --------------------------------------------------------

--
-- Table structure for table `gatepass`
--

CREATE TABLE `gatepass` (
  `gatepass_id` int(45) NOT NULL,
  `gatepass_ref` varchar(45) NOT NULL,
  `studentnumber` varchar(11) NOT NULL,
  `submit_date` varchar(45) NOT NULL,
  `modified_date` varchar(45) DEFAULT NULL,
  `status` varchar(10) NOT NULL,
  `fever` varchar(5) NOT NULL,
  `cough` varchar(5) NOT NULL,
  `cold` varchar(5) NOT NULL,
  `no_sense_smell` varchar(5) NOT NULL,
  `diarrhea` varchar(5) NOT NULL,
  `sore_throat` varchar(5) NOT NULL,
  `difficult_breath` varchar(5) NOT NULL,
  `muscle_joint_pain` varchar(5) NOT NULL,
  `travel_history` varchar(5) NOT NULL,
  `visit_other_place` varchar(5) NOT NULL,
  `exposure_anyone` varchar(5) NOT NULL,
  `takecare_people` varchar(5) NOT NULL,
  `monitor_by_personnel` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `gatepass`
--

INSERT INTO `gatepass` (`gatepass_id`, `gatepass_ref`, `studentnumber`, `submit_date`, `modified_date`, `status`, `fever`, `cough`, `cold`, `no_sense_smell`, `diarrhea`, `sore_throat`, `difficult_breath`, `muscle_joint_pain`, `travel_history`, `visit_other_place`, `exposure_anyone`, `takecare_people`, `monitor_by_personnel`) VALUES
(1, 'GcuqvNUh', '19-070228', '12/9/2022, 12:04:22 AM', '12/11/2022, 1:03:06 PM', 'Approved', 'Yes', 'No', 'No', 'No', 'Yes', 'No', 'No', 'No', 'No', 'No', 'Yes', 'No', 'Yes'),
(2, '4Wl515ir', '19-070140', '12/9/2022, 10:34:32 AM', '12/11/2022, 1:00:37 PM', 'Approved', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No'),
(3, '6-FjbfaN', '19-070162', '12/9/2022, 10:41:53 AM', '12/9/2022, 10:50:03 AM', 'Approved', 'Yes', 'Yes', 'Yes', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No'),
(4, '9V5N4BcX', '19-070314', '12/9/2022, 10:46:14 AM', '12/9/2022, 10:49:28 AM', 'Approved', 'No', 'No', 'No', 'No', 'No', 'Yes', 'No', 'No', 'YES', 'Yes', 'No', 'No', 'No'),
(5, 'jJ4bF-fM', '20-070104', '12/9/2022, 11:05:05 AM', '12/9/2022, 11:42:38 AM', 'Approved', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No'),
(6, 'NMTFns7v', '20-070372', '12/9/2022, 11:09:07 AM', '12/9/2022, 11:09:21 AM', 'Approved', 'Yes', 'No', 'Yes', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No'),
(7, 'JDF6oORY', '19-070013', '12/9/2022, 11:26:12 AM', '12/9/2022, 11:26:56 AM', 'Approved', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No'),
(8, 'Oakxkc69', '19-070012', '12/9/2022, 11:29:29 AM', '12/9/2022, 11:30:07 AM', 'Approved', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No'),
(9, 'gmF-Uw4H', '19-070026', '12/9/2022, 11:29:34 AM', '12/9/2022, 11:32:00 AM', 'Approved', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No'),
(10, 'dU8-6pp9', '19-070319', '12/9/2022, 11:32:55 AM', '12/9/2022, 11:34:11 AM', 'Approved', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No'),
(11, 'ZCnXPeDR', '19-070325', '12/9/2022, 11:38:45 AM', '12/9/2022, 11:42:14 AM', 'Approved', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No'),
(12, 'nTYq_uI1', '19-070083', '12/9/2022, 11:52:47 AM', '12/9/2022, 11:53:14 AM', 'Approved', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No'),
(13, 'TqbmRLzn', '19-070062', '12/9/2022, 11:54:25 AM', '12/9/2022, 11:55:24 AM', 'Approved', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No'),
(17, '9UwtsMYg', '19-070228', '12/11/2022 12:21:10 PM', '12/11/2022, 12:38:54 PM', 'Approved', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'No', 'No', 'No', 'Yes', 'Yes');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `id` int(11) NOT NULL,
  `studentnumber` varchar(15) NOT NULL,
  `firstname` varchar(45) NOT NULL,
  `lastname` varchar(45) NOT NULL,
  `gender` varchar(12) DEFAULT NULL,
  `dob` varchar(12) DEFAULT NULL,
  `course` varchar(45) NOT NULL,
  `year` varchar(1) DEFAULT NULL,
  `section` varchar(1) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `phonenumber` varchar(11) NOT NULL,
  `avatar` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `complete_details` tinyint(3) NOT NULL,
  `is_verified` tinyint(3) NOT NULL,
  `join_date` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`id`, `studentnumber`, `firstname`, `lastname`, `gender`, `dob`, `course`, `year`, `section`, `address`, `email`, `phonenumber`, `avatar`, `password`, `complete_details`, `is_verified`, `join_date`) VALUES
(1, '19-070228', 'Noel Michael', 'Talub', 'Male', '', 'CMPT', '1', 'A', '', 'jmtalub15@gmail.com', '09690152632', 'default.png', '$2b$15$cjTvlcoMNuEjveQ7UsTpTufBhAvw4.oEKkJvC9JWzZarKH2edmd3u', 0, 1, '12/8/2022, 11:17:16 PM'),
(2, '19-070227', 'Mika', 'Talub', '', NULL, 'CMPT', NULL, NULL, NULL, 'jmtalub152@gmail.com', '09162626262', 'default.png', '$2b$15$fngAkk0nFUskjYihaXk5Yu8rnYwsXwsFDX.0sxtTDBuAXbIUEfE16', 0, 0, '12/9/2022, 9:35:14 AM'),
(3, '19-070140', 'Jade Monica ', 'Simon', 'Male', '2000-10-27', 'CMPT', '1', 'A', 'Bray. San Marcelino, Dingras, Ilocos NorteOvtober', 'jadonicaganosimon@gmail.com', '09272805507', 'default.png', '$2b$15$rDBg7VGc/yLBZT42/JU5kuVAGw.eCKZ1IRPN11xsJazFu25d7QU2u', 1, 0, '12/9/2022, 10:33:01 AM'),
(4, '19-070162', 'John Kenneth', 'Vocal', '', NULL, 'CMPT', NULL, NULL, NULL, 'johnkennethvocal1202@gmail.com', '09663268912', 'default.png', '$2b$15$u9eta9RjLFqd5PvfQ7WB1.I7HIC8j6qWWFAQZlw1idkPvCGS3PkNm', 0, 0, '12/9/2022, 10:39:50 AM'),
(5, '19-070314', 'James', 'Anteola', '', NULL, 'CMPT', NULL, NULL, NULL, 'james@gmail', '09482033333', '1670553921880.jpg', '$2b$15$I.Ny2N0LI.Jpv80ODYSMLuJ/qx2Aq78w674b/PqsnC..SNy.d77EC', 0, 0, '12/9/2022, 10:43:36 AM'),
(6, '20-070371', 'Jhay', 'Zutziki', '', NULL, 'CMPT', NULL, NULL, NULL, 'iamjhay2002@gmail.com', '12345678910', 'default.png', '$2b$15$6g5Y5D2L/LWDB5OVHVR60OSZkYx5tmWybZ9s8u9HKLpel4NGqUsU6', 0, 0, '12/9/2022, 11:00:37 AM'),
(7, '20-070104', 'Marie Claire', 'Riguis', '', NULL, 'CMPT', NULL, NULL, NULL, 'riguisclaire9@gmail.com', '09275219739', 'default.png', '$2b$15$1BoGZB/j24/yZ25FExtYS.V5yAhy4ihq3FENIq481MlDg6LwaKDnm', 0, 0, '12/9/2022, 11:01:52 AM'),
(8, '20-070007', 'Carla', 'Aquino', '', NULL, 'CMPT', NULL, NULL, NULL, 'aquinocarla41@gmail.com', '09384564813', 'default.png', '$2b$15$uDnyd34IJJ9SlcvkQrSwzeumef6k49IbPBvCzqtMJigX96UaLqarW', 0, 0, '12/9/2022, 11:01:58 AM'),
(11, '20-070372', 'Jhay', 'Vin', 'Male', '2002-01-08', 'CMPT', '3', 'A', 'Brgy 21, San Nicolas', 'iamjhay@gmail.com', '12345678911', '1670555420060.jpg', '$2b$15$n4skN4JXRQD04R.0PPeVz.O9d1n2RHkwB3OoQLJILa/raUCtJHlHa', 1, 1, '12/9/2022, 11:06:30 AM'),
(12, '19-070013', 'Vhaneza', 'Solsoloy', 'Male', '2001-05-23', 'EXTR', '4', 'A', 'Brgy 5 Davila, Pasuquin Ilocos Norte', 'vhaneza.solsoloy@gmail.com', '09462190906', '1670556327564.jpg', '$2b$15$Empw0LJCIMLYrbmT/Td.6.okLeuyDur5xpu816PF0hA9nHzrtJ5LO', 1, 1, '12/9/2022, 11:22:57 AM'),
(13, '19-070026', 'Gilmar', 'Alamon', 'Male', '2000-09-28', 'EXTR', '4', 'A', 'Brgy. #8 Bomitog, Banna, Ilocos Norte', 'gilmaralamon36@gmail.com', '09064807459', '1670556896375.jpeg', '$2b$15$lFm1yOuFHI9AH53VipfoAekNAV7iClmVa9uf9ttgI9xK1xUC0L05y', 1, 0, '12/9/2022, 11:24:51 AM'),
(14, '19-070012', 'Cedrick James', 'Putulan', 'Male', '2000-10-26', 'EXTR', '4', 'A', 'Davila,Pasuquin Ilocos Norte', 'putulancedrick@gmail.com', '09384565077', '1670556782864.jpg', '$2b$15$MWYR8JAOGvnpyxpYFNGmL.rrUbVzdMnPG9tbTB.UV6590kqh26nTu', 1, 1, '12/9/2022, 11:25:18 AM'),
(15, '19-070319', 'JEROME', 'BALLESTEROS ', 'Male', '2000-06-27', 'EXTR', '4', 'A', 'Brgy ligaya pagudpud ilocos norte', 'kingjeromelyray@gmail.com', '09954040566', '1670557262960.jpg', '$2b$15$.ZCCtxjOrxa/AfOsOLs/Q.WrXBXXI9i6mRsbGx9WQsmhbWJic1xUm', 1, 0, '12/9/2022, 11:29:58 AM'),
(16, '19-070325', 'Niño Kim', 'Azcueta', '', NULL, 'EXTR', NULL, NULL, NULL, 'azcueta01704n@gmail.com', '09307287635', 'default.png', '$2b$15$FPrJUeoCTPEZ4/unN0Ud5eg5oyeU1ehhlFMloKUBRLKFHMBNFZVi2', 0, 0, '12/9/2022, 11:34:03 AM'),
(17, '19-070083', 'Marlon', 'Cudal', '', NULL, 'BAT', NULL, NULL, NULL, 'marloncudal0@gmail.com', '09272289538', 'default.png', '$2b$15$6bpNn7NfgCIu/AeE5EohZeB6WJvpbubTaW5BDWkPUt/ym78f36di6', 0, 0, '12/9/2022, 11:50:45 AM'),
(18, '19-070062', 'John Marley', 'Balagso', '', NULL, 'BAT', NULL, NULL, NULL, 'balagsomarley@gmail.com', '09063168341', 'default.png', '$2b$15$T4Pp.p3ElGVyrxuSBuQive7vjnPyvw.LVI/PnrNInaPa8ASRiB5Vy', 0, 0, '12/9/2022, 11:51:25 AM');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD UNIQUE KEY `course_id` (`course_id`);

--
-- Indexes for table `faculty`
--
ALTER TABLE `faculty`
  ADD PRIMARY KEY (`faculty_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phonenumber`);

--
-- Indexes for table `gatepass`
--
ALTER TABLE `gatepass`
  ADD PRIMARY KEY (`gatepass_id`),
  ADD KEY `studentnumber` (`studentnumber`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `studentnumber` (`studentnumber`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phonenumber` (`phonenumber`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `faculty`
--
ALTER TABLE `faculty`
  MODIFY `faculty_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `gatepass`
--
ALTER TABLE `gatepass`
  MODIFY `gatepass_id` int(45) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `gatepass`
--
ALTER TABLE `gatepass`
  ADD CONSTRAINT `gatepass_ibfk_1` FOREIGN KEY (`studentnumber`) REFERENCES `student` (`studentnumber`);

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`course`) REFERENCES `course` (`course_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

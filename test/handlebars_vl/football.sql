-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 07, 2019 at 09:13 AM
-- Server version: 5.7.19
-- PHP Version: 7.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `football`
--

-- --------------------------------------------------------

--
-- Table structure for table `league_table`
--

DROP TABLE IF EXISTS `league_table`;
CREATE TABLE IF NOT EXISTS `league_table` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Played_games` int(11) NOT NULL,
  `Team_id` int(11) NOT NULL,
  `Won` int(11) NOT NULL,
  `Lost` int(11) NOT NULL,
  `Drawn` int(11) NOT NULL,
  `Goals_for` int(11) NOT NULL,
  `Goals_againts` int(11) NOT NULL,
  `Points` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `league_table`
--

INSERT INTO `league_table` (`Id`, `Played_games`, `Team_id`, `Won`, `Lost`, `Drawn`, `Goals_for`, `Goals_againts`, `Points`) VALUES
(1, 29, 1, 21, 3, 5, 55, 19, 68),
(2, 29, 2, 15, 6, 8, 37, 22, 53),
(3, 29, 3, 12, 5, 12, 45, 32, 48),
(4, 29, 4, 13, 9, 7, 47, 35, 46),
(5, 29, 5, 13, 9, 7, 41, 37, 46),
(6, 29, 6, 10, 8, 11, 35, 24, 41),
(7, 29, 12, 4, 19, 6, 25, 52, 18),
(8, 29, 10, 7, 16, 6, 32, 54, 27),
(9, 29, 11, 6, 15, 8, 30, 45, 26),
(10, 29, 9, 7, 15, 7, 25, 33, 28),
(11, 29, 7, 9, 12, 8, 32, 39, 35),
(12, 29, 8, 8, 8, 13, 32, 39, 35);

-- --------------------------------------------------------

--
-- Table structure for table `player`
--

DROP TABLE IF EXISTS `player`;
CREATE TABLE IF NOT EXISTS `player` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Lastname` varchar(30) NOT NULL,
  `Firstname` varchar(30) NOT NULL,
  `Number` int(11) NOT NULL,
  `Team_id` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `player`
--

INSERT INTO `player` (`Id`, `Lastname`, `Firstname`, `Number`, `Team_id`) VALUES
(1, 'Purje', 'Ats', 10, 4),
(2, 'Karjalainen', 'Rasmus', 7, 4),
(3, 'Riski', 'Riku', 9, 1),
(4, 'Pelvas', 'Akseli', 11, 1),
(5, 'Järvenpää', 'Lassi', 13, 2),
(6, 'Roiha', 'Simo', 20, 2),
(7, 'Paunio', 'Atte', 32, 3),
(8, 'Rahikka', 'Joona', 22, 3),
(9, 'Tanska', 'Jani', 5, 5),
(10, 'Haarala', 'Santeri', 29, 5),
(11, 'Stranvall', 'Sebastian', 8, 6),
(12, 'Vahtera', 'Joonas', 17, 6);

-- --------------------------------------------------------

--
-- Table structure for table `team`
--

DROP TABLE IF EXISTS `team`;
CREATE TABLE IF NOT EXISTS `team` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `City` varchar(50) NOT NULL,
  `Founded_year` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `team`
--

INSERT INTO `team` (`Id`, `Name`, `City`, `Founded_year`) VALUES
(1, 'HJK', 'Helsinki', 1950),
(2, 'Rops', 'Rovaniemi', 1951),
(3, 'FC Honka', 'Espoo', 1980),
(4, 'Kups', 'Kuopio', 1967),
(5, 'Ilves', 'Tampere', 1976),
(6, 'VPS', 'Vaasa', 1999),
(7, 'FC Lahti', 'Lahti', 1978),
(8, 'FC Inter', 'Espoo', 1987),
(9, 'SJK', 'Seinäjoki', 1986),
(10, 'Marieham', 'Marieham', 1965),
(11, 'TPS', 'Turku', 1945),
(12, 'PS Kemi', 'Kemi', 1988);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 13, 2025 at 11:51 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `planx`
--

-- --------------------------------------------------------

--
-- Table structure for table `todos`
--

CREATE TABLE `todos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `task` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `todos`
--

INSERT INTO `todos` (`id`, `user_id`, `task`, `description`, `deadline`, `status`) VALUES
(13, 6, 'Ngoding Python', 'Uvuveveveve', '2025-01-06', 'selesai'),
(14, 6, 'Mancing', 'Mancing Emosi', '2025-01-08', 'belum selesai'),
(15, 10, 'asphalt urban 6', 'balap liar mobil ', '2025-01-10', 'selesai'),
(16, 11, 'tugas bahasa indonesia ', 'membuat video pribadi', '2025-01-14', 'belum selesai'),
(18, 15, 'Nonton Drakor', 'Jangan lupa nonton drakor nanti malam!', '2025-01-11', 'selesai'),
(21, 15, 'Matematika Diskrit', 'Tugas sebeleum UTS', '2025-01-13', 'belum selesai'),
(22, 15, 'Kumpul Senat', 'Jangan lupa ya', '2025-01-11', 'belum selesai'),
(23, 15, 'Video IMK', 'Kapan selesai oi!', '2025-01-13', 'belum selesai'),
(24, 19, 'Laporan Praktikum VB', 'Laporan akhir untuk memenuhi tugas', '2025-01-07', 'belum selesai'),
(25, 19, 'Tugas Individu VB', 'Membuat sistem aplikasi', '2025-01-07', 'belum selesai'),
(26, 19, 'Tugas Matematika', 'Menyelesaikan soal-soal latihan', '2025-01-09', 'belum selesai');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullName` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullName`, `username`, `password`) VALUES
(6, 'adhim arifian', 'adhim', '$2a$10$NLt67PWStANMaQlDmZt2v.AK8MkUdmngt5biUMuLFx.NZ1./XFFhi'),
(10, 'Dicky Lukman Prasetyo', 'Tyooo', '$2a$10$B3JswWmBi4Ba4sRAwM5f5uI8mAjsx4O9QU9wX17zLmyIB4/OTEt6K'),
(11, 'bastian still', 'buzzgemank', '$2a$10$AqehmpaqyvXxfFbiHbuHte1CSdndZpGgSPZ.4pfHgBDFjFuR7kGWO'),
(12, 'Farah ', 'Greenexper', '$2a$10$pY.rmDOvyDNCkcHfm7.3cOoseg5Xtc.mC8Xz3ASgIffApWDsUW6/S'),
(13, 'Farah Ramadhani', 'f', '$2a$10$.VA.b5CBfIsdovsbTpaZF.uNQd0mwmX/fRxokhae.CHxfNk84husG'),
(14, 'Wahyu', 'Wahyu', '$2a$10$P6R.v.3U5ay9AUxqxcvIEujSNiNPmyvI.5kyEFuynTvQ8C7m97Jq6'),
(15, 'Farah Nur Ramadhani ', 'farahfnr2695@gmail.com', '$2a$10$ruNu1Dt.s1Rx52pDBp4RP.GRPykkHyZkRDV6T46Lrb/DqAH1GL/Pi'),
(16, 'Sony Bay', 'sony', '$2a$10$OzHQc/4PYym6HIhg9.7aDer1Q6MWrk4wDS4SIw.Wi/cCVnXBKrHMq'),
(17, 'Dwi Arisnia Juliati', 'Nia', '$2a$10$xASVm/IyQOhy/pbMjiMa/OCucDZWUE9TSpFsPej3PHCtWAwBgbtaC'),
(18, 'Arisnia', 'Arisnia', '$2a$10$J9NvdXxGLBS27dyNmx4oi.Oyq858hcbt32UA44ROTfYBSpyJJS.ie'),
(19, 'Dwi Arisnia Juliati', 'arisniadwijuliati@gmail.com', '$2a$10$tfajqppIXdDlkUv4Sm/1L.2NkSL0Ev730dAzWP/y8xLTTYqF9mOTi'),
(20, 'Naella Indah Aprilia', 'naella', '$2a$10$xm2EgLOeTRTOoFtpbF4.A.fio.pCPSaDmjS/sF5tTHqBi6KJ619pq'),
(21, 'Gagat rahino', 'Gagatramirez', '$2a$10$R3CHOnJ/yHZgPIdQMtERSu8cbVAtahTDgpecDYatodIJViHYmoN.u'),
(22, 'Guntur Bagaskara', 'gntrxx', '$2a$10$S2zSywSA0v09GAdHzdH2Le0AqO6bOtrKGUIHhAOkeZOFaCaAsVwz6');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `todos`
--
ALTER TABLE `todos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `todos`
--
ALTER TABLE `todos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

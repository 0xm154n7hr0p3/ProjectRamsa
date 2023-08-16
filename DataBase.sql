-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mer. 16 août 2023 à 04:20
-- Version du serveur : 8.0.31
-- Version de PHP : 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `projet`
--

-- --------------------------------------------------------

--
-- Structure de la table `demandes`
--

DROP TABLE IF EXISTS `demandes`;
CREATE TABLE IF NOT EXISTS `demandes` (
  `id_demande` int NOT NULL AUTO_INCREMENT,
  `date_de_demande` date NOT NULL,
  `Assurance` tinyint(1) NOT NULL,
  `compagnie_assurance` text NOT NULL,
  `Service` text NOT NULL,
  `etat_de_demande` text NOT NULL,
  `date_de_debut` date DEFAULT NULL,
  `date_de_fin` date DEFAULT NULL,
  `motif_de_refus` text NOT NULL,
  `CIN` varchar(10) NOT NULL,
  `id_ecole` int DEFAULT NULL,
  PRIMARY KEY (`id_demande`),
  KEY `CIN` (`CIN`),
  KEY `id_ecole` (`id_ecole`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `demandes`
--

INSERT INTO `demandes` (`id_demande`, `date_de_demande`, `Assurance`, `compagnie_assurance`, `Service`, `etat_de_demande`, `date_de_debut`, `date_de_fin`, `motif_de_refus`, `CIN`, `id_ecole`) VALUES
(14, '2023-07-31', 0, 'XYZ Insurance', 'Another Service', 'validé', '2023-08-01', '2023-08-15', '', 'J123456', 2),
(15, '2023-08-01', 1, 'DEF Insurance', 'Different Service', 'refusé', NULL, NULL, 'Motif de refus goes here', 'J123456', 3),
(16, '2023-08-06', 1, 'UVW Insurance', 'Some Service', 'instance', NULL, NULL, '', 'K789012', 1),
(17, '2023-08-07', 0, 'XYZ Insurance', 'Another Service', 'validé', '2023-08-08', '2023-08-18', '', 'K789012', 2),
(18, '2023-08-08', 1, 'ABC Insurance', 'Different Service', 'refusé', NULL, NULL, 'Motif de refus goes here', 'K789012', 3),
(19, '2023-08-09', 1, 'JKL Insurance', 'Some Service', 'instance', NULL, NULL, '', 'K789012', 4),
(20, '2023-08-10', 1, 'PQR Insurance', 'Some Service', 'instance', NULL, NULL, '', 'F333333', 1),
(21, '2023-08-11', 0, 'UVW Insurance', 'Another Service', 'validé', '2023-08-12', '2023-08-22', '', 'F333333', 2),
(22, '2023-08-12', 1, 'XYZ Insurance', 'Different Service', 'refusé', NULL, NULL, 'Motif de refus goes here', 'F333333', 3),
(23, '2023-08-13', 1, 'ABC Insurance', 'Some Service', 'instance', NULL, NULL, '', 'F333333', 4),
(24, '2023-08-06', 1, 'COMPANY One', 'informatique', 'instance', NULL, NULL, '', 'J123456', 1);

-- --------------------------------------------------------

--
-- Structure de la table `ecole`
--

DROP TABLE IF EXISTS `ecole`;
CREATE TABLE IF NOT EXISTS `ecole` (
  `id_ecole` int NOT NULL AUTO_INCREMENT,
  `libelle` varchar(50) NOT NULL,
  PRIMARY KEY (`id_ecole`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `ecole`
--

INSERT INTO `ecole` (`id_ecole`, `libelle`) VALUES
(1, 'ENSA agadir'),
(2, 'EST Agadir'),
(3, 'OFPPT Agadir'),
(4, 'faculté des sciences Ibnu Zohr Agadir'),
(5, 'FSJES Ibnu Zohr Agadir'),
(6, 'Universiapolis Agadir'),
(7, 'ENCG Agadir'),
(8, 'FLSH Agadir'),
(9, 'BTS Agadir');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
CREATE TABLE IF NOT EXISTS `utilisateur` (
  `CIN` varchar(20) NOT NULL,
  `mot_de_passe` varchar(61) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `type` text NOT NULL,
  `nom` text NOT NULL,
  `prenom` text NOT NULL,
  `adress` varchar(100) NOT NULL,
  `Telephone` int NOT NULL,
  `email` varchar(50) NOT NULL,
  `jwt_token` varchar(1000) NOT NULL,
  `is_verified` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`CIN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`CIN`, `mot_de_passe`, `type`, `nom`, `prenom`, `adress`, `Telephone`, `email`, `jwt_token`, `is_verified`) VALUES
('F333333', '$2a$12$hePsAGTflsSVadDsH/9tmegWO5qrw7UbcmCde0e0WOfEb9WlorpKa ', 'user', 'Smith', 'John', '123 Main St', 1234567890, 'john@example.com', '', 1),
('H1234566', '$2a$12$yBtBlVv8Fr2s2n4pheALy.MLiy8HntFfdhEEWnVT.sUQKuoB6fQDa', 'user', 'mayhod', 'hamid', 'haha 123 exemple', 345671223, 'purpleth666@gmail.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDSU5faWQiOiJIMTIzNDU2NiIsInR5cGUiOiJ1c2VyIiwiaWF0IjoxNjkxNTA2NjU3LCJleHAiOjE2OTE1OTMwNTd9.zYWwCixIxcvXCjQhSAjp6EENWhlSTjuHnjIBMNGZ38Q', 1),
('J123456', '$2a$12$HLh7UPx0oNdFjPyBMnFhAO2v1054QWd3o8atf2cg1BkXIQOTml1te', 'user', 'Doe', 'Jane', '456 Elm St', 2147483647, 'jane@example.com', '', 1),
('J1234566', '$2a$12$bXV0uIjiMdMNGHVfIiJx0e6O/fu/b88/OIvoLOBrWXrCHnNIMV2iK', 'user', 'wqdqw', 'wqdqw', 'wqdwq', 1212212, 'dwdd', '', 1),
('J654321', '$2a$12$fFsz85DS/ituTDC50wh26ugN5G.Ah10m9p8z/vwIOsTlKVgW6U5jW', 'admin', 'Williams', 'Michael', '789 Oak St', 2147483647, 'michael@example.com', '', 1),
('K789012', '$2a$12$0dQTiMI3sFhAErS67NDIYeWhzt0Zx.Uq/qGy3u0wpqE0lC5WFUEn6 ', 'user', 'Johnson', 'Sarah', '456 Oak St', 2147483647, 'sarah@example.com', '', 1);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `demandes`
--
ALTER TABLE `demandes`
  ADD CONSTRAINT `demandes_ibfk_1` FOREIGN KEY (`id_ecole`) REFERENCES `ecole` (`id_ecole`),
  ADD CONSTRAINT `demandes_ibfk_2` FOREIGN KEY (`CIN`) REFERENCES `utilisateur` (`CIN`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
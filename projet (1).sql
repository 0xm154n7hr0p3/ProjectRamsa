-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 27 juil. 2023 à 21:50
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
  `nom` text NOT NULL,
  `prenom` text NOT NULL,
  `adress` varchar(50) NOT NULL,
  `Telephone` int NOT NULL,
  `email` varchar(50) NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `demandes`
--

INSERT INTO `demandes` (`id_demande`, `date_de_demande`, `nom`, `prenom`, `adress`, `Telephone`, `email`, `Assurance`, `compagnie_assurance`, `Service`, `etat_de_demande`, `date_de_debut`, `date_de_fin`, `motif_de_refus`, `CIN`, `id_ecole`) VALUES
(6, '0678-05-31', 'gagagag', 'hahahah', 'nanaan', 4567890, 'fghjk', 1, 'dwdwdw', 'ghjk', 'validé', '1111-11-11', '0011-11-11', '', 'J123456', NULL),
(7, '0678-05-31', 'gagagag', 'hahahah', 'nanaan', 4567890, 'fghjk', 1, 'dwdwdw', 'ghjk', 'instance', '0000-00-00', '0000-00-00', '', 'J123456', NULL),
(8, '1111-11-11', 'dfghjkl', 'bdcnwejndkwjnd', 'wqdmqwkldmqlwdmlqwm', 4567890, 'jnjqwnkjwqndj', 1, 'qwdqwdwq', 'dsa', 'refusé', '2023-07-30', '2023-07-30', '', 'J123456', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `ecole`
--

DROP TABLE IF EXISTS `ecole`;
CREATE TABLE IF NOT EXISTS `ecole` (
  `id_ecole` int NOT NULL AUTO_INCREMENT,
  `libelle` varchar(50) NOT NULL,
  PRIMARY KEY (`id_ecole`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
CREATE TABLE IF NOT EXISTS `utilisateur` (
  `CIN` varchar(20) NOT NULL,
  `mot_de_passe` varchar(61) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `type` text NOT NULL,
  PRIMARY KEY (`CIN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`CIN`, `mot_de_passe`, `type`) VALUES
('J123456', '$2a$12$HLh7UPx0oNdFjPyBMnFhAO2v1054QWd3o8atf2cg1BkXIQOTml1te', 'user'),
('J654321', '$2a$12$fFsz85DS/ituTDC50wh26ugN5G.Ah10m9p8z/vwIOsTlKVgW6U5jW', 'admin');

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

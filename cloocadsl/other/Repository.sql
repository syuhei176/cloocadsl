-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- ホスト: localhost
-- 生成時間: 2012 年 4 月 22 日 18:26
-- サーバのバージョン: 5.5.16
-- PHP のバージョン: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- データベース: `Repository`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `diagram`
--

DROP TABLE IF EXISTS `diagram`;
CREATE TABLE IF NOT EXISTS `diagram` (
  `id` int(11) NOT NULL,
  `meta_id` int(11) NOT NULL,
  `version` int(11) NOT NULL,
  `model_id` int(11) NOT NULL,
  `ver_type` int(1) NOT NULL,
  `objects` tinytext NOT NULL,
  `relationships` tinytext NOT NULL,
  PRIMARY KEY (`id`,`version`,`model_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- テーブルの構造 `has_object`
--

DROP TABLE IF EXISTS `has_object`;
CREATE TABLE IF NOT EXISTS `has_object` (
  `diagram_id` int(11) NOT NULL,
  `object_id` int(11) NOT NULL,
  `model_id` int(11) NOT NULL,
  `version` int(11) NOT NULL,
  KEY `diagram_id` (`diagram_id`,`object_id`,`model_id`,`version`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- テーブルの構造 `has_property`
--

DROP TABLE IF EXISTS `has_property`;
CREATE TABLE IF NOT EXISTS `has_property` (
  `parent_id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL,
  `model_id` int(11) NOT NULL,
  `version` int(11) NOT NULL,
  KEY `parent_id` (`parent_id`,`property_id`,`model_id`,`version`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- テーブルの構造 `has_relationship`
--

DROP TABLE IF EXISTS `has_relationship`;
CREATE TABLE IF NOT EXISTS `has_relationship` (
  `diagram_id` int(11) NOT NULL,
  `relationship_id` int(11) NOT NULL,
  `model_id` int(11) NOT NULL,
  `version` int(11) NOT NULL,
  KEY `diagram_id` (`diagram_id`,`relationship_id`,`model_id`,`version`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- テーブルの構造 `model`
--

DROP TABLE IF EXISTS `model`;
CREATE TABLE IF NOT EXISTS `model` (
  `id` int(11) NOT NULL,
  `root` int(11) NOT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- テーブルの構造 `object`
--

DROP TABLE IF EXISTS `object`;
CREATE TABLE IF NOT EXISTS `object` (
  `id` int(11) NOT NULL,
  `meta_id` int(11) NOT NULL,
  `x` int(5) NOT NULL DEFAULT '0' COMMENT 'point x',
  `y` int(5) NOT NULL DEFAULT '0' COMMENT 'point y',
  `model_id` int(11) NOT NULL,
  `version` int(11) NOT NULL,
  `ver_type` int(1) NOT NULL,
  `diagram` int(11) DEFAULT NULL,
  `properties` tinytext NOT NULL,
  PRIMARY KEY (`id`,`model_id`,`version`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- テーブルの構造 `property`
--

DROP TABLE IF EXISTS `property`;
CREATE TABLE IF NOT EXISTS `property` (
  `id` int(11) NOT NULL,
  `meta_id` int(11) NOT NULL,
  `content` tinytext NOT NULL,
  `model_id` int(11) NOT NULL,
  `version` int(11) NOT NULL,
  `ver_type` int(1) NOT NULL,
  PRIMARY KEY (`id`,`model_id`,`version`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- テーブルの構造 `relationship`
--

DROP TABLE IF EXISTS `relationship`;
CREATE TABLE IF NOT EXISTS `relationship` (
  `id` int(11) NOT NULL,
  `meta_id` int(11) NOT NULL,
  `src` int(11) NOT NULL,
  `dest` int(11) NOT NULL,
  `points` tinyint(4) NOT NULL,
  `diagram_id` int(11) NOT NULL,
  `model_id` int(11) NOT NULL,
  `version` int(11) NOT NULL,
  `ver_type` int(1) NOT NULL,
  `properties` tinytext NOT NULL,
  PRIMARY KEY (`id`,`model_id`,`version`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- テーブルの構造 `Repository`
--

DROP TABLE IF EXISTS `Repository`;
CREATE TABLE IF NOT EXISTS `Repository` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `head_version` int(11) NOT NULL,
  `model_id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

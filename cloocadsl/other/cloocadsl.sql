-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- ホスト: localhost
-- 生成時間: 2012 年 4 月 17 日 13:14
-- サーバのバージョン: 5.5.16
-- PHP のバージョン: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- データベース: `cloocadsl`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `GraphicInfo`
--

DROP TABLE IF EXISTS `GraphicInfo`;
CREATE TABLE IF NOT EXISTS `GraphicInfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `visibillity` int(1) NOT NULL,
  `shape` varchar(32) NOT NULL,
  `path` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- テーブルの構造 `GroupInfo`
--

DROP TABLE IF EXISTS `GroupInfo`;
CREATE TABLE IF NOT EXISTS `GroupInfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `detail` tinytext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- テーブルの構造 `hasMetaModel`
--

DROP TABLE IF EXISTS `hasMetaModel`;
CREATE TABLE IF NOT EXISTS `hasMetaModel` (
  `user_id` int(11) NOT NULL,
  `metamodel_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- テーブルの構造 `hasProject`
--

DROP TABLE IF EXISTS `hasProject`;
CREATE TABLE IF NOT EXISTS `hasProject` (
  `user_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- テーブルの構造 `Join`
--

DROP TABLE IF EXISTS `Join`;
CREATE TABLE IF NOT EXISTS `Join` (
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `role` int(1) NOT NULL,
  KEY `user_id` (`user_id`,`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- テーブルの構造 `MetaModelInfo`
--

DROP TABLE IF EXISTS `MetaModelInfo`;
CREATE TABLE IF NOT EXISTS `MetaModelInfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `xml` mediumtext NOT NULL,
  `visibillity` int(1) NOT NULL DEFAULT '0',
  `template` mediumtext NOT NULL,
  `group_id` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

-- --------------------------------------------------------

--
-- テーブルの構造 `ProjectInfo`
--

DROP TABLE IF EXISTS `ProjectInfo`;
CREATE TABLE IF NOT EXISTS `ProjectInfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `xml` mediumtext NOT NULL,
  `metamodel_id` int(11) NOT NULL,
  `rep_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=24 ;

-- --------------------------------------------------------

--
-- テーブルの構造 `UserInfo`
--

DROP TABLE IF EXISTS `UserInfo`;
CREATE TABLE IF NOT EXISTS `UserInfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uname` varchar(32) NOT NULL,
  `passwd` varchar(32) NOT NULL,
  `register_date` date NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

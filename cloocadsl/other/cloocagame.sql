-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- ホスト: localhost
-- 生成時間: 2012 年 6 月 16 日 16:32
-- サーバのバージョン: 5.5.16
-- PHP のバージョン: 5.3.10

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- データベース: `cloocagame`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `MetaModelInfo`
--

DROP TABLE IF EXISTS `MetaModelInfo`;
CREATE TABLE IF NOT EXISTS `MetaModelInfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` tinytext CHARACTER SET utf8 NOT NULL,
  `xml` mediumtext NOT NULL,
  `visibillity` int(1) NOT NULL DEFAULT '0',
  `config` mediumtext NOT NULL,
  `welcome_message` text NOT NULL,
  `sample` mediumtext NOT NULL,
  `version` int(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- テーブルの構造 `ProjectInfo`
--

DROP TABLE IF EXISTS `ProjectInfo`;
CREATE TABLE IF NOT EXISTS `ProjectInfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `xml` mediumtext NOT NULL,
  `metamodel_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- テーブルの構造 `UserInfo`
--

DROP TABLE IF EXISTS `UserInfo`;
CREATE TABLE IF NOT EXISTS `UserInfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `registration_date` date NOT NULL,
  `lastlogin_date` date NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_is_available` bit(1) NOT NULL DEFAULT b'0',
  `email_key` varchar(32) NOT NULL,
  `full_name` tinytext NOT NULL,
  `type` varchar(8) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- テーブルのデータをダンプしています `UserInfo`
--

INSERT INTO `UserInfo` (`id`, `username`, `password`, `registration_date`, `lastlogin_date`, `email`, `email_is_available`, `email_key`, `full_name`, `type`) VALUES
(2, 'syuhei', '233fc0782cd539126a2b8f4779ba9b0f', '2012-06-16', '0000-00-00', 'syuhei176@gmail.com', '0', '91e80c07e00a457d057c2c5d29b71092', '', '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

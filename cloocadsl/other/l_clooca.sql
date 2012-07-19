-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- ホスト: localhost
-- 生成時間: 2012 年 7 月 19 日 10:01
-- サーバのバージョン: 5.5.16
-- PHP のバージョン: 5.3.10

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- データベース: `l_clooca`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `account_info`
--

CREATE TABLE IF NOT EXISTS `account_info` (
  `email` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `fullname` tinytext NOT NULL,
  `password` varchar(32) NOT NULL,
  `registration_date` date NOT NULL,
  `last_login_date` date NOT NULL,
  `email_key` varchar(32) NOT NULL,
  `valid` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`email`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- テーブルのデータをダンプしています `account_info`
--

INSERT INTO `account_info` (`email`, `user_id`, `fullname`, `password`, `registration_date`, `last_login_date`, `email_key`, `valid`) VALUES
('a@clooca.com', 7, 'å±±ä¸‹ãŸã‘ã—', '7d9a0d11cb36e12a68817aff945390de', '2012-07-14', '0000-00-00', 'b14f43d6aefb4a4e68702482266a4111', '0'),
('hiya@f.ait.kyushu-u.ac.jp', 6, 'éƒ¨è°·ï¼ˆç ”ç©¶å®¤ï¼‰', '7d9a0d11cb36e12a68817aff945390de', '2012-07-13', '0000-00-00', 'cf43db4891bf34d2d9d16fe90686ff91', '0'),
('syuhei176@gmail.com', 3, 'éƒ¨è°·', '7d9a0d11cb36e12a68817aff945390de', '2012-07-01', '0000-00-00', 'da302fd2771ea5c0dd98eacebbede8e0', '0');

-- --------------------------------------------------------

--
-- テーブルの構造 `account_relationship`
--

CREATE TABLE IF NOT EXISTS `account_relationship` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `src` int(11) NOT NULL,
  `dest` int(11) NOT NULL,
  `is_friend` bit(1) NOT NULL,
  `is_friend_pre` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `src` (`src`,`dest`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- テーブルのデータをダンプしています `account_relationship`
--

INSERT INTO `account_relationship` (`id`, `src`, `dest`, `is_friend`, `is_friend_pre`) VALUES
(1, 3, 6, '0', '1');

-- --------------------------------------------------------

--
-- テーブルの構造 `group_info`
--

CREATE TABLE IF NOT EXISTS `group_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(32) NOT NULL,
  `name` tinytext NOT NULL,
  `icon` blob NOT NULL,
  `created_date` date NOT NULL,
  `updated_date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- テーブルの構造 `join_info`
--

CREATE TABLE IF NOT EXISTS `join_info` (
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `role` int(1) NOT NULL DEFAULT '0',
  KEY `user_id` (`user_id`,`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- テーブルの構造 `metamodel_version`
--

CREATE TABLE IF NOT EXISTS `metamodel_version` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tool_uri` varchar(32) NOT NULL,
  `version` int(5) NOT NULL,
  `content` mediumtext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tool_uri` (`tool_uri`,`version`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- テーブルの構造 `template_workspace`
--

CREATE TABLE IF NOT EXISTS `template_workspace` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `tool_uri` varchar(32) NOT NULL,
  `name` varchar(32) NOT NULL,
  `package_uri` tinytext NOT NULL,
  `content` mediumtext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`,`tool_uri`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- テーブルの構造 `tool_info`
--

CREATE TABLE IF NOT EXISTS `tool_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tool_uri` varchar(32) NOT NULL,
  `name` tinytext NOT NULL,
  `created_date` date NOT NULL,
  `updated_date` date NOT NULL,
  `head_version` int(5) NOT NULL DEFAULT '1',
  `metametamodel_version` int(2) NOT NULL,
  `detail` tinytext NOT NULL,
  `visibillity` int(1) NOT NULL DEFAULT '0',
  `owner_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tool_uri` (`tool_uri`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 COMMENT='ツール情報' AUTO_INCREMENT=3 ;

--
-- テーブルのデータをダンプしています `tool_info`
--

INSERT INTO `tool_info` (`id`, `tool_uri`, `name`, `created_date`, `updated_date`, `head_version`, `metametamodel_version`, `detail`, `visibillity`, `owner_id`) VALUES
(2, 'test', 'ãƒ†ã‚¹ãƒˆ', '2012-07-15', '0000-00-00', 1, 0, '', 0, 7);

-- --------------------------------------------------------

--
-- テーブルの構造 `tool_tag`
--

CREATE TABLE IF NOT EXISTS `tool_tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tool_uri` varchar(32) NOT NULL,
  `version` int(6) NOT NULL,
  `created_date` date NOT NULL,
  `tag` tinytext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tool_uri` (`tool_uri`,`version`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='バージョンごとの設定等' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- テーブルの構造 `tool_workspace`
--

CREATE TABLE IF NOT EXISTS `tool_workspace` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `tool_uri` varchar(32) NOT NULL,
  `checkout_date` date NOT NULL,
  `metamodel` mediumtext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`,`tool_uri`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 COMMENT='ツールのワークスペース' AUTO_INCREMENT=2 ;

--
-- テーブルのデータをダンプしています `tool_workspace`
--

INSERT INTO `tool_workspace` (`id`, `user_id`, `tool_uri`, `checkout_date`, `metamodel`) VALUES
(1, 7, 'test', '2012-07-15', '');

-- --------------------------------------------------------

--
-- テーブルの構造 `user_has_tool`
--

CREATE TABLE IF NOT EXISTS `user_has_tool` (
  `user_id` int(11) NOT NULL,
  `tool_uri` varchar(32) NOT NULL,
  `permission` int(1) NOT NULL,
  `is_bought` tinyint(1) NOT NULL,
  KEY `user_id` (`user_id`,`tool_uri`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- テーブルのデータをダンプしています `user_has_tool`
--

INSERT INTO `user_has_tool` (`user_id`, `tool_uri`, `permission`, `is_bought`) VALUES
(7, 'test', 1, 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

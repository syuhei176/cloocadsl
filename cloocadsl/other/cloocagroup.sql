-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- ホスト: localhost
-- 生成時間: 2012 年 6 月 03 日 13:06
-- サーバのバージョン: 5.5.16
-- PHP のバージョン: 5.3.10

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- データベース: `cloocagroup`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `hasMetaModel`
--

CREATE TABLE IF NOT EXISTS `hasMetaModel` (
  `user_id` int(11) NOT NULL,
  `metamodel_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- テーブルのデータをダンプしています `hasMetaModel`
--

INSERT INTO `hasMetaModel` (`user_id`, `metamodel_id`) VALUES
(2, 23),
(2, 24),
(2, 25);

-- --------------------------------------------------------

--
-- テーブルの構造 `hasProject`
--

CREATE TABLE IF NOT EXISTS `hasProject` (
  `user_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- テーブルのデータをダンプしています `hasProject`
--

INSERT INTO `hasProject` (`user_id`, `project_id`) VALUES
(2, 152);

-- --------------------------------------------------------

--
-- テーブルの構造 `MetaModelInfo`
--

CREATE TABLE IF NOT EXISTS `MetaModelInfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` tinytext CHARACTER SET utf8 NOT NULL,
  `xml` mediumtext NOT NULL,
  `visibillity` int(1) NOT NULL DEFAULT '0',
  `config` mediumtext NOT NULL,
  `welcome_message` text NOT NULL,
  `sample` mediumtext NOT NULL,
  `space_key` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=26 ;

--
-- テーブルのデータをダンプしています `MetaModelInfo`
--

INSERT INTO `MetaModelInfo` (`id`, `name`, `xml`, `visibillity`, `config`, `welcome_message`, `sample`, `space_key`) VALUES
(23, 'test', '{"metadiagrams":{"1":{"id":1,"name":"test","metaobjects":[],"metarelations":[],"instance_name":null,"properties":[]}},"metaobjects":{"1":{"classname":"MetaObject","id":1,"properties":[],"abstractable":false,"graphic":null,"decomposition":null,"resizable":false},"2":{"classname":"MetaObject","id":2,"properties":[],"abstractable":false,"graphic":null,"decomposition":null,"resizable":false},"4":{"classname":"MetaObject","id":4,"properties":[],"abstractable":false,"graphic":null,"decomposition":null,"resizable":false},"5":{"classname":"MetaObject","id":5,"properties":[],"abstractable":false,"graphic":null,"decomposition":null,"resizable":false}},"metarelations":{},"metaproperties":{},"graphics":{},"tools":{}}', 1, '{"targets":[],"editor":{}}', '', '', 'clooca'),
(24, 'test', '', 0, '', '', '', 'clooca'),
(25, 'test', '', 0, '', '', '', 'clooca');

-- --------------------------------------------------------

--
-- テーブルの構造 `ProjectInfo`
--

CREATE TABLE IF NOT EXISTS `ProjectInfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `xml` mediumtext NOT NULL,
  `metamodel_id` int(11) NOT NULL,
  `rep_id` int(11) NOT NULL,
  `space_key` varchar(10) NOT NULL,
  `last_editor_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=153 ;

--
-- テーブルのデータをダンプしています `ProjectInfo`
--

INSERT INTO `ProjectInfo` (`id`, `name`, `xml`, `metamodel_id`, `rep_id`, `space_key`, `last_editor_id`) VALUES
(152, 'test_proj', '', 23, 0, 'clooca', 0);

-- --------------------------------------------------------

--
-- テーブルの構造 `SpaceInfo`
--

CREATE TABLE IF NOT EXISTS `SpaceInfo` (
  `space_key` varchar(10) NOT NULL,
  `name` tinytext NOT NULL,
  `lang` varchar(12) NOT NULL,
  `email_key` varchar(32) NOT NULL,
  `_is_email_available` bit(1) NOT NULL DEFAULT b'0',
  `email` tinytext NOT NULL,
  `registration_date` date NOT NULL,
  `plan` varchar(8) NOT NULL DEFAULT 'free',
  `state` int(1) NOT NULL COMMENT '支払い状態0:試用期間,1:a支払い待ち,2:支払済',
  `contract_deadline` date NOT NULL COMMENT 'いつまでプランを使用できるか',
  PRIMARY KEY (`space_key`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- テーブルのデータをダンプしています `SpaceInfo`
--

INSERT INTO `SpaceInfo` (`space_key`, `name`, `lang`, `email_key`, `_is_email_available`, `email`, `registration_date`, `plan`, `state`, `contract_deadline`) VALUES
('clooca', 'ã‚¯ãƒ«ãƒ¼ã‚«', '', 'a8075f73cdc1bbeb75138fc4817fd6c5', '1', 'syuhei176@gmail.com', '2012-06-02', 'free', 0, '0000-00-00');

-- --------------------------------------------------------

--
-- テーブルの構造 `Template`
--

CREATE TABLE IF NOT EXISTS `Template` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `path` tinytext NOT NULL,
  `content` mediumtext NOT NULL,
  `metamodel_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- テーブルの構造 `UserInfo`
--

CREATE TABLE IF NOT EXISTS `UserInfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `space_key` varchar(10) NOT NULL,
  `username` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `role` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- テーブルのデータをダンプしています `UserInfo`
--

INSERT INTO `UserInfo` (`id`, `space_key`, `username`, `password`, `role`) VALUES
(1, 'test', 'syuhei', '233fc0782cd539126a2b8f4779ba9b0f', 0),
(2, 'clooca', 'syuhei', '233fc0782cd539126a2b8f4779ba9b0f', 0),
(3, 'clooca', 'member1', '233fc0782cd539126a2b8f4779ba9b0f', 2);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

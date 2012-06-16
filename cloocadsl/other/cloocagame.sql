-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- ホスト: localhost
-- 生成時間: 2012 年 6 月 17 日 02:02
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
-- テーブルの構造 `CharacterInfo`
--

DROP TABLE IF EXISTS `CharacterInfo`;
CREATE TABLE IF NOT EXISTS `CharacterInfo` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `game_type` varchar(4) NOT NULL,
  `name` tinytext NOT NULL,
  `level` int(4) NOT NULL,
  `exp` int(8) NOT NULL,
  `hp` int(4) NOT NULL,
  `atk` int(4) NOT NULL,
  `statics` text NOT NULL,
  `project_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- テーブルのデータをダンプしています `CharacterInfo`
--

INSERT INTO `CharacterInfo` (`id`, `user_id`, `game_type`, `name`, `level`, `exp`, `hp`, `atk`, `statics`, `project_id`) VALUES
(0, 0, '', 'aaa', 0, 0, 0, 0, '', 0),
(0, 2, '', 'test', 0, 0, 0, 0, '', 2);

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
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- テーブルのデータをダンプしています `MetaModelInfo`
--

INSERT INTO `MetaModelInfo` (`id`, `name`, `xml`, `visibillity`, `config`, `welcome_message`, `sample`, `version`, `user_id`) VALUES
(1, 'test', '{"id":28,"name":"android","metadiagram":1,"metadiagrams":{"1":{"id":1,"name":"MetaDiagram1","metaobjects":[1,2],"metarelations":[1],"instance_name":0,"properties":[3]}},"metaobjects":{"1":{"classname":"MetaObject","id":1,"name":"action","properties":[2,4],"abstractable":false,"graphic":"rect","decomposition":null},"2":{"classname":"MetaObject","id":2,"name":"start","properties":[],"abstractable":false,"graphic":"circle","decomposition":null,"resizable":false}},"metarelations":{"1":{"classname":"MetaRelation","id":1,"name":"transition","properties":[1,4],"bindings":[],"arrow_type":"v"}},"metaproperties":{"1":{"id":1,"name":"condition","data_type":"String","widget":"fixed list","exfield":[{"disp":"æŒ¯ã‚‹","value":"accel"},{"disp":"å‚¾ã","value":"gyro"},{"disp":"ã‚¿ãƒƒãƒ","value":"touch"},{"disp":"ã‚¿ã‚¤ãƒžãƒ¼","value":"timer"}]},"2":{"id":2,"name":"action","data_type":"String","widget":"fixed list","exfield":[{"disp":"ãƒ€ã‚¤ã‚¢ãƒ­ã‚°è¡¨ç¤º","value":"dialog"},{"disp":"éŸ³ã‚’é³´ã‚‰ã™ã€‚","value":"sound"},{"disp":"ãƒ–ãƒ©ã‚¦ã‚¶","value":"browser"}]},"3":{"id":3,"name":"name","data_type":"String","widget":"input field","exfield":""},"4":{"id":4,"name":"value","data_type":"String","widget":"input field","exfield":""}},"graphics":{},"tools":{}}', 0, '{}', '', '', 1, 0);

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
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- テーブルのデータをダンプしています `ProjectInfo`
--

INSERT INTO `ProjectInfo` (`id`, `name`, `xml`, `metamodel_id`, `user_id`) VALUES
(1, 'test', '', 1, 0),
(2, 'test', '', 1, 2);

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

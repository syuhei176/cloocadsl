-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- ホスト: localhost
-- 生成時間: 2012 年 4 月 04 日 03:00
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
-- テーブルの構造 `diagram`
--

CREATE TABLE IF NOT EXISTS `diagram` (
  `id` int(11) NOT NULL,
  `meta_id` int(11) NOT NULL,
  `version` int(11) NOT NULL,
  `model_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- テーブルのデータをダンプしています `diagram`
--

INSERT INTO `diagram` (`id`, `meta_id`, `version`, `model_id`) VALUES
(1, 1, 1, 2);

-- --------------------------------------------------------

--
-- テーブルの構造 `GraphicInfo`
--

CREATE TABLE IF NOT EXISTS `GraphicInfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `visibillity` int(1) NOT NULL,
  `shape` varchar(32) NOT NULL,
  `path` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

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
(1, 6);

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
(2, 5),
(1, 10),
(1, 12);

-- --------------------------------------------------------

--
-- テーブルの構造 `has_object`
--

CREATE TABLE IF NOT EXISTS `has_object` (
  `diagram_id` int(11) NOT NULL,
  `object_id` int(11) NOT NULL,
  `model_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- テーブルのデータをダンプしています `has_object`
--

INSERT INTO `has_object` (`diagram_id`, `object_id`, `model_id`) VALUES
(1, 21, 1),
(1, 22, 1),
(1, 23, 1);

-- --------------------------------------------------------

--
-- テーブルの構造 `has_property`
--

CREATE TABLE IF NOT EXISTS `has_property` (
  `parent_id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL,
  `model_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- テーブルのデータをダンプしています `has_property`
--

INSERT INTO `has_property` (`parent_id`, `property_id`, `model_id`) VALUES
(3, 0, 0),
(3, 0, 0);

-- --------------------------------------------------------

--
-- テーブルの構造 `has_relationship`
--

CREATE TABLE IF NOT EXISTS `has_relationship` (
  `diagram_id` int(11) NOT NULL,
  `relationship_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- テーブルのデータをダンプしています `has_relationship`
--

INSERT INTO `has_relationship` (`diagram_id`, `relationship_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4);

-- --------------------------------------------------------

--
-- テーブルの構造 `MetaModelInfo`
--

CREATE TABLE IF NOT EXISTS `MetaModelInfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `xml` mediumtext NOT NULL,
  `visibillity` int(1) NOT NULL DEFAULT '0',
  `template` mediumtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- テーブルのデータをダンプしています `MetaModelInfo`
--

INSERT INTO `MetaModelInfo` (`id`, `name`, `xml`, `visibillity`, `template`) VALUES
(6, 'json', '{"id":6,"name":"json","metadiagram":{"id":6,"name":"json","metaobjects":[{"classname":"MetaObject","id":1,"name":"state","properties":[{"id":1,"name":"name","data_type":"collection_String","widget":"input field","exfield":""},{"id":2,"name":"action","data_type":"String","widget":"fixed list","exfield":"stop&go"}]},{"classname":"MetaObject","id":2,"name":"start","properties":[]}],"metarelations":[{"classname":"MetaRelation","id":1,"name":"transition","properties":[{"id":1,"name":"action","data_type":"String","widget":"input field","exfield":""}],"bindings":[],"arrow_type":"none"}]}}', 1, '<?xml version="1.0" encoding="utf-8"?><DirTemp><Template src="controller.mako" dest="t1.js"></Template></DirTemp>');

-- --------------------------------------------------------

--
-- テーブルの構造 `model`
--

CREATE TABLE IF NOT EXISTS `model` (
  `id` int(11) NOT NULL,
  `root` int(11) NOT NULL,
  `current_version` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- テーブルのデータをダンプしています `model`
--

INSERT INTO `model` (`id`, `root`, `current_version`) VALUES
(1, 0, 1),
(2, 1, 1);

-- --------------------------------------------------------

--
-- テーブルの構造 `object`
--

CREATE TABLE IF NOT EXISTS `object` (
  `id` int(11) NOT NULL,
  `meta_id` int(11) NOT NULL,
  `x` int(5) NOT NULL DEFAULT '0' COMMENT 'point x',
  `y` int(5) NOT NULL DEFAULT '0' COMMENT 'point y',
  `diagram_id` int(11) NOT NULL DEFAULT '0',
  `model_id` int(11) NOT NULL,
  `version` int(11) NOT NULL,
  `ver_type` int(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- テーブルのデータをダンプしています `object`
--

INSERT INTO `object` (`id`, `meta_id`, `x`, `y`, `diagram_id`, `model_id`, `version`, `ver_type`) VALUES
(3, 1, 195, 152, 1, 2, 1, 0),
(4, 1, 282, 156, 1, 2, 1, 2),
(6, 1, 138, 118, 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- テーブルの構造 `ProjectInfo`
--

CREATE TABLE IF NOT EXISTS `ProjectInfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `xml` mediumtext NOT NULL,
  `metamodel_id` int(11) NOT NULL,
  `rep_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- テーブルのデータをダンプしています `ProjectInfo`
--

INSERT INTO `ProjectInfo` (`id`, `name`, `xml`, `metamodel_id`, `rep_id`) VALUES
(10, 'json', '{"id":1,"current_version":1,"root":{"id":1,"objects":[{"meta_id":1,"id":1,"bound":{"x":206.18182373046875,"y":111.6363639831543,"width":50,"height":50},"properties":[],"ve":{"version":0,"ver_type":"add"}}],"relationships":[]}}', 6, 0),
(12, 'test', '{"id":12,"current_version":1,"root":{"id":1,"objects":[{"meta_id":1,"id":1,"bound":{"x":135.18182373046875,"y":87.6363639831543,"width":50,"height":50},"properties":[],"ve":{"version":0,"ver_type":"add"}}],"relationships":[]}}', 6, 0);

-- --------------------------------------------------------

--
-- テーブルの構造 `property`
--

CREATE TABLE IF NOT EXISTS `property` (
  `id` int(11) NOT NULL,
  `meta_id` int(11) NOT NULL,
  `content` tinytext NOT NULL,
  `model_id` int(11) NOT NULL,
  `version` int(11) NOT NULL,
  `ver_type` int(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- テーブルのデータをダンプしています `property`
--

INSERT INTO `property` (`id`, `meta_id`, `content`, `model_id`, `version`, `ver_type`) VALUES
(0, 1, 'stop', 0, 2, 1);

-- --------------------------------------------------------

--
-- テーブルの構造 `relationship`
--

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
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- テーブルの構造 `UserInfo`
--

CREATE TABLE IF NOT EXISTS `UserInfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uname` varchar(32) NOT NULL,
  `passwd` varchar(32) NOT NULL,
  `register_date` date NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- テーブルのデータをダンプしています `UserInfo`
--

INSERT INTO `UserInfo` (`id`, `uname`, `passwd`, `register_date`, `email`) VALUES
(1, 'syuhei', '7d9a0d11cb36e12a68817aff945390de', '2012-03-11', ''),
(2, 'user', '7d9a0d11cb36e12a68817aff945390de', '2012-03-14', ''),
(3, 'user2', '7d9a0d11cb36e12a68817aff945390de', '2012-03-17', '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

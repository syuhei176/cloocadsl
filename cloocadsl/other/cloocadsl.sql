-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- ホスト: localhost
-- 生成時間: 2012 年 3 月 30 日 14:40
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
(1, 1),
(1, 3),
(1, 4),
(1, 5);

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
(1, 1),
(1, 4),
(2, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9);

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- テーブルのデータをダンプしています `MetaModelInfo`
--

INSERT INTO `MetaModelInfo` (`id`, `name`, `xml`, `visibillity`, `template`) VALUES
(1, 'statemachine', '<?xml version="1.0" encoding="utf-8"?><MetaModel id="1" name="statemachine"><MetaDiagram id="1" name="null"><VersionElement version="0" ver_type="0" /><MetaObject id="1" name="state" x="122.0" y="162.0"><VersionElement version="0" ver_type="0" /><Graphic id="0" shape="rounded" color="null"></Graphic><MetaProperty id="1" name="action" data_type="collection_String" widget="input field"><Exfield>stop&amp;go</Exfield><VersionElement version="1" ver_type="none" /></MetaProperty></MetaObject><MetaObject id="2" name="start" x="269.0" y="105.0"><VersionElement version="0" ver_type="0" /><Graphic id="0" shape="circle" color="null"></Graphic></MetaObject><MetaRelationship id="2" name="transition" arrow="v"><VersionElement version="0" ver_type="0" /><MetaProperty id="3" name="condition" data_type="string" widget="fixed list"><Exfield>touch&amp;white&amp;black&amp;gray</Exfield><VersionElement version="1" ver_type="none" /></MetaProperty><Binding src="1" dest="1"></Binding><Binding src="2" dest="1"></Binding></MetaRelationship></MetaDiagram></MetaModel>', 1, '<?xml version="1.0" encoding="utf-8"?><DirTemp><Template src="controller.mako" dest="t1.js"></Template><Copy src="index.html" dest="index.html" /><Copy src="main.js" dest="main.js" /><Copy src="map.jpg" dest="map.jpg" /><Copy src="sys_nxt.js" dest="sys_nxt.js" /></DirTemp>'),
(3, 'dataflow', '<?xml version="1.0" encoding="utf-8"?><MetaModel id="3" name="dataflow"><MetaDiagram id="1" name="null"><VersionElement version="0" ver_type="0" /><MetaObject id="1" name="input" x="102" y="169"><VersionElement version="0" ver_type="0" /><Graphic id="0" shape="circle" color="null"></Graphic><MetaProperty id="0" name="sensor" data_type="string" widget="input field"><VersionElement version="0" ver_type="null" /></MetaProperty></MetaObject><MetaObject id="2" name="action" x="230" y="122"><VersionElement version="0" ver_type="0" /><Graphic id="0" shape="rect" color="null"></Graphic><MetaProperty id="0" name="action" data_type="string" widget="input field"><VersionElement version="0" ver_type="null" /></MetaProperty><MetaProperty id="0" name="window" data_type="string" widget="input field"><VersionElement version="0" ver_type="null" /></MetaProperty><MetaProperty id="0" name="shift" data_type="string" widget="input field"><VersionElement version="0" ver_type="null" /></MetaProperty></MetaObject><MetaObject id="3" name="output" x="0" y="0"><VersionElement version="0" ver_type="0" /><Graphic id="0" shape="rounded" color="null"></Graphic><MetaProperty id="0" name="actuator" data_type="string" widget="input field"><VersionElement version="0" ver_type="null" /></MetaProperty></MetaObject><MetaRelationship id="5" name="flow" arrow="v"><VersionElement version="0" ver_type="0" /><Binding src="2" dest="3"></Binding><Binding src="1" dest="2"></Binding></MetaRelationship></MetaDiagram></MetaModel>', 0, ''),
(4, 'linetrace1', '<?xml version="1.0" encoding="utf-8"?><MetaModel id="4" name="linetrace1"><MetaDiagram id="1" name="null"><VersionElement version="0" ver_type="null" /><MetaObject id="1" name="start" x="50" y="159"><VersionElement version="0" ver_type="null" /><Graphic id="0" shape="circle" color="null"></Graphic></MetaObject><MetaObject id="2" name="state" x="307" y="164"><VersionElement version="0" ver_type="null" /><Graphic id="0" shape="rounded" color="null"></Graphic><MetaProperty id="4" name="action" data_type="string" widget="fixed list"><Exfield>stop&amp;go</Exfield><VersionElement version="0" ver_type="null" /></MetaProperty></MetaObject><MetaRelationship id="5" name="transition" arrow="v"><VersionElement version="0" ver_type="null" /><MetaProperty id="6" name="condition" data_type="string" widget="fixed list"><Exfield>white&amp;black&amp;touch1&amp;touch2&amp;graymarker&amp;sonar</Exfield><VersionElement version="0" ver_type="null" /></MetaProperty><Binding src="2" dest="2"></Binding><Binding src="1" dest="2"></Binding></MetaRelationship></MetaDiagram></MetaModel>', 1, '<?xml version="1.0" encoding="utf-8"?><DirTemp><Template src="controller.mako" dest="t1.js"></Template></DirTemp>'),
(5, 'test', ' ', 1, '');

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

--
-- テーブルのデータをダンプしています `ProjectInfo`
--

INSERT INTO `ProjectInfo` (`id`, `name`, `xml`, `metamodel_id`, `rep_id`) VALUES
(1, 'test', '<?xml version="1.0" encoding="utf-8"?><Model id="1"><Diagram id="0" meta_id="1"><VersionElement version="0" ver_type="0" /><Object id="1" meta_id="1" x="120" y="177"><VersionElement version="0" ver_type="0" /><Property id="0" meta_id="1">stop<VersionElement version="0" ver_type="0" /></Property></Object><Object id="2" meta_id="1" x="421" y="258"><VersionElement version="0" ver_type="0" /><Property id="0" meta_id="1">go<VersionElement version="0" ver_type="0" /></Property></Object><Object id="20" meta_id="1" x="330" y="70"><VersionElement version="0" ver_type="0" /><Property id="0" meta_id="1">go<VersionElement version="0" ver_type="0" /></Property></Object><Object id="21" meta_id="1" x="498" y="187"><VersionElement version="0" ver_type="0" /><Property id="0" meta_id="1">stop<VersionElement version="0" ver_type="0" /></Property></Object><Relationship id="2" meta_id="2" src="1" dest="2"><VersionElement version="0" ver_type="0" /><Property id="7" meta_id="3">touch<VersionElement version="0" ver_type="0" /></Property></Relationship><Relationship id="22" meta_id="2" src="2" dest="21"><VersionElement version="0" ver_type="0" /><Property id="0" meta_id="3">touch<VersionElement version="0" ver_type="0" /></Property></Relationship><Relationship id="23" meta_id="2" src="21" dest="20"><VersionElement version="0" ver_type="0" /><Property id="0" meta_id="3">touch<VersionElement version="0" ver_type="0" /></Property></Relationship><Relationship id="24" meta_id="2" src="20" dest="1"><VersionElement version="0" ver_type="0" /><Property id="0" meta_id="3">touch<VersionElement version="0" ver_type="0" /></Property></Relationship></Diagram></Model>', 1, 0),
(4, 'dataflow', '<?xml version="1.0" encoding="utf-8"?><Model id="4"><Diagram id="1" meta_id="1"><VersionElement version="0" ver_type="null" /><Object id="6" meta_id="1" x="72" y="125"><VersionElement version="0" ver_type="null" /><Property id="0" meta_id="0">Light<VersionElement version="0" ver_type="null" /></Property></Object><Object id="7" meta_id="2" x="254" y="173"><VersionElement version="0" ver_type="null" /><Property id="0" meta_id="0">Average<VersionElement version="0" ver_type="null" /></Property></Object><Object id="8" meta_id="3" x="442" y="172"><VersionElement version="0" ver_type="null" /><Property id="0" meta_id="0">LCD<VersionElement version="0" ver_type="null" /></Property></Object><Relationship id="9" meta_id="5" src="6" dest="7"><VersionElement version="0" ver_type="null" /></Relationship><Relationship id="10" meta_id="5" src="7" dest="8"><VersionElement version="0" ver_type="null" /></Relationship></Diagram></Model>', 3, 0),
(5, 'test', ' ', 1, 0),
(6, 'dd', '<?xml version="1.0" encoding="utf-8"?><Model id="6"></Model>', 1, 0),
(7, 'aa', '<?xml version="1.0" encoding="utf-8"?><Model id="7" current_version="1"><Diagram id="1" meta_id="1"><VersionElement version="1" ver_type="add" /><Object id="3" meta_id="1" x="218.0" y="161.0"><VersionElement version="1" ver_type="add" /><PropertyList meta_id="1"><Property id="0" meta_id="1">stop<VersionElement version="1" ver_type="add" /></Property></PropertyList></Object><Object id="4" meta_id="1" x="473.0" y="110.0"><VersionElement version="1" ver_type="1" /><PropertyList meta_id="1"><Property id="0" meta_id="1">hhh<VersionElement version="1" ver_type="1" /></Property><Property id="0" meta_id="1">dfs<VersionElement version="1" ver_type="none" /></Property><Property id="0" meta_id="1">gdfs<VersionElement version="1" ver_type="none" /></Property></PropertyList></Object></Diagram></Model>', 1, 1),
(8, 'bb', '<?xml version="1.0" encoding="utf-8"?><Model id="8" current_version="0"><Diagram id="1" meta_id="1"><VersionElement version="1" ver_type="add" /><Object id="3" meta_id="1" x="121.0" y="139.0"><VersionElement version="1" ver_type="update" /><Property id="0" meta_id="1">aaaa<VersionElement version="1" ver_type="none" /></Property></Object><Object id="4" meta_id="1" x="277.0" y="151.0"><VersionElement version="1" ver_type="delete" /><Property id="0" meta_id="1"><VersionElement version="1" ver_type="add" /></Property></Object><Object id="5" meta_id="1" x="292.0" y="248.0"><VersionElement version="1" ver_type="add" /><Property id="0" meta_id="1"><VersionElement version="1" ver_type="add" /></Property></Object><Object id="6" meta_id="1" x="331.0" y="132.0"><VersionElement version="1" ver_type="add" /><Property id="0" meta_id="1"><VersionElement version="1" ver_type="add" /></Property></Object><Relationship id="7" meta_id="2" src="3" dest="5"><VersionElement version="1" ver_type="add" /><Property id="0" meta_id="3">touch<VersionElement version="1" ver_type="add" /></Property></Relationship></Diagram></Model>', 1, 2),
(9, 'a1', '<?xml version="1.0" encoding="utf-8"?><Model id="9" current_version="0"><Diagram id="1" meta_id="1"><VersionElement version="1" ver_type="none" /><Object id="6" meta_id="1" x="138" y="118"><VersionElement version="1" ver_type="add" /></Object><Object id="7" meta_id="2" x="345" y="277"><VersionElement version="1" ver_type="add" /><Property id="0" meta_id="4">stop<VersionElement version="1" ver_type="add" /></Property></Object><Object id="9" meta_id="2" x="470" y="131"><VersionElement version="1" ver_type="add" /><Property id="0" meta_id="4">go<VersionElement version="1" ver_type="add" /></Property></Object><Object id="11" meta_id="2" x="360" y="149"><VersionElement version="1" ver_type="delete" /><Property id="0" meta_id="4">stop<VersionElement version="1" ver_type="add" /></Property></Object><Object id="12" meta_id="2" x="435" y="346"><VersionElement version="1" ver_type="add" /><Property id="0" meta_id="4">go<VersionElement version="1" ver_type="add" /></Property></Object><Relationship id="8" meta_id="5" src="6" dest="7"><VersionElement version="1" ver_type="add" /><Property id="0" meta_id="6">white<VersionElement version="1" ver_type="add" /></Property></Relationship><Relationship id="10" meta_id="5" src="7" dest="9"><VersionElement version="1" ver_type="add" /><Property id="0" meta_id="6">white<VersionElement version="1" ver_type="add" /></Property></Relationship></Diagram></Model>', 4, 1);

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

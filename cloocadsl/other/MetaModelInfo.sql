-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- ホスト: localhost
-- 生成時間: 2012 年 4 月 05 日 18:30
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
-- テーブルの構造 `MetaModelInfo`
--

CREATE TABLE IF NOT EXISTS `MetaModelInfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `xml` mediumtext NOT NULL,
  `visibillity` int(1) NOT NULL DEFAULT '0',
  `template` mediumtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- テーブルのデータをダンプしています `MetaModelInfo`
--

INSERT INTO `MetaModelInfo` (`id`, `name`, `xml`, `visibillity`, `template`) VALUES
(6, 'json', '{"id":6,"name":"json","metaobjects":[null,{"classname":"MetaObject","id":1,"name":"state","properties":[2]},{"classname":"MetaObject","id":2,"name":"start","properties":[]}],"metarelations":[null,{"classname":"MetaRelation","id":1,"name":"transition","properties":[3],"bindings":[],"arrow_type":"none"}],"metaproperties":[null,{"id":1,"name":"name","data_type":"collection_String","widget":"input field","exfield":""},{"id":2,"name":"action","data_type":"String","widget":"fixed list","exfield":"stop&go"},{"id":3,"name":"action","data_type":"String","widget":"input field","exfield":""}],"metadiagrams":[null,{"id":1,"name":"json","metaobjects":[1,2],"metarelations":[1]}]}', 1, '<?xml version="1.0" encoding="utf-8"?><DirTemp><Template src="controller.mako" dest="t1.js"></Template></DirTemp>'),
(7, 'json2', ' {"id":6,"name":"json","metaobjects":[null,{"classname":"MetaObject","id":1,"name":"state","properties":[1,2]},{"classname":"MetaObject","id":2,"name":"start","properties":[]}],"metarelations":[null,{"classname":"MetaRelation","id":1,"name":"transition","properties":[3],"bindings":[],"arrow_type":"none"}],"metaproperties":[null,{"id":1,"name":"name","data_type":"collection_String","widget":"input field","exfield":""},{"id":2,"name":"action","data_type":"String","widget":"fixed list","exfield":"stop&go"},{"id":3,"name":"action","data_type":"String","widget":"input field","exfield":""}],"metadiagrams":[null,{"id":1,"name":"json","metaobjects":[1,2],"metarelations":[1]}]}', 0, '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- ホスト: localhost
-- 生成時間: 2012 年 4 月 10 日 13:10
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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

--
-- テーブルのデータをダンプしています `MetaModelInfo`
--

INSERT INTO `MetaModelInfo` (`id`, `name`, `xml`, `visibillity`, `template`) VALUES
(6, 'json', '{"id":6,"name":"json","metaobjects":[null,{"classname":"MetaObject","id":1,"name":"state","properties":[1]},{"classname":"MetaObject","id":2,"name":"start","properties":[]},{"classname":"MetaObject","id":3,"name":"class","properties":[3],"decomposition":2}],"metarelations":[null,{"classname":"MetaRelation","id":1,"name":"transition","properties":[2],"bindings":[],"arrow_type":"v"}],"metaproperties":[null,{"id":1,"name":"action","data_type":"String","widget":"fixed list","exfield":"stop&go"},{"id":2,"name":"event","data_type":"String","widget":"fixed list","exfield":"none&touch&white&black"},{"id":3,"name":"name","data_type":"String","widget":"fixed list","exfield":"Linetracer&Controller"}],"metadiagrams":[null,{"id":1,"name":"classdiagram","metaobjects":[3],"metarelations":[]},{"id":2,"name":"statediagram","metaobjects":[1,2],"metarelations":[1]}]}', 1, '<?xml version="1.0" encoding="utf-8"?><DirTemp><TemplateForDiagram src="controller.mako" dest="t1.js" diagram="2"></TemplateForDiagram></DirTemp>'),
(7, 'json2', ' {"id":6,"name":"json","metaobjects":[null,{"classname":"MetaObject","id":1,"name":"state","properties":[1,2]},{"classname":"MetaObject","id":2,"name":"start","properties":[]}],"metarelations":[null,{"classname":"MetaRelation","id":1,"name":"transition","properties":[3],"bindings":[],"arrow_type":"none"}],"metaproperties":[null,{"id":1,"name":"name","data_type":"collection_String","widget":"input field","exfield":""},{"id":2,"name":"action","data_type":"String","widget":"fixed list","exfield":"stop&go"},{"id":3,"name":"action","data_type":"String","widget":"input field","exfield":""}],"metadiagrams":[null,{"id":1,"name":"json","metaobjects":[1,2],"metarelations":[1]}]}', 0, ''),
(8, 'statemachine for nxt', '{"id":6,"name":"json","metaobjects":[null,{"classname":"MetaObject","id":1,"name":"state","properties":[1]},{"classname":"MetaObject","id":2,"name":"start","properties":[]},{"classname":"MetaObject","id":3,"name":"class","properties":[3],"decomposition":2}],"metarelations":[null,{"classname":"MetaRelation","id":1,"name":"transition","properties":[2],"bindings":[],"arrow_type":"v"}],"metaproperties":[null,{"id":1,"name":"action","data_type":"String","widget":"fixed list","exfield":"stop&go"},{"id":2,"name":"event","data_type":"String","widget":"fixed list","exfield":"none&touch&white&black"}],"metadiagrams":[null,{"id":1,"name":"statediagram","metaobjects":[1,2],"metarelations":[1]}]}', 1, '<?xml version="1.0" encoding="utf-8"?><DirTemp>\n<TemplateForDiagram src="state_header.mako" dest="c_$id.h" diagram="1"></TemplateForDiagram>\n<TemplateForDiagram src="state.mako" dest="c_$id.cpp" diagram="1"></TemplateForDiagram>\n<Template src="main.h" dest="main.h" />\n<Template src="Makefile" dest="Makefile" />\n<Copy src="EventManager.h" dest="EventManager.h" />\n<Copy src="StateMachine.h" dest="StateMachine.h" />\n<Copy src="mdlnxtproj.h" dest="mdlnxtproj.h" />\n<Copy src="mdlnxtproj.cfg" dest="mdlnxtproj.cfg" />\n</DirTemp>');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

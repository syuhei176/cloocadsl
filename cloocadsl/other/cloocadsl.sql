-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- ホスト: localhost
-- 生成時間: 2012 年 4 月 19 日 13:00
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

CREATE TABLE IF NOT EXISTS `GroupInfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `detail` tinytext NOT NULL,
  `visibillity` int(1) NOT NULL,
  `service` varchar(8) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- テーブルのデータをダンプしています `GroupInfo`
--

INSERT INTO `GroupInfo` (`id`, `name`, `detail`, `visibillity`, `service`) VALUES
(1, 'Shinshu University', '', 0, 'shinshu'),
(3, 'global', '', 1, 'all');

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
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10);

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
(1, 12),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(1, 18),
(1, 19),
(1, 20),
(1, 21),
(1, 22),
(1, 23),
(1, 24);

-- --------------------------------------------------------

--
-- テーブルの構造 `JoinInfo`
--

CREATE TABLE IF NOT EXISTS `JoinInfo` (
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `role` int(1) NOT NULL,
  KEY `user_id` (`user_id`,`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- テーブルのデータをダンプしています `JoinInfo`
--

INSERT INTO `JoinInfo` (`user_id`, `group_id`, `role`) VALUES
(1, 1, 1),
(7, 1, 0),
(1, 3, 1);

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
  `group_id` int(11) NOT NULL DEFAULT '1',
  `welcome_message` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- テーブルのデータをダンプしています `MetaModelInfo`
--

INSERT INTO `MetaModelInfo` (`id`, `name`, `xml`, `visibillity`, `template`, `group_id`, `welcome_message`) VALUES
(6, 'json', '{"id":6,"name":"json","metaobjects":[null,{"classname":"MetaObject","id":1,"name":"state","properties":[1]},{"classname":"MetaObject","id":2,"name":"start","properties":[]},{"classname":"MetaObject","id":3,"name":"class","properties":[3],"decomposition":2}],"metarelations":[null,{"classname":"MetaRelation","id":1,"name":"transition","properties":[2],"bindings":[],"arrow_type":"v"}],"metaproperties":[null,{"id":1,"name":"action","data_type":"String","widget":"fixed list","exfield":"stop&go"},{"id":2,"name":"event","data_type":"String","widget":"fixed list","exfield":"none&touch&white&black"},{"id":3,"name":"name","data_type":"String","widget":"fixed list","exfield":"Linetracer&Controller"}],"metadiagrams":[null,{"id":1,"name":"classdiagram","metaobjects":[3],"metarelations":[]},{"id":2,"name":"statediagram","metaobjects":[1,2],"metarelations":[1]}]}', 1, '<?xml version="1.0" encoding="utf-8"?><DirTemp><TemplateForDiagram src="controller.mako" dest="t1.js" diagram="2"></TemplateForDiagram></DirTemp>', 3, 'welcome'),
(7, 'json2', ' {"id":6,"name":"json","metaobjects":[null,{"classname":"MetaObject","id":1,"name":"state","properties":[1,2]},{"classname":"MetaObject","id":2,"name":"start","properties":[]}],"metarelations":[null,{"classname":"MetaRelation","id":1,"name":"transition","properties":[3],"bindings":[],"arrow_type":"none"}],"metaproperties":[null,{"id":1,"name":"name","data_type":"collection_String","widget":"input field","exfield":""},{"id":2,"name":"action","data_type":"String","widget":"fixed list","exfield":"stop&go"},{"id":3,"name":"action","data_type":"String","widget":"input field","exfield":""}],"metadiagrams":[null,{"id":1,"name":"json","metaobjects":[1,2],"metarelations":[1]}]}', 1, '', 3, 'welcome'),
(8, 'statemachine for nxt', '{"id":6,"name":"json","metaobjects":[null,{"classname":"MetaObject","id":1,"name":"state","properties":[1],"graphic":"rounded"},{"classname":"MetaObject","id":2,"name":"start","properties":[],"graphic":"circle"},{"classname":"MetaObject","id":3,"name":"class","properties":[3],"graphic":"rect","decomposition":2}],"metarelations":[null,{"classname":"MetaRelation","id":1,"name":"transition","properties":[2],"bindings":[],"arrow_type":"v"}],"metaproperties":[null,{"id":1,"name":"action","data_type":"String","widget":"fixed list","exfield":"stop&go"},{"id":2,"name":"event","data_type":"String","widget":"fixed list","exfield":"none&touch&white&black"}],"metadiagrams":[null,{"id":1,"name":"statediagram","metaobjects":[1,2],"metarelations":[1]}]}', 1, '<?xml version="1.0" encoding="utf-8"?><DirTemp>\n<TemplateForDiagram src="state_header.mako" dest="c_$id.h" diagram="1"></TemplateForDiagram>\n<TemplateForDiagram src="state.mako" dest="c_$id.cpp" diagram="1"></TemplateForDiagram>\n<Template src="main.h" dest="main.h" />\n<Template src="Makefile" dest="Makefile" />\n<Copy src="EventManager.h" dest="EventManager.h" />\n<Copy src="main.cpp" dest="main.cpp" />\n<Copy src="StateMachine.h" dest="StateMachine.h" />\n<Copy src="mdlnxtproj.h" dest="mdlnxtproj.h" />\n<Copy src="mdlnxtproj.cfg" dest="mdlnxtproj.cfg" />\n</DirTemp>', 1, 'welcome'),
(9, 'classdiagram', '{"id":9,"name":"uml","metaobjects":[null,{"classname":"MetaObject","id":1,"name":"class","properties":[1,2,3],"graphic":"rect"}],"metarelations":[null,{"classname":"MetaRelation","id":1,"name":"association","properties":[1],"bindings":[],"arrow_type":"v"}],"metaproperties":[null,{"id":1,"name":"name","data_type":"String","widget":"input field","exfield":""},{"id":2,"name":"attribute","data_type":"collection_String","widget":"input field","exfield":""},{"id":3,"name":"operation","data_type":"collection_String","widget":"input field","exfield":""}],"metadiagrams":[null,{"id":1,"name":"classdiagram","metaobjects":[1],"metarelations":[1]}]}', 1, '', 3, 'welcome'),
(10, 'core', '{"id":6,"name":"json","metaobjects":[null,{"classname":"MetaObject","id":1,"name":"state","properties":[1],"graphic":"rounded"},{"classname":"MetaObject","id":2,"name":"start","properties":[],"graphic":"circle"},{"classname":"MetaObject","id":3,"name":"klass","properties":[3],"graphic":"rect","decomposition":2},{"classname":"MetaObject","id":4,"name":"send_event_state","properties":[4],"graphic":"rounded"}],"metarelations":[null,{"classname":"MetaRelation","id":1,"name":"transition","properties":[2],"bindings":[],"arrow_type":"v"}],"metaproperties":[null,{"id":1,"name":"action","data_type":"String","widget":"fixed list","exfield":"stop&go&userdefine1&userdefine2"},{"id":2,"name":"event","data_type":"String","widget":"fixed list","exfield":"none&touch&white&black&userdefine1&userdefine2"},{"id":3,"name":"classname","data_type":"String","widget":"fixed list","exfield":"Controller&Linetracer"},{"id":4,"name":"send","data_type":"String","widget":"fixed list","exfield":"userdefine1&userdefine2"}],"metadiagrams":[null,{"id":1,"name":"classdiagram","metaobjects":[3],"metarelations":[]},{"id":2,"name":"statediagram","metaobjects":[1,2,4],"metarelations":[1]}]}', 1, '<?xml version="1.0" encoding="utf-8"?><DirTemp>\n<TemplateForDiagram src="state_header.mako" dest="c_$id.h" diagram="2"></TemplateForDiagram>\n<TemplateForDiagram src="state.mako" dest="c_$id.cpp" diagram="2"></TemplateForDiagram>\n<Template src="main.h" dest="main.h" />\n<Template src="Makefile" dest="Makefile" />\n<Copy src="EventManager.h" dest="EventManager.h" />\n<Copy src="main.cpp" dest="main.cpp" />\n<Copy src="StateMachine.h" dest="StateMachine.h" />\n<Copy src="mdlnxtproj.h" dest="mdlnxtproj.h" />\n<Copy src="mdlnxtproj.cfg" dest="mdlnxtproj.cfg" />\n</DirTemp>', 3, 'welcome');

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
  `group_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=25 ;

--
-- テーブルのデータをダンプしています `ProjectInfo`
--

INSERT INTO `ProjectInfo` (`id`, `name`, `xml`, `metamodel_id`, `rep_id`, `group_id`) VALUES
(10, 'json', '{"id":10,"root":1,"current_version":1,"diagrams":{"1":{"id":1,"meta_id":1,"objects":[1,2],"relationships":[],"ve":{"version":1,"ver_type":"add"}},"2":{"id":2,"meta_id":2,"objects":[3,4],"relationships":[5],"ve":{"version":1,"ver_type":"add"}},"6":{"id":6,"meta_id":2,"objects":[5,6],"relationships":[7],"ve":{"version":1,"ver_type":"add"}}},"objects":{"1":{"meta_id":3,"id":1,"bound":{"x":81.18182373046875,"y":95.6363639831543,"width":90,"height":30},"properties":[{"meta_id":3,"children":[1]}],"ve":{"version":1,"ver_type":"add"},"diagram":2},"2":{"meta_id":3,"id":2,"bound":{"x":271.18182373046875,"y":66.6363639831543,"width":90,"height":30},"properties":[{"meta_id":3,"children":[2]}],"ve":{"version":1,"ver_type":"add"},"diagram":6},"3":{"meta_id":1,"id":3,"bound":{"x":91.18182373046875,"y":152.6363639831543,"width":50,"height":30},"properties":[{"meta_id":1,"children":[3]}],"ve":{"version":1,"ver_type":"add"},"diagram":null},"4":{"meta_id":1,"id":4,"bound":{"x":567.1818237304688,"y":117.6363639831543,"width":50,"height":30},"properties":[{"meta_id":1,"children":[4]}],"ve":{"version":1,"ver_type":"add"},"diagram":null},"5":{"meta_id":1,"id":5,"bound":{"x":115.18182373046875,"y":84.6363639831543,"width":50,"height":30},"properties":[{"meta_id":1,"children":[6]}],"ve":{"version":1,"ver_type":"add"},"diagram":null},"6":{"meta_id":1,"id":6,"bound":{"x":250.18182373046875,"y":105.6363639831543,"width":50,"height":30},"properties":[{"meta_id":1,"children":[7]}],"ve":{"version":1,"ver_type":"add"},"diagram":null}},"properties":{"1":{"id":1,"value":"Linetracer","ve":{"version":1,"ver_type":"add"}},"2":{"id":2,"value":"Controller","ve":{"version":1,"ver_type":"add"}},"3":{"id":3,"value":"stop","ve":{"version":1,"ver_type":"add"}},"4":{"id":4,"value":"go","ve":{"version":1,"ver_type":"add"}},"5":{"id":5,"value":"white","ve":{"version":1,"ver_type":"add"}},"6":{"id":6,"value":"go","ve":{"version":1,"ver_type":"add"}},"7":{"id":7,"value":"stop","ve":{"version":1,"ver_type":"add"}},"8":{"id":8,"value":"none","ve":{"version":1,"ver_type":"add"}},"9":{"id":9,"value":"","ve":{"version":1,"ver_type":"add"}},"10":{"id":10,"value":"","ve":{"version":1,"ver_type":"add"}}},"relationships":{"5":{"meta_id":1,"id":5,"src":3,"dest":4,"points":[{"x":-56,"y":0},{"x":335.18182373046875,"y":93.6363639831543}],"properties":[{"meta_id":2,"children":[5]}],"ve":{"version":1,"ver_type":"add"}},"7":{"meta_id":1,"id":7,"src":5,"dest":6,"points":[],"properties":[{"meta_id":2,"children":[8]}],"ve":{"version":1,"ver_type":"add"}}}}', 6, 1, 3),
(12, 'test', '{"relationships": {}, "properties": {}, "objects": {"1": {"ve": {"ver_type": "none", "version": 1}, "properties": [], "id": 1, "meta_id": 1, "bound": {"y": 112, "x": 155, "height": 50, "width": 50}}}, "current_version": "5", "root": 1, "id": 6, "diagrams": {"1": {"relationships": [], "objects": [], "id": 1, "meta_id": 1, "ve": {"ver_type": "none", "version": 5}}}}', 6, 6, 3),
(14, 'shinsyu1', '{"id":14,"root":1,"current_version":1,"diagrams":{"1":{"id":1,"meta_id":1,"objects":[2,3,140001],"relationships":[5,140003],"ve":{"version":1,"ver_type":"add"}}},"objects":{"2":{"meta_id":1,"id":2,"bound":{"x":279.72727966308594,"y":94.18181991577148,"width":42,"height":30},"properties":[{"meta_id":1,"children":[2]}],"ve":{"version":1,"ver_type":"add"},"diagram":null},"3":{"meta_id":1,"id":3,"bound":{"x":422.72727966308594,"y":187.18181991577148,"width":42,"height":30},"properties":[{"meta_id":1,"children":[3]}],"ve":{"version":1,"ver_type":"add"},"diagram":null},"140001":{"meta_id":2,"id":140001,"bound":{"x":111.72727966308594,"y":80.18181991577148,"width":50,"height":50},"properties":[],"ve":{"version":1,"ver_type":"add"},"diagram":null}},"properties":{"1":{"id":1,"value":"stop","ve":{"version":1,"ver_type":"add"}},"2":{"id":2,"value":"stop","ve":{"version":1,"ver_type":"add"}},"3":{"id":3,"value":"go","ve":{"version":1,"ver_type":"add"}},"4":{"id":4,"value":"touch","ve":{"version":1,"ver_type":"add"}},"5":{"id":5,"value":"touch","ve":{"version":1,"ver_type":"add"}},"6":{"id":6,"value":"","ve":{"version":1,"ver_type":"add"}},"7":{"id":7,"value":"k","ve":{"version":1,"ver_type":"add"}},"140001":{"id":140001,"meta_id":2,"value":"","ve":{"version":1,"ver_type":"add"}}},"relationships":{"5":{"meta_id":1,"id":5,"src":2,"dest":3,"points":[],"properties":[{"meta_id":2,"children":[5]}],"ve":{"version":1,"ver_type":"add"}},"140003":{"meta_id":1,"id":140003,"src":140001,"dest":2,"points":[],"properties":[{"meta_id":2,"children":[140001]}],"ve":{"version":1,"ver_type":"add"}}}}', 8, 2, 1),
(15, 'rep', 'null', 8, 7, 1),
(16, 'rep2', '{"relationships":{"3":{"src":1,"ve":{"ver_type":"none","version":1},"dest":2,"properties":[{"children":[3],"meta_id":2}],"points":[],"meta_id":1,"id":3},"5":{"src":4,"ve":{"ver_type":"none","version":1},"dest":1,"properties":[{"children":[4],"meta_id":2}],"points":[],"meta_id":1,"id":5},"7":{"src":2,"ve":{"ver_type":"none","version":1},"dest":6,"properties":[{"children":[5],"meta_id":2}],"points":[],"meta_id":1,"id":7}},"properties":{"1":{"value":"stop","id":1,"meta_id":1,"ve":{"ver_type":"none","version":3}},"2":{"value":"go","id":2,"meta_id":1,"ve":{"ver_type":"none","version":3}},"3":{"value":"white","id":3,"meta_id":2,"ve":{"ver_type":"none","version":2}},"4":{"value":"none","id":4,"meta_id":2,"ve":{"ver_type":"none","version":2}},"5":{"value":"black","id":5,"meta_id":2,"ve":{"ver_type":"none","version":3}},"6":{"value":"go","id":6,"meta_id":1,"ve":{"ver_type":"none","version":3}},"7":{"value":"touch","id":7,"meta_id":2,"ve":{"ver_type":"none","version":4}},"8":{"value":"stop","id":8,"meta_id":1,"ve":{"ver_type":"none","version":4}}},"objects":{"1":{"ve":{"ver_type":"update","version":3},"bound":{"y":44.181819915771484,"x":179.72727966308594,"height":50,"width":50},"id":1,"diagram":null,"meta_id":1,"properties":[{"children":[1],"meta_id":1}]},"2":{"ve":{"ver_type":"none","version":2},"bound":{"y":113,"x":350,"height":50,"width":50},"id":2,"diagram":null,"meta_id":1,"properties":[{"children":[2],"meta_id":1}]},"4":{"ve":{"ver_type":"none","version":2},"bound":{"y":166,"x":83,"height":50,"width":50},"id":4,"diagram":null,"meta_id":2,"properties":[]},"6":{"ve":{"ver_type":"none","version":5},"bound":{"y":88,"x":498,"height":50,"width":50},"id":6,"diagram":null,"meta_id":1,"properties":[{"children":[6],"meta_id":1}]}},"current_version":"5","root":1,"id":16,"diagrams":{"1":{"relationships":[3,5,7],"objects":[1,2,4,6],"id":1,"meta_id":1,"ve":{"ver_type":"none","version":4}}}}', 8, 1, 1),
(17, 'rep3', '{"relationships":{"3":{"src":1,"ve":{"ver_type":"none","version":1},"dest":2,"properties":[{"children":[6],"meta_id":3}],"points":[],"meta_id":1,"id":3}},"properties":{"1":{"value":"a1","id":1,"meta_id":1,"ve":{"ver_type":"none","version":2}},"2":{"value":"test","id":2,"meta_id":2,"ve":{"ver_type":"none","version":4}},"4":{"value":"","id":4,"meta_id":1,"ve":{"ver_type":"none","version":4}},"5":{"value":"a","id":5,"meta_id":2,"ve":{"ver_type":"none","version":4}},"6":{"value":"link","id":6,"meta_id":3,"ve":{"ver_type":"none","version":4}},"7":{"id":7,"meta_id":1,"value":"aaa3","ve":{"version":1,"ver_type":"add"}}},"objects":{"1":{"ve":{"ver_type":"update","version":0},"properties":[{"children":[1,7],"meta_id":1},{"children":[2],"meta_id":2}],"id":1,"meta_id":1,"bound":{"y":40.181819915771484,"x":46.72727966308594,"height":50,"width":50}},"2":{"ve":{"ver_type":"update","version":1},"properties":[{"children":[4],"meta_id":1},{"children":[5],"meta_id":2}],"id":2,"meta_id":1,"bound":{"y":58.181819915771484,"x":199.72727966308594,"height":50,"width":50}}},"current_version":"4","root":1,"id":17,"diagrams":{"1":{"relationships":[3],"objects":[1,1,2],"id":1,"meta_id":1,"ve":{"ver_type":"none","version":4}}}}', 7, 11, 3),
(18, 'rep2copy', '{"relationships":{"3":{"src":1,"ve":{"ver_type":"none","version":1},"dest":2,"properties":[{"children":[3],"meta_id":2}],"points":[],"meta_id":1,"id":3},"5":{"src":4,"ve":{"ver_type":"none","version":1},"dest":1,"properties":[{"children":[4],"meta_id":2}],"points":[],"meta_id":1,"id":5},"7":{"src":2,"ve":{"ver_type":"none","version":1},"dest":6,"properties":[{"children":[5],"meta_id":2}],"points":[],"meta_id":1,"id":7},"9":{"meta_id":1,"id":9,"src":6,"dest":8,"points":[],"properties":[{"meta_id":2,"children":[7]}],"ve":{"version":1,"ver_type":"add"}}},"properties":{"1":{"value":"stop","id":1,"meta_id":1,"ve":{"ver_type":"none","version":3}},"2":{"value":"go","id":2,"meta_id":1,"ve":{"ver_type":"none","version":3}},"3":{"value":"white","id":3,"meta_id":2,"ve":{"ver_type":"none","version":2}},"4":{"value":"none","id":4,"meta_id":2,"ve":{"ver_type":"none","version":2}},"5":{"value":"black","id":5,"meta_id":2,"ve":{"ver_type":"none","version":3}},"6":{"value":"go","id":6,"meta_id":1,"ve":{"ver_type":"none","version":3}},"7":{"id":7,"meta_id":2,"value":"touch","ve":{"version":1,"ver_type":"add"}},"8":{"id":8,"meta_id":1,"value":"stop","ve":{"version":1,"ver_type":"add"}}},"objects":{"1":{"ve":{"ver_type":"none","version":0},"properties":[{"children":[1],"meta_id":1}],"id":1,"meta_id":1,"bound":{"y":83,"x":190,"height":50,"width":50}},"2":{"ve":{"ver_type":"none","version":1},"properties":[{"children":[2],"meta_id":1}],"id":2,"meta_id":1,"bound":{"y":113,"x":350,"height":50,"width":50}},"4":{"ve":{"ver_type":"none","version":1},"properties":[],"id":4,"meta_id":2,"bound":{"y":166,"x":83,"height":50,"width":50}},"6":{"ve":{"ver_type":"none","version":1},"properties":[{"children":[6],"meta_id":1}],"id":6,"meta_id":1,"bound":{"y":133,"x":499,"height":50,"width":50}},"8":{"meta_id":1,"id":8,"bound":{"x":296.72727966308594,"y":207.18181991577148,"width":42,"height":30},"properties":[{"meta_id":1,"children":[8]}],"ve":{"version":1,"ver_type":"add"},"diagram":null}},"current_version":"3","root":1,"id":18,"diagrams":{"1":{"relationships":[3,5,7,9],"objects":[1,2,4,6,8],"id":1,"meta_id":1,"ve":{"ver_type":"update","version":3}}}}', 8, 1, 1),
(19, 'uml_test1', '{"relationships":{"3":{"src":1,"ve":{"ver_type":"none","version":1},"dest":2,"properties":[{"children":[3],"meta_id":1}],"points":[],"meta_id":1,"id":3},"5":{"src":2,"ve":{"ver_type":"none","version":1},"dest":4,"properties":[{"children":[10],"meta_id":1}],"points":[],"meta_id":1,"id":5},"200002":{"src":1,"ve":{"ver_type":"none","version":1},"dest":200001,"properties":[{"children":[200002],"meta_id":1}],"points":[],"meta_id":1,"id":200002}},"properties":{"1":{"value":"Book","id":1,"meta_id":1,"ve":{"ver_type":"none","version":2}},"2":{"value":"Order","id":2,"meta_id":1,"ve":{"ver_type":"none","version":3}},"3":{"value":"ä¾å­˜","id":3,"meta_id":1,"ve":{"ver_type":"none","version":4}},"4":{"value":"-title:String","id":4,"meta_id":2,"ve":{"ver_type":"none","version":2}},"5":{"value":"+getTitle():string","id":5,"meta_id":3,"ve":{"ver_type":"none","version":2}},"6":{"value":"-book_id:int","id":6,"meta_id":2,"ve":{"ver_type":"none","version":2}},"7":{"value":"+getBookId():int","id":7,"meta_id":3,"ve":{"ver_type":"none","version":2}},"8":{"value":"-order_id:int","id":8,"meta_id":2,"ve":{"ver_type":"none","version":3}},"9":{"value":"è·å“¡","id":9,"meta_id":1,"ve":{"ver_type":"none","version":5}},"10":{"value":"","id":10,"meta_id":1,"ve":{"ver_type":"none","version":4}},"11":{"value":"+åå‰:String","id":11,"meta_id":2,"ve":{"ver_type":"none","version":5}},"12":{"value":"+age:int","id":12,"meta_id":2,"ve":{"ver_type":"none","version":5}},"13":{"value":"+èº«é•·:int","id":13,"meta_id":2,"ve":{"ver_type":"none","version":5}},"200001":{"value":"æœ¬æ£š","id":200001,"meta_id":1,"ve":{"ver_type":"none","version":6}},"200002":{"value":"","id":200002,"meta_id":1,"ve":{"ver_type":"none","version":6}},"200003":{"value":"aaa","id":200003,"meta_id":1,"ve":{"ver_type":"none","version":8}},"200004":{"value":"","id":200004,"meta_id":1,"ve":{"ver_type":"none","version":9}}},"objects":{"1":{"ve":{"ver_type":"none","version":9},"bound":{"y":76,"x":118,"height":70,"width":154},"id":1,"diagram":null,"meta_id":1,"properties":[{"children":[1],"meta_id":1},{"children":[4],"meta_id":2},{"children":[5],"meta_id":3}]},"2":{"ve":{"ver_type":"none","version":5},"bound":{"y":41,"x":428,"height":90,"width":138},"id":2,"diagram":null,"meta_id":1,"properties":[{"children":[2],"meta_id":1},{"children":[6,8],"meta_id":2},{"children":[7],"meta_id":3}]},"4":{"ve":{"ver_type":"none","version":8},"bound":{"y":227,"x":236,"height":90,"width":90},"id":4,"diagram":null,"meta_id":1,"properties":[{"children":[9],"meta_id":1},{"children":[11,12,13],"meta_id":2}]},"200001":{"ve":{"ver_type":"none","version":6},"bound":{"y":191,"x":128,"height":30,"width":42},"id":200001,"diagram":null,"meta_id":1,"properties":[{"children":[200001],"meta_id":1}]},"200003":{"ve":{"ver_type":"none","version":8},"bound":{"y":213,"x":462,"height":30,"width":42},"id":200003,"diagram":null,"meta_id":1,"properties":[{"children":[200003],"meta_id":1}]},"200004":{"ve":{"ver_type":"none","version":9},"bound":{"y":252,"x":562,"height":30,"width":42},"id":200004,"diagram":null,"meta_id":1,"properties":[{"children":[200004],"meta_id":1}]}},"current_version":"9","root":1,"id":19,"diagrams":{"1":{"relationships":[3,5],"objects":[1,2,4,200003,200004],"id":1,"meta_id":1,"ve":{"ver_type":"none","version":9}}}}', 9, 2, 3),
(20, 'uml_test2', '{"relationships":{"3":{"src":1,"ve":{"ver_type":"none","version":1},"dest":2,"properties":[{"children":[3],"meta_id":1}],"points":[],"meta_id":1,"id":3},"5":{"src":2,"ve":{"ver_type":"none","version":1},"dest":4,"properties":[{"children":[10],"meta_id":1}],"points":[],"meta_id":1,"id":5},"200002":{"src":1,"ve":{"ver_type":"none","version":1},"dest":200001,"properties":[{"children":[200002],"meta_id":1}],"points":[],"meta_id":1,"id":200002},"200005":{"meta_id":1,"id":200005,"src":4,"dest":200003,"points":[],"properties":[{"meta_id":1,"children":[200005]}],"ve":{"version":1,"ver_type":"add"}}},"properties":{"1":{"value":"Book","id":1,"meta_id":1,"ve":{"ver_type":"none","version":2}},"2":{"value":"Order","id":2,"meta_id":1,"ve":{"ver_type":"none","version":3}},"3":{"value":"ä¾å­˜","id":3,"meta_id":1,"ve":{"ver_type":"none","version":4}},"4":{"value":"-title:String","id":4,"meta_id":2,"ve":{"ver_type":"none","version":2}},"5":{"value":"+getTitle():string","id":5,"meta_id":3,"ve":{"ver_type":"none","version":2}},"6":{"value":"-book_id:int","id":6,"meta_id":2,"ve":{"ver_type":"none","version":2}},"7":{"value":"+getBookId():int","id":7,"meta_id":3,"ve":{"ver_type":"none","version":2}},"8":{"value":"-order_id:int","id":8,"meta_id":2,"ve":{"ver_type":"none","version":3}},"9":{"value":"è·å“¡","id":9,"meta_id":1,"ve":{"ver_type":"none","version":5}},"10":{"value":"","id":10,"meta_id":1,"ve":{"ver_type":"none","version":4}},"11":{"value":"+åå‰:String","id":11,"meta_id":2,"ve":{"ver_type":"none","version":5}},"12":{"value":"+age:int","id":12,"meta_id":2,"ve":{"ver_type":"none","version":5}},"13":{"value":"+èº«é•·:int","id":13,"meta_id":2,"ve":{"ver_type":"none","version":5}},"200001":{"value":"æœ¬æ£š","id":200001,"meta_id":1,"ve":{"ver_type":"none","version":6}},"200002":{"value":"","id":200002,"meta_id":1,"ve":{"ver_type":"none","version":6}},"200003":{"value":"aaa","id":200003,"meta_id":1,"ve":{"ver_type":"none","version":8}},"200004":{"value":"","id":200004,"meta_id":1,"ve":{"ver_type":"none","version":9}},"200005":{"id":200005,"meta_id":1,"value":"","ve":{"version":1,"ver_type":"add"}}},"objects":{"1":{"ve":{"ver_type":"none","version":9},"bound":{"y":76,"x":118,"height":70,"width":154},"id":1,"diagram":null,"meta_id":1,"properties":[{"children":[1],"meta_id":1},{"children":[4],"meta_id":2},{"children":[5],"meta_id":3}]},"2":{"ve":{"ver_type":"none","version":5},"bound":{"y":41,"x":428,"height":90,"width":138},"id":2,"diagram":null,"meta_id":1,"properties":[{"children":[2],"meta_id":1},{"children":[6,8],"meta_id":2},{"children":[7],"meta_id":3}]},"4":{"ve":{"ver_type":"update","version":8},"bound":{"y":162.18181991577148,"x":306.72727966308594,"height":90,"width":90},"id":4,"diagram":null,"meta_id":1,"properties":[{"children":[9],"meta_id":1},{"children":[11,12,13],"meta_id":2},{"meta_id":3,"children":[]}]},"200001":{"ve":{"ver_type":"none","version":6},"bound":{"y":191,"x":128,"height":30,"width":42},"id":200001,"diagram":null,"meta_id":1,"properties":[{"children":[200001],"meta_id":1}]},"200003":{"ve":{"ver_type":"update","version":8},"bound":{"y":216.18181991577148,"x":450.72727966308594,"height":30,"width":42},"id":200003,"diagram":null,"meta_id":1,"properties":[{"children":[200003],"meta_id":1},{"meta_id":2,"children":[]},{"meta_id":3,"children":[]}]},"200004":{"ve":{"ver_type":"update","version":9},"bound":{"y":198.18181991577148,"x":513.7272796630859,"height":30,"width":42},"id":200004,"diagram":null,"meta_id":1,"properties":[{"children":[200004],"meta_id":1},{"meta_id":2,"children":[]},{"meta_id":3,"children":[]}]}},"current_version":"9","root":1,"id":20,"diagrams":{"1":{"relationships":[3,5,200002,200005],"objects":[1,2,4,200003,200004,200001],"id":1,"meta_id":1,"ve":{"ver_type":"update","version":9}}}}', 9, 2, 3),
(21, 'core_test1', '{"id":21,"root":1,"current_version":1,"diagrams":{"1":{"id":1,"meta_id":1,"objects":[210001,210002],"relationships":[],"ve":{"version":1,"ver_type":"add"}},"210001":{"id":210001,"meta_id":2,"objects":[210003,210004,210014],"relationships":[210005,210016],"ve":{"version":1,"ver_type":"add"}},"210002":{"id":210002,"meta_id":2,"objects":[210006,210007,210012],"relationships":[210008,210013],"ve":{"version":1,"ver_type":"add"}}},"objects":{"210001":{"meta_id":3,"id":210001,"bound":{"x":69.72727966308594,"y":96.18181991577148,"width":90,"height":30},"properties":[{"meta_id":3,"children":[210001]}],"ve":{"version":1,"ver_type":"add"},"diagram":210001},"210002":{"meta_id":3,"id":210002,"bound":{"x":296.72727966308594,"y":142.18181991577148,"width":90,"height":30},"properties":[{"meta_id":3,"children":[210002]}],"ve":{"version":1,"ver_type":"add"},"diagram":210002},"210003":{"meta_id":1,"id":210003,"bound":{"x":324.72727966308594,"y":77.18181991577148,"width":42,"height":30},"properties":[{"meta_id":1,"children":[210003]}],"ve":{"version":1,"ver_type":"add"},"diagram":null},"210004":{"meta_id":2,"id":210004,"bound":{"x":25.727279663085938,"y":91.18181991577148,"width":42,"height":10},"properties":[],"ve":{"version":1,"ver_type":"add"},"diagram":null},"210006":{"meta_id":2,"id":210006,"bound":{"x":84.72727966308594,"y":176.18181991577148,"width":42,"height":10},"properties":[],"ve":{"version":1,"ver_type":"add"},"diagram":null},"210007":{"meta_id":1,"id":210007,"bound":{"x":247.72727966308594,"y":70.18181991577148,"width":42,"height":30},"properties":[{"meta_id":1,"children":[210005]}],"ve":{"version":1,"ver_type":"add"},"diagram":null},"210012":{"meta_id":1,"id":210012,"bound":{"x":404.72727966308594,"y":105.18181991577148,"width":42,"height":30},"properties":[{"meta_id":1,"children":[210010]}],"ve":{"version":1,"ver_type":"add"},"diagram":null},"210014":{"meta_id":1,"id":210014,"bound":{"x":450.72727966308594,"y":186.18181991577148,"width":98,"height":30},"properties":[{"meta_id":1,"children":[210012]}],"ve":{"version":1,"ver_type":"add"},"diagram":null}},"properties":{"210001":{"id":210001,"meta_id":3,"value":"Controller","ve":{"version":1,"ver_type":"add"}},"210002":{"id":210002,"meta_id":3,"value":"Linetracer","ve":{"version":1,"ver_type":"add"}},"210003":{"id":210003,"meta_id":1,"value":"stop","ve":{"version":1,"ver_type":"add"}},"210004":{"id":210004,"meta_id":2,"value":"none","ve":{"version":1,"ver_type":"add"}},"210005":{"id":210005,"meta_id":1,"value":"stop","ve":{"version":1,"ver_type":"add"}},"210006":{"id":210006,"meta_id":2,"value":"none","ve":{"version":1,"ver_type":"add"}},"210007":{"id":210007,"meta_id":4,"value":"","ve":{"version":1,"ver_type":"add"}},"210008":{"id":210008,"meta_id":4,"value":"userdefine1","ve":{"version":1,"ver_type":"add"}},"210009":{"id":210009,"meta_id":2,"value":"touch","ve":{"version":1,"ver_type":"add"}},"210010":{"id":210010,"meta_id":1,"value":"go","ve":{"version":1,"ver_type":"add"}},"210011":{"id":210011,"meta_id":2,"value":"userdefine1","ve":{"version":1,"ver_type":"add"}},"210012":{"id":210012,"meta_id":1,"value":"userdefine1","ve":{"version":1,"ver_type":"add"}},"210013":{"id":210013,"meta_id":2,"value":"","ve":{"version":1,"ver_type":"add"}},"210014":{"id":210014,"meta_id":2,"value":"touch","ve":{"version":1,"ver_type":"add"}}},"relationships":{"210005":{"meta_id":1,"id":210005,"src":210004,"dest":210003,"points":[],"properties":[{"meta_id":2,"children":[210004]}],"ve":{"version":1,"ver_type":"add"}},"210008":{"meta_id":1,"id":210008,"src":210006,"dest":210007,"points":[],"properties":[{"meta_id":2,"children":[210006]}],"ve":{"version":1,"ver_type":"add"}},"210013":{"meta_id":1,"id":210013,"src":210007,"dest":210012,"points":[],"properties":[{"meta_id":2,"children":[210011]}],"ve":{"version":1,"ver_type":"add"}},"210016":{"meta_id":1,"id":210016,"src":210003,"dest":210014,"points":[],"properties":[{"meta_id":2,"children":[210014]}],"ve":{"version":1,"ver_type":"add"}}}}', 10, 0, 3),
(22, 'uml_test3', '{"relationships": {"230002": {"src": 220004, "ve": {"ver_type": "none", "version": 1}, "dest": 230001, "properties": [{"children": [230002], "meta_id": 1}], "points": [], "meta_id": 1, "id": 230002}, "230004": {"src": 220002, "ve": {"ver_type": "none", "version": 1}, "dest": 230003, "properties": [{"children": [230004], "meta_id": 1}], "points": [], "meta_id": 1, "id": 230004}, "230006": {"src": 220002, "ve": {"ver_type": "none", "version": 1}, "dest": 230005, "properties": [{"children": [230006], "meta_id": 1}], "points": [], "meta_id": 1, "id": 230006}, "220007": {"src": 220004, "ve": {"ver_type": "none", "version": 1}, "dest": 220006, "properties": [{"children": [220007], "meta_id": 1}], "points": [], "meta_id": 1, "id": 220007}, "220005": {"src": 220002, "ve": {"ver_type": "none", "version": 1}, "dest": 220004, "properties": [{"children": [220005], "meta_id": 1}], "points": [], "meta_id": 1, "id": 220005}}, "properties": {"220002": {"value": "\\u7720\\u3044", "id": 220002, "meta_id": 1, "ve": {"ver_type": "none", "version": 2}}, "220003": {"value": "", "id": 220003, "meta_id": 1, "ve": {"ver_type": "none", "version": 2}}, "220001": {"value": "\\u3059\\u3054\\u3044", "id": 220001, "meta_id": 1, "ve": {"ver_type": "none", "version": 2}}, "220006": {"value": "\\u6771\\u4eac", "id": 220006, "meta_id": 1, "ve": {"ver_type": "none", "version": 4}}, "220007": {"value": "", "id": 220007, "meta_id": 1, "ve": {"ver_type": "none", "version": 4}}, "220004": {"value": "\\u3067\\u3054\\u308f\\u3059\\u3002", "id": 220004, "meta_id": 1, "ve": {"ver_type": "none", "version": 3}}, "220005": {"value": "", "id": 220005, "meta_id": 1, "ve": {"ver_type": "none", "version": 3}}, "230012": {"value": "ererefefdv", "id": 230012, "meta_id": 2, "ve": {"ver_type": "none", "version": 9}}, "230013": {"value": "sugoi", "id": 230013, "meta_id": 2, "ve": {"ver_type": "none", "version": 9}}, "230003": {"value": "\\u4e2d\\u9593", "id": 230003, "meta_id": 1, "ve": {"ver_type": "none", "version": 6}}, "230002": {"value": "", "id": 230002, "meta_id": 1, "ve": {"ver_type": "none", "version": 5}}, "230001": {"value": "\\uff12\\uff13", "id": 230001, "meta_id": 1, "ve": {"ver_type": "none", "version": 5}}, "230014": {"value": "gdssgf", "id": 230014, "meta_id": 2, "ve": {"ver_type": "none", "version": 9}}, "230006": {"value": "", "id": 230006, "meta_id": 1, "ve": {"ver_type": "none", "version": 7}}, "230005": {"value": "\\u306a\\u3093\\u3060\\u3053\\u308c\\u306f", "id": 230005, "meta_id": 1, "ve": {"ver_type": "none", "version": 7}}, "230004": {"value": "", "id": 230004, "meta_id": 1, "ve": {"ver_type": "none", "version": 6}}, "230010": {"value": "pppppppp", "id": 230010, "meta_id": 2, "ve": {"ver_type": "none", "version": 9}}, "230009": {"value": "ggg", "id": 230009, "meta_id": 2, "ve": {"ver_type": "none", "version": 9}}, "230008": {"value": "bbbbb", "id": 230008, "meta_id": 2, "ve": {"ver_type": "none", "version": 8}}, "230015": {"value": "koredesaigo", "id": 230015, "meta_id": 2, "ve": {"ver_type": "none", "version": 9}}, "230011": {"value": "sss", "id": 230011, "meta_id": 2, "ve": {"ver_type": "none", "version": 9}}}, "objects": {"220002": {"ve": {"ver_type": "update", "version": 12}, "bound": {"y": 135, "x": 201, "height": 50, "width": 50}, "id": 220002, "diagram": null, "meta_id": 1, "properties": [{"children": [220002], "meta_id": 1}, {"children": [230008, 230015], "meta_id": 2}, {"children": [], "meta_id": 3}]}, "220006": {"ve": {"ver_type": "none", "version": 4}, "bound": {"y": 129, "x": 533, "height": 50, "width": 50}, "id": 220006, "diagram": null, "meta_id": 1, "properties": [{"children": [220006], "meta_id": 1}]}, "220004": {"ve": {"ver_type": "none", "version": 3}, "bound": {"y": 177, "x": 410, "height": 50, "width": 50}, "id": 220004, "diagram": null, "meta_id": 1, "properties": [{"children": [220004], "meta_id": 1}]}, "230003": {"ve": {"ver_type": "none", "version": 6}, "bound": {"y": 57, "x": 290, "height": 50, "width": 50}, "id": 230003, "diagram": null, "meta_id": 1, "properties": [{"children": [230003], "meta_id": 1}]}, "230001": {"ve": {"ver_type": "none", "version": 5}, "bound": {"y": 210, "x": 541, "height": 50, "width": 50}, "id": 230001, "diagram": null, "meta_id": 1, "properties": [{"children": [230001], "meta_id": 1}]}, "230005": {"ve": {"ver_type": "update", "version": 12}, "bound": {"y": 115, "x": 70, "height": 50, "width": 50}, "id": 230005, "diagram": null, "meta_id": 1, "properties": [{"children": [230005], "meta_id": 1}, {"children": [], "meta_id": 2}, {"children": [], "meta_id": 3}]}}, "current_version": "12", "root": 0, "id": 3, "diagrams": {"1": {"relationships": [220005, 220007, 230002, 230004, 230006], "objects": [220002, 220004, 220006, 230001, 230003, 230005], "id": 1, "meta_id": 1, "ve": {"ver_type": "none", "version": 11}}}}', 9, 3, 3),
(23, 'uml_test4', '{"relationships":{"220005":{"src":220002,"ve":{"ver_type":"none","version":1},"dest":220004,"properties":[{"children":[220005],"meta_id":1}],"points":[],"meta_id":1,"id":220005},"220007":{"src":220004,"ve":{"ver_type":"none","version":1},"dest":220006,"properties":[{"children":[220007],"meta_id":1}],"points":[],"meta_id":1,"id":220007},"230002":{"src":220004,"ve":{"ver_type":"none","version":1},"dest":230001,"properties":[{"children":[230002],"meta_id":1}],"points":[],"meta_id":1,"id":230002},"230004":{"src":220002,"ve":{"ver_type":"none","version":1},"dest":230003,"properties":[{"children":[230004],"meta_id":1}],"points":[],"meta_id":1,"id":230004},"230006":{"src":220002,"ve":{"ver_type":"none","version":1},"dest":230005,"properties":[{"children":[230006],"meta_id":1}],"points":[],"meta_id":1,"id":230006}},"properties":{"220001":{"value":"ã™ã”ã„","id":220001,"meta_id":1,"ve":{"ver_type":"none","version":2}},"220002":{"value":"çœ ã„","id":220002,"meta_id":1,"ve":{"ver_type":"none","version":2}},"220003":{"value":"","id":220003,"meta_id":1,"ve":{"ver_type":"none","version":2}},"220004":{"value":"ã§ã”ã‚ã™ã€‚","id":220004,"meta_id":1,"ve":{"ver_type":"none","version":3}},"220005":{"value":"","id":220005,"meta_id":1,"ve":{"ver_type":"none","version":3}},"220006":{"value":"æ±äº¬","id":220006,"meta_id":1,"ve":{"ver_type":"none","version":4}},"220007":{"value":"","id":220007,"meta_id":1,"ve":{"ver_type":"none","version":4}},"230001":{"value":"ï¼’ï¼“","id":230001,"meta_id":1,"ve":{"ver_type":"none","version":5}},"230002":{"value":"","id":230002,"meta_id":1,"ve":{"ver_type":"none","version":5}},"230003":{"value":"ä¸­é–“","id":230003,"meta_id":1,"ve":{"ver_type":"none","version":6}},"230004":{"value":"","id":230004,"meta_id":1,"ve":{"ver_type":"none","version":6}},"230005":{"value":"ãªã‚“ã ã“ã‚Œã¯","id":230005,"meta_id":1,"ve":{"ver_type":"none","version":7}},"230006":{"value":"","id":230006,"meta_id":1,"ve":{"ver_type":"none","version":7}},"230008":{"value":"bbbbb","id":230008,"meta_id":2,"ve":{"ver_type":"none","version":8}},"230009":{"value":"ggg","id":230009,"meta_id":2,"ve":{"ver_type":"none","version":9}},"230010":{"value":"pppppppp","id":230010,"meta_id":2,"ve":{"ver_type":"none","version":9}},"230011":{"value":"sss","id":230011,"meta_id":2,"ve":{"ver_type":"none","version":9}},"230012":{"value":"ererefefdv","id":230012,"meta_id":2,"ve":{"ver_type":"none","version":9}},"230013":{"value":"sugoi","id":230013,"meta_id":2,"ve":{"ver_type":"none","version":9}},"230014":{"value":"gdssgf","id":230014,"meta_id":2,"ve":{"ver_type":"none","version":9}},"230015":{"value":"koredesaigo","id":230015,"meta_id":2,"ve":{"ver_type":"none","version":9}}},"objects":{"220002":{"ve":{"ver_type":"none","version":12},"bound":{"y":135,"x":201,"height":70,"width":98},"id":220002,"diagram":null,"meta_id":1,"properties":[{"children":[220002],"meta_id":1},{"children":[230008,230015],"meta_id":2}]},"220004":{"ve":{"ver_type":"none","version":3},"bound":{"y":177,"x":410,"height":30,"width":50},"id":220004,"diagram":null,"meta_id":1,"properties":[{"children":[220004],"meta_id":1}]},"220006":{"ve":{"ver_type":"none","version":4},"bound":{"y":129,"x":533,"height":30,"width":42},"id":220006,"diagram":null,"meta_id":1,"properties":[{"children":[220006],"meta_id":1}]},"230001":{"ve":{"ver_type":"none","version":5},"bound":{"y":210,"x":541,"height":30,"width":42},"id":230001,"diagram":null,"meta_id":1,"properties":[{"children":[230001],"meta_id":1}]},"230003":{"ve":{"ver_type":"none","version":6},"bound":{"y":57,"x":290,"height":30,"width":42},"id":230003,"diagram":null,"meta_id":1,"properties":[{"children":[230003],"meta_id":1}]},"230005":{"ve":{"ver_type":"update","version":12},"bound":{"y":115,"x":70,"height":30,"width":58},"id":230005,"diagram":null,"meta_id":1,"properties":[{"children":[230005],"meta_id":1},{"children":[],"meta_id":2},{"children":[],"meta_id":3}]}},"current_version":"12","root":0,"id":23,"diagrams":{"1":{"relationships":[220005,220007,230002,230004,230006],"objects":[220002,220004,220006,230001,230003,230005],"id":1,"meta_id":1,"ve":{"ver_type":"none","version":11}}}}', 9, 3, 3),
(24, 'test', '', 8, 0, 1);

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
  `role` int(1) NOT NULL DEFAULT '0',
  `belonging` tinytext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

--
-- テーブルのデータをダンプしています `UserInfo`
--

INSERT INTO `UserInfo` (`id`, `uname`, `passwd`, `register_date`, `email`, `role`, `belonging`) VALUES
(1, 'clooca', 'a8ed147206bd6df12f9bdee5e5f2d4f1', '2012-03-11', '', 1, ''),
(2, 'user', '7d9a0d11cb36e12a68817aff945390de', '2012-03-14', '', 0, ''),
(3, 'user2', '7d9a0d11cb36e12a68817aff945390de', '2012-03-17', '', 0, ''),
(7, 'test', '7d9a0d11cb36e12a68817aff945390de', '2012-04-18', '', 0, ''),
(8, 'clooca', 'a8ed147206bd6df12f9bdee5e5f2d4f1', '2012-04-19', '', 0, '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

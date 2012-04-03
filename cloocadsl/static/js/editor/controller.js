/**
 * Save Model
 * グローバル変数g_modelの内容をサーバに保存する。
 */
function saveModel(pid) {
	g_model.id = pid;
	var xml = JSON.stringify(g_model);
//	console.log(xml);
	$.post('/psave', { pid : pid, xml : xml },
			function(data) {
				if(data) {
					console.log('saved json string = '+xml);
				}
			}, "json");
}

/**
 * Load Model
 * グローバル変数g_modelにサーバからロードしたモデルをセットする。
 * @param pid
 */
function loadModel(pid) {
	$.post('/pload', { pid : pid },
			function(data) {
				if(data) {
					console.log('loaded json string = '+data.xml);
					g_model = eval('(' + data.xml + ')');
					g_metamodel_id = data.metamodel_id;
					loadMetaModel(data.metamodel_id);
//					g_model = parseModelXML(data.xml);
					for(var i=0;i < g_model.root.objects.length;i++) {
						object_IdGenerator.setOffset(g_model.root.objects[i].id);
					}
					createModelExplorer();
				}
			}, "json");
}

/**
 * Save MetaModel
 * グローバル変数g_metamodelの内容をサーバに保存する。
 */
function saveMetaModel(id) {
	var xml = JSON.stringify(g_metamodel);
//	console.log(xml);
	$.post('/msave', { id : id, xml : xml },
			function(data) {
				if(data) {
					console.log('saved json string = '+xml);
				}
			}, "json");
}

/**
 * Load MetaModel
 * グローバル変数g_modelにサーバからロードしたモデルをセットする。
 * @param pid
 */
function loadMetaModel(id) {
	$.post('/mload', { id : id },
			function(data) {
				if(data) {
					console.log('loaded json string = '+data.xml);
					g_metamodel = eval('(' + data.xml + ')');
					for(var i=0;i < g_metamodel.metadiagram.metaobjects.length;i++) {
						metaobject_IdGenerator.setOffset(g_metamodel.metadiagram.metaobjects[i].id);
					}
//					g_model = parseModelXML(data.xml);
//					createModelExplorer();
				}
			}, "json");
}

function Generate(pid) {
	$.post('/gen', { pid : pid },
			function(data) {
				if(data) {
				}
			}, "json");
}

/*
 * parse model XML
 */
function parseModelXML(xml) {
	var parser = new DOMParser();
	var dom = parser.parseFromString(xml, "text/xml");
	var models = dom.getElementsByTagName("Model");
	var model = new Model();
	for (var i=0; i<models.length; i++){
		var diagrams = models[i].getElementsByTagName("Diagram");
		for (var j=0; j<diagrams.length; j++){
			model.root = parseDiagramXML(diagrams[j]);
		}
	}
	return model;
}

function parseDiagramXML(item) {
	var diagram = new Diagram();
	var objects = item.getElementsByTagName("Object");
	for (var i=0; i<objects.length; i++){
		diagram.objects.push(parseObjectXML(objects[i]));
	}
	var relationships = item.getElementsByTagName("Relationship");
	for (var i=0; i<relationships.length; i++){
//		diagram.relationships.push(parseRelationshipXML(relationships[i]));
	}
	return diagram;
}

function parseObjectXML(item) {
	var object = new Object();
	var properties = item.getElementsByTagName("Property");
	for (var i=0; i<properties.length; i++){
//		parseDiagramXML(objects[i]);
	}
	return object;
}

function parseRelationshipXML(item) {
	var rel = new Relationship();
	var properties = item.getElementsByTagName("Property");
	for (var i=0; i<properties.length; i++){
//		parseDiagramXML(objects[i]);
	}
	return rel;
}
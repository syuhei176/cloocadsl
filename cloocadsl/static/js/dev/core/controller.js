/**
 * download
 * @param pid
 */
function download(pid) {
	window.open('/download/'+pid);
}

function genbin(pid) {
	$.post('/compile_server/reserve', { pid : pid ,pname:g_projectinfo.name},
			function(data) {
				if(data) {
					console.log('url='+data);
				}else{
					window.alert('error');
				}
			}, "json");
}

/**
 * Save Model
 * グローバル変数g_modelの内容をサーバに保存する。
 */
function saveModel(pid) {
	Ext.MessageBox.show({title: 'Please wait',msg: 'Loading...',progressText: 'Initializing...',width:300,progress:true,closable:false,animEl: 'mb6'});
	if(_is_preview) {
		var xml = JSON.stringify(g_model);
		$.post('/preview-save', { id : g_metamodel_id, sample : xml },
				function(data) {
					if(data) {
						console.log('saved json string = '+xml);
						Ext.MessageBox.hide();
					}
				}, "json");
	}else{
		g_model.id = pid;
		var xml = JSON.stringify(g_model);
		$.post('/psave', { pid : pid, xml : xml },
				function(data) {
					if(data) {
						console.log('saved json string = '+xml);
						Ext.MessageBox.hide();
					}
				}, "json");
	}
}


/**
 * Load Model
 * グローバル変数g_modelにサーバからロードしたモデルをセットする。
 * @param pid
 */
/*
 * 削除対象
 */
function loadModel(pid) {
	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
	Ext.MessageBox.show({title: 'Please wait',msg: 'Loading...',progressText: 'Initializing...',width:300,progress:true,closable:false,animEl: 'mb6'});
	$.post('/pload', { pid : pid },
			function(data) {
				if(data) {
					console.log('loaded json string = '+data.xml);
//					g_projectname = data.name;
					g_projectinfo = data;
					console.log('service='+g_projectinfo.group.service);
					if(data.xml == 'null' || data.xml == '') {
						g_model = new Model();
						g_model.root = 1;
						g_model.diagrams[1] = new Diagram(1);
						diagram_IdGenerator.setOffset(1);
					}else{
//						g_model = eval('(' + data.xml + ')');
						g_model = JSON.parse(data.xml);
					}
					g_metamodel_id = data.metamodel_id;
					loadMetaModel(data.metamodel_id);
					/*
					 * IDジェネレータの初期値を設定する。
					 */
					diagram_IdGenerator.setOffset(g_projectinfo.id * 10000);
					object_IdGenerator.setOffset(g_projectinfo.id * 10000);
					property_IdGenerator.setOffset(g_projectinfo.id * 10000);
					for(var key in g_model.diagrams) {
						obj = g_model.diagrams[key]
						if(obj == null) continue;
						diagram_IdGenerator.setOffset(obj.id);
					}
					for(var key in g_model.objects) {
						obj = g_model.objects[key]
						if(obj == null) continue;
						object_IdGenerator.setOffset(obj.id);
						calObjHeight(obj);
					}
					for(var key in g_model.relationships) {
						obj = g_model.relationships[key]
						if(obj == null) continue;
						object_IdGenerator.setOffset(obj.id);
					}
					for(var key in g_model.properties) {
						var prop = g_model.properties[key];
						if(prop == null) continue;
						property_IdGenerator.setOffset(prop.id);
					}
					createModelExplorer();
					Ext.MessageBox.updateProgress(0.5, '50% completed');
				}
			}, "json");
}

/**
 * Load MetaModel
 * グローバル変数g_modelにサーバからロードしたモデルをセットする。
 * @param pid
 */
function loadMetaModel(id) {
	alert('aaaaaaaaaaaaaaaa');
	Ext.MessageBox.show({title: 'Please wait',msg: 'Loading...',progressText: 'Initializing...',width:300,progress:true,closable:false,animEl: 'mb6'});
	$.post('/mload', { id : id },
			function(data) {
				if(data) {
					g_metamodelinfo = data;
					console.log('loaded json string = '+data.xml);
					if(data.xml == ' ' || data.xml == null || data.xml.length == 0) {
						g_metamodel = new MetaModel();
					}else{
						g_metamodel = JSON.parse(data.xml);
					}
					g_config_of_template = data.template;
					for(var i=0;i < g_metamodel.metaobjects.length;i++) {
						if(g_metamodel.metaobjects[i] != null) {
							metaobject_IdGenerator.setOffset(g_metamodel.metaobjects[i].id);
						}
					}
//					g_model = parseModelXML(data.xml);
					Ext.MessageBox.hide();
				}
			}, "json");
}

function Generate(pid, target) {
	Ext.MessageBox.show({title: 'Please wait',msg: 'Generating...',progressText: 'Generating...',width:300,progress:true,closable:false,animEl: 'mb6'});
	$.post('/gen', { pid : pid, target : target },
			function(data) {
				Ext.MessageBox.hide();
				Ext.MessageBox.alert('結果', data);
			}, "json").error(function() { alert("error");Ext.MessageBox.hide(); });
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
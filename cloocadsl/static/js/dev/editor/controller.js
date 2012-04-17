/**
 * commit
 * @param pid
 */
function commit() {
	$.post('/mvcs/commit', { pid : g_projectinfo.id },
			function(data) {
				if(data) {
					console.log('commit state = '+data);
				}
			}, "json");
}

/**
 * update
 * @param pid
 */
function update() {
	$.post('/mvcs/update', { pid : g_projectinfo.id },
			function(data) {
				if(data) {
					console.log('loaded json string = '+data);
					g_model = JSON.parse(data);
//					g_model = eval('(' + data + ')');
					/*
					g_metamodel_id = data.metamodel_id;
					loadMetaModel(data.metamodel_id);
//					g_model = parseModelXML(data.xml);
					for(var i=0;i < g_model.root.objects.length;i++) {
						object_IdGenerator.setOffset(g_model.root.objects[i].id);
					}
					*/
					createModelExplorer();
				}
			}, "json");
}

/**
 * update_to_ver
 * @param ver
 */
function update_to_ver(ver) {
	$.post('/mvcs/update_to_version', { pid : g_projectinfo.id , version : ver},
			function(data) {
				if(data) {
					console.log('loaded json string = '+data);
					g_model = JSON.parse(data);
//					g_model = eval('(' + data + ')');
					/*
					g_metamodel_id = data.metamodel_id;
					loadMetaModel(data.metamodel_id);
//					g_model = parseModelXML(data.xml);
					for(var i=0;i < g_model.root.objects.length;i++) {
						object_IdGenerator.setOffset(g_model.root.objects[i].id);
					}
					*/
					createModelExplorer();
				}
			}, "json");
}

/**
 * marge
 * @param model1
 * @param model2
 */
function marge(model1, model2) {
	for(var key in model1.diagrams) {
		dgm = g_model.diagrams[key]
		if(dgm == null) continue;
		diagram_IdGenerator.setOffset(dgm.id);
	}
	for(var key in model1.objects) {
		obj = g_model.objects[key]
		if(obj == null) continue;
		object_IdGenerator.setOffset(obj.id);
		calObjHeight(obj);
	}
	for(var key in model1.relationships) {
		rel = g_model.relationships[key]
		if(rel == null) continue;
		object_IdGenerator.setOffset(rel.id);
	}
	for(var key in model1.properties) {
		var prop = g_model.properties[key];
		if(prop == null) continue;
		property_IdGenerator.setOffset(prop.id);
	}

}


/**
 * create_rep
 */
function create_rep() {
	 Ext.Msg.prompt('確認','リポジトリの使用は特別サービスです。リポジトリを作成しますか？',function(btn, text){
		 if(btn != 'no' && text.length != 0) {
				$.post('/mvcs/create_rep', { pid : g_project_id, name : text},
						function(data) {
							if(data) {
								console.log('loaded json string = '+data.xml);
							}
						}, "json");
		 }
	 },null,true);
}

/**
 * clear_rep
 */
function clear_rep(rep_id) {
	$.post('/mvcs/clear_rep', { rep_id : rep_id },
			function(data) {
				if(data) {
					console.log('loaded json string = '+data.xml);
				}
			}, "json");
}

/**
 * delete_rep
 */
function delete_rep(rep_id) {
	$.post('/mvcs/delete_rep', { rep_id : rep_id },
			function(data) {
				if(data) {
					console.log('Success');
				}else{
					console.log('Failure');
				}
			}, "json");
}

/**
 * rep_list
 */
function rep_list() {
	$.post('/mvcs/rep_list', {},
			function(data) {
				if(data) {
					console.log('id\tname\thead_version');
					for(var i=0;i < data.length;i++) {
						console.log(data[i].id + '\t' + data[i].name + '\t' + data[i].head_version);
					}
				}
			}, "json");
}

/**
 * checkout
 */
function checkout(rep_id) {
	$.post('/mvcs/checkout', {pid:g_projectinfo.id, rep_id:rep_id},
			function(data) {
				if(data) {
				}
			}, "json");
}

function create_diagram() {
	var d = new Diagram();
	d.meta_id = 1;//g_metamodel.metadiagram;
	g_model.root = d.id;
	g_model.diagrams[d.id] = d;
	createModelExplorer();
}

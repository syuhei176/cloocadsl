/**
 * readProject
 * @param project
 */
function readProject(project) {
	Ext.MessageBox.show({title: 'Please wait',msg: 'Loading...',progressText: 'Initializing...',width:300,progress:true,closable:false,animEl: 'mb6'});
	if(project) {
		console.log('loaded json string = '+project.xml);
		g_projectinfo = project;
		g_metamodel_id = g_projectinfo.metamodel_id;
		if(g_projectinfo.metamodel.xml == ' ' || g_projectinfo.metamodel.xml == null || g_projectinfo.metamodel.xml.length == 0) {
			g_metamodel = new MetaModel();
		}else{
			g_metamodel = JSON.parse(g_projectinfo.metamodel.xml);
		}
		alert(g_projectinfo.metamodel.config);
		g_projectinfo.metamodel.config = JSON.parse(g_projectinfo.metamodel.config);
		readModel(project.xml);
	}
}

/**
 * readModel
 */
function readModel(xml) {
	console.log('loaded json string = '+xml);
	diagram_IdGenerator.setOffset(g_projectinfo.id * 10000);
	if(xml == 'null' || xml == '') {
		g_model = new Model();
		Ext.MessageBox.hide();
		Ext.Msg.prompt('ダイアグラム','新規作成',function(btn,text){
    		 if(btn != 'cancel') {
    			 	var d = ModelController.addDiagram(g_metamodel.metadiagram);
    				g_model.root = d.id;
        			var meta_diagram = g_metamodel.metadiagrams[d.meta_id];
        			if(meta_diagram.instance_name != null && meta_diagram.instance_name != undefined) {
        				var name_id = g_metamodel.metaproperties[meta_diagram.properties[meta_diagram.instance_name]].id;
        				var prop = null;
        				for(var j=0;j<d.properties.length;j++) {
        					if(d.properties[j].meta_id == name_id) {
        						prop = d.properties[j];
        					}
        				}
        				g_model.properties[prop.children[0]].value = text
        			}
        			diagram_IdGenerator.setOffset(g_model.root);
    				createModelExplorer();
    		 }
    	 },null,false,'');
	}else{
		g_model = JSON.parse(xml);
		Ext.MessageBox.hide();
		createModelExplorer();
	}
	/*
		g_metamodel_id = g_projectinfo.metamodel_id;
		if(g_projectinfo.metamodel.xml == ' ' || g_projectinfo.metamodel.xml == null || g_projectinfo.metamodel.xml.length == 0) {
			g_metamodel = new MetaModel();
		}else{
			g_metamodel = JSON.parse(g_projectinfo.metamodel.xml);
		}
	*/
//		loadMetaModel(g_projectinfo.metamodel_id);
		/*
		 * IDジェネレータの初期値を設定する。
		*/
//		object_IdGenerator.setOffset(g_projectinfo.id * 10000);
//		property_IdGenerator.setOffset(g_projectinfo.id * 10000);
		for(var key in g_model.diagrams) {
			obj = g_model.diagrams[key]
			if(obj == null) continue;
			if(obj.user_id != g_userinfo.id) continue;
			diagram_IdGenerator.setOffset(obj.id);
		}
		for(var key in g_model.objects) {
			obj = g_model.objects[key]
			if(obj == null) continue;
			if(obj.user_id != g_userinfo.id) continue;
			object_IdGenerator.setOffset(obj.id);
		}
		for(var key in g_model.objects) {
			obj = g_model.objects[key]
			calObjHeight(obj);
			if(obj.ofd == undefined) {
				obj.ofd = {z : 0};
			}
		}
		for(var key in g_model.relationships) {
			obj = g_model.relationships[key]
			if(obj == null) continue;
			if(obj.user_id != g_userinfo.id) continue;
			object_IdGenerator.setOffset(obj.id);
		}
		for(var key in g_model.relationships) {
			obj = g_model.relationships[key]
			if(obj.rfd == undefined) {
				obj.rfd = {z : 0};
			}
		}
		for(var key in g_model.properties) {
			var prop = g_model.properties[key];
			if(prop == null) continue;
			if(prop.user_id != g_userinfo.id) continue;
			property_IdGenerator.setOffset(prop.id);
		}
}


function showGenerateWindow() {
	if(g_projectinfo.metamodel.config.editor.generatable){
		
	}else{
		Ext.Msg.alert('ソースコード生成はできません。');
		return;
	}
	var selected_target = null;
	var target_status = Ext.create('Ext.data.Store', {
	    fields: ['name'],
	    data : g_projectinfo.metamodel.config.targets
	});

	var win = Ext.create('Ext.window.Window', {
	    title: 'Generate',
	    width: 280,
	    height: 200,
	    layout: 'vbox',
	    items: [{
	    	xtype: 'combo',
	        fieldLabel: 'target',
	        store: target_status,
	        queryMode: 'local',
	        displayField: 'name',
	        valueField: 'name',
	            listeners:{
	            	scope: this,
	                'select': function(combo, records, option){
	                	selected_target = combo.getValue();
	                }
	           }
	    },{
	    	xtype: 'button',
	        text: 'OK',
	        handler: function() {
	        	if(selected_target) {
		        	Generate(g_project_id, selected_target);
		        	win.hide();
	        	}else{
	        		Ext.Msg.alert('ターゲットを選択してください。');
	        	}
	        }
	    }]
	});
	win.show();
}

function showDownloadWindow() {
	if(g_projectinfo.metamodel.config.editor.generatable){
		
	}else{
		Ext.Msg.alert('ソースコード生成はできません。');
		return;
	}
	var selected_target = null;
	var targets = [];
	for(var i=0;i < g_projectinfo.metamodel.config.targets.length;i++) {
		if(g_projectinfo.metamodel.config.targets[i].downloadable) {
			targets.push(g_projectinfo.metamodel.config.targets[i]);
		}
	}
	var target_status = Ext.create('Ext.data.Store', {
	    fields: ['name'],
	    data : targets
	});

	var win = Ext.create('Ext.window.Window', {
	    title: 'Download',
	    width: 280,
	    height: 200,
	    layout: 'vbox',
	    items: [{
	    	xtype: 'combo',
	        fieldLabel: 'target',
	        store: target_status,
	        queryMode: 'local',
	        displayField: 'name',
	        valueField: 'name',
	            listeners:{
	            	scope: this,
	                'select': function(combo, records, option){
	                	selected_target = combo.getValue();
	                }
	           }
	    },{
	    	xtype: 'button',
	        text: 'OK',
	        handler: function() {
	        	if(selected_target) {
		        	Generate(g_project_id, selected_target, function(status){
		        		if(status) {
			        		download(g_projectinfo.id);
		        		}
		        	});
		        	win.hide();
	        	}else{
	        		Ext.Msg.alert('ターゲットを選択してください。');
	        	}
	        }
	    }]
	});
	win.show();
}

function showRunWindow() {
	if(g_projectinfo.metamodel.config.editor.generatable){
		
	}else{
		Ext.Msg.alert('ソースコード生成はできません。');
		return;
	}
	var selected_target = null;
	var targets = [];
	for(var i=0;i < g_projectinfo.metamodel.config.targets.length;i++) {
		if(g_projectinfo.metamodel.config.targets[i].runnable) {
			targets.push(g_projectinfo.metamodel.config.targets[i]);
		}
	}
	var target_status = Ext.create('Ext.data.Store', {
	    fields: ['name'],
	    data : targets
	});

	var win = Ext.create('Ext.window.Window', {
	    title: 'Run',
	    width: 280,
	    height: 200,
	    layout: 'vbox',
	    items: [{
	    	xtype: 'combo',
	        fieldLabel: 'target',
	        store: target_status,
	        queryMode: 'local',
	        displayField: 'name',
	        valueField: 'name',
	            listeners:{
	            	scope: this,
	                'select': function(combo, records, option){
	                	selected_target = combo.getValue();
	                }
	           }
	    },{
	    	xtype: 'button',
	        text: 'OK',
	        handler: function() {
	        	if(selected_target) {
		        	Generate(g_project_id, selected_target);
		        	win.hide();
	        	}else{
	        		Ext.Msg.alert('ターゲットを選択してください。');
	        	}
	        }
	    }]
	});
	win.show();
}

function showDeployWindow() {
	if(g_projectinfo.metamodel.config.editor.generatable){
		
	}else{
		Ext.Msg.alert('ソースコード生成はできません。');
		return;
	}
	var selected_target = null;
	var targets = [];
	for(var i=0;i < g_projectinfo.metamodel.config.targets.length;i++) {
		if(g_projectinfo.metamodel.config.targets[i].deploy) {
			targets.push(g_projectinfo.metamodel.config.targets[i]);
		}
	}
	var target_status = Ext.create('Ext.data.Store', {
	    fields: ['name'],
	    data : targets
	});

	var win = Ext.create('Ext.window.Window', {
	    title: 'Deploy',
	    width: 280,
	    height: 200,
	    layout: 'vbox',
	    items: [{
	    	xtype: 'combo',
	        fieldLabel: 'target',
	        store: target_status,
	        queryMode: 'local',
	        displayField: 'name',
	        valueField: 'name',
	            listeners:{
	            	scope: this,
	                'select': function(combo, records, option){
	                	selected_target = combo.getValue();
	                }
	           }
	    },{
	    	xtype: 'button',
	        text: 'OK',
	        handler: function() {
	        	if(selected_target) {
		        	Generate(g_project_id, selected_target);
		        	win.hide();
	        	}else{
	        		Ext.Msg.alert('ターゲットを選択してください。');
	        	}
	        }
	    }]
	});
	win.show();
}


/**
 * commit
 * @param pid
 */
function commit() {
	g_model.id = g_projectinfo.id;
	var xml = JSON.stringify(g_model);
	 Ext.Msg.prompt('コミットします。','コメントを書いてください。',function(btn,text){
		 if(btn != 'cancel') {
				Ext.MessageBox.show({title: 'Please wait',msg: 'Commit',progressText: 'Initializing...',width:300,progress:true,closable:false,animEl: 'mb6'});
				$.post('/mvcs/commit', { pid : g_projectinfo.id, comment : text, xml : xml },
						function(data) {
							if(data) {
								console.log('commit state = '+data);
								Ext.MessageBox.hide();
								if(data == 1) {
									Ext.MessageBox.alert("コミットステート","成功");
									update();
								}else if(data == 2) {
									Ext.MessageBox.alert("コミットステート","最新バージョンに更新してください。");
								}else if(data == 3) {
									Ext.MessageBox.alert("コミットステート","変更がありません。");
								}
							}else{
								Ext.MessageBox.hide();
								Ext.MessageBox.alert("コミットステート","失敗：リポジトリが存在しないか、チェックアウトしていません。");
							}
						}, "json");
		 }
	 },null,true,'');
}

/**
 * update
 * @param pid
 */
function update() {
	Ext.MessageBox.show({title: 'Please wait',msg: 'Update',progressText: 'Initializing...',width:300,progress:true,closable:false,animEl: 'mb6'});
	$.post('/mvcs/update', { pid : g_projectinfo.id },
			function(data) {
				if(data.ret_state == 0){
					console.log('loaded json string = '+data.xml);
					g_projectinfo.xml = data.xml;
					readModel(data.xml);
					createModelExplorer();
					Ext.MessageBox.hide();
					editortabpanel.close();
				}else{
					alert('update error');
					Ext.MessageBox.hide();
				}
			}, "json");
}

/**
 * update_to_ver
 * @param ver
 */
function update_to_ver(ver, cb) {
	$.post('/mvcs/update_to_version', { pid : g_projectinfo.id , version : ver},
			function(data) {
		if(data.ret_state == 0){
			console.log('loaded json string = '+data.xml);
			g_projectinfo.xml = data.xml;
			readModel(data.xml);
			createModelExplorer();
			Ext.MessageBox.hide();
			editortabpanel.close();
			cb();
		}else{
			alert('update error');
			Ext.MessageBox.hide();
		}
			}, "json");
}

/**
 * create_rep
 */
function create_rep() {
	 Ext.Msg.prompt('確認','リポジトリを作成しますか？',function(btn, text){
		 if(btn != 'no' && text.length != 0) {
				$.post('/mvcs/create_rep', { pid : g_project_id, name : text, group_id : g_projectinfo.group.id },
						function(data) {
							if(data) {
								
							}else{
								Ext.Msg.alert('文字数が多すぎます。');
							}
						}, "json");
		 }
	 },null,false);
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
function delete_rep(rep_id, cb) {
	$.post('/mvcs/delete_rep', { rep_id : rep_id, group_id : g_projectinfo.group.id},
			function(data) {
				if(data) {
					console.log('Success');
					cb();
				}else{
					console.log('Failure');
				}
			}, "json");
}

/**
 * history view
 */
function history_view() {
	$.post('/mvcs/gethistory', {pid : g_projectinfo.id},
			function(data) {
				if(data) {
					console.log('version\tcomment');
					for(var i=0;i < data.length;i++) {
						console.log(data[i].version + '\t' + data[i].content);
					}
				}
			}, "json");
}


/**
 * ver_list
 */
function ver_list() {
	$.post('/mvcs/ver_list', {pid : g_projectinfo.id},
			function(data) {
				if(data) {
					console.log('version\tcomment');
					for(var i=0;i < data.length;i++) {
						console.log(data[i].version + '\t' + data[i].content);
					}
				}
			}, "json");
}



/**
 * rep_list
 */
function rep_list() {
	$.post('/mvcs/group_rep_list', {group_id : g_projectinfo.group.id},
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
function checkout(rep_id, cb) {
	$.post('/mvcs/checkout', {pid:g_projectinfo.id, rep_id:rep_id},
			function(data) {
				if(data.ret_state == 0){
					readModel(data.xml);
					cb();
				}else{
					alert('checkout error');
				}
			}, "json");
}

/**
 * import_to_rep
 */
function import_to_rep(rep_id, cb) {
	g_model.id = g_projectinfo.id;
	var xml = JSON.stringify(g_model);
	$.post('/mvcs/import', {xml:xml, rep_id:rep_id},
			function(data) {
				if(data == 1){
					cb();
				}else{
					alert('checkout error');
				}
			}, "json");
}

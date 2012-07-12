function readProject(project) {
	var format_version = 1;
	if(project.format_version == undefined) {
		format_version = 1;
	}else{
		format_version = project.format_version;
	}
	if(format_version == 1) {
		readProject_ver1(project);
	}else if(format_version == 2) {
		readProject_ver2(project);
	}
}

function readProject_ver2(project) {
	Ext.MessageBox.show({title: 'Please wait',msg: 'Loading...',progressText: 'Initializing...',width:300,progress:true,closable:false,animEl: 'mb6'});
	if(project) {
//		console.log('loaded json string = '+project.xml);
		g_projectinfo = project;
		g_metamodel_id = g_projectinfo.metamodel_id;
		if(g_projectinfo.metamodel.xml == ' ' || g_projectinfo.metamodel.xml == null || g_projectinfo.metamodel.xml.length == 0) {
			g_metamodel = new MetaModel();
		}else{
			g_metamodel = JSON.parse(g_projectinfo.metamodel.xml);
		}
//		alert(g_projectinfo.metamodel.config);
		metadiagrams_length = 0;
		for (a in g_metamodel.metadiagrams) {
			metadiagrams_length++;
		}
		if(metadiagrams_length == 0) {
			//ダイアグラムが一つもない
			alert("ダイアグラムが一つもありません。");
			window.close();
		}
		g_projectinfo.metamodel.config = JSON.parse(g_projectinfo.metamodel.config);
		readModel_ver2(g_projectinfo.xml);
	}
}

/**
 * readModel
 */
function readModel_ver2(xml) {
	console.log('loaded json string = '+xml);
	if(xml == 'null' || xml == '' || xml == undefined) {
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
                	g_modelExplorer = new ModelExplorer();
    		 }
    	 },null,false,'');
	}else{
		g_model = JSON.parse(xml);
		Ext.MessageBox.hide();
    	g_modelExplorer = new ModelExplorer();
	}
	/*
	 * IDジェネレータの初期値を設定する。
	*/
	for(var key in g_model.diagrams) {
		obj = g_model.diagrams[key]
		if(obj == null) continue;
//		if(obj.user_id != g_userinfo.id) continue;
		if(g_projectinfo.id * 10000 <= obj.id && (g_projectinfo.id + 1) * 10000 > obj.id) {
			diagram_IdGenerator.setOffset(obj.id);
		}
	}
	for(var key in g_model.objects) {
		obj = g_model.objects[key]
		if(obj == null) continue;
//		if(obj.user_id != g_userinfo.id) continue;
		if(g_projectinfo.id * 10000 <= obj.id && (g_projectinfo.id + 1) * 10000 > obj.id) {
			object_IdGenerator.setOffset(obj.id);
		}
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
//		if(obj.user_id != g_userinfo.id) continue;
		if(g_projectinfo.id * 10000 <= obj.id && (g_projectinfo.id + 1) * 10000 > obj.id) {
			object_IdGenerator.setOffset(obj.id);
		}
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
//		if(prop.user_id != g_userinfo.id) continue;
		if(g_projectinfo.id * 10000 <= prop.id && (g_projectinfo.id + 1) * 10000 > prop.id) {
			property_IdGenerator.setOffset(prop.id);
		}
	}
}



/**
 * readProject
 * @param project
 */
function readProject_ver1(project) {
	Ext.MessageBox.show({title: 'Please wait',msg: 'Loading...',progressText: 'Initializing...',width:300,progress:true,closable:false,animEl: 'mb6'});
	if(project) {
//		console.log('loaded json string = '+project.xml);
		g_projectinfo = project;
		g_metamodel_id = g_projectinfo.metamodel_id;
		if(g_projectinfo.metamodel.xml == ' ' || g_projectinfo.metamodel.xml == null || g_projectinfo.metamodel.xml.length == 0) {
			g_metamodel = new MetaModel();
		}else{
			g_metamodel = JSON.parse(g_projectinfo.metamodel.xml);
		}
//		alert(g_projectinfo.metamodel.config);
		metadiagrams_length = 0;
		for (a in g_metamodel.metadiagrams) {
			metadiagrams_length++;
		}
		if(metadiagrams_length == 0) {
			//ダイアグラムが一つもない
			alert("ダイアグラムが一つもありません。");
			window.close();
		}
		g_projectinfo.metamodel.config = JSON.parse(g_projectinfo.metamodel.config);
		readModel(g_projectinfo.xml);
	}
}

/**
 * readModel
 */
function readModel(xml) {
	console.log('loaded json string = '+xml);
	if(xml == 'null' || xml == '' || xml == undefined) {
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
                	g_modelExplorer = new ModelExplorer();
    		 }
    	 },null,false,'');
	}else{
		g_model = JSON.parse(xml);
		Ext.MessageBox.hide();
    	g_modelExplorer = new ModelExplorer();
	}
	/*
	 * IDジェネレータの初期値を設定する。
	*/
	for(var key in g_model.diagrams) {
		obj = g_model.diagrams[key]
		if(obj == null) continue;
//		if(obj.user_id != g_userinfo.id) continue;
		if(g_projectinfo.id * 10000 <= obj.id && (g_projectinfo.id + 1) * 10000 > obj.id) {
			diagram_IdGenerator.setOffset(obj.id);
		}
	}
	for(var key in g_model.objects) {
		obj = g_model.objects[key]
		if(obj == null) continue;
//		if(obj.user_id != g_userinfo.id) continue;
		if(g_projectinfo.id * 10000 <= obj.id && (g_projectinfo.id + 1) * 10000 > obj.id) {
			object_IdGenerator.setOffset(obj.id);
		}
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
//		if(obj.user_id != g_userinfo.id) continue;
		if(g_projectinfo.id * 10000 <= obj.id && (g_projectinfo.id + 1) * 10000 > obj.id) {
			object_IdGenerator.setOffset(obj.id);
		}
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
//		if(prop.user_id != g_userinfo.id) continue;
		if(g_projectinfo.id * 10000 <= prop.id && (g_projectinfo.id + 1) * 10000 > prop.id) {
			property_IdGenerator.setOffset(prop.id);
		}
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

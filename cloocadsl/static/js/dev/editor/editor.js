Ext.require([
    'Ext.panel.*',
    'Ext.toolbar.*',
    'Ext.button.*',
    'Ext.container.ButtonGroup',
    'Ext.layout.container.Table'
]);

/**
 * 
 * @param project
 * @param is_preview
 */
function init_clooca(project, is_preview, option) {
	g_editor_option = option;
	current_editor = null;
	g_project_id = project.id;
	g_projectinfo = project;
	_is_preview = is_preview;
	/*
	new Ext.Viewport({
		layout:'border',
		items:[
		       new Ext.Panel({
		    	   id: 'centerpanel',
		    	   html:'',
		    	   width:'100px',
		    	   region:'center',
		    	   layout: 'fit',
		    	   items : [create_tabs()]
		       }),
		       new Ext.Panel({
		    	   id:'menupanel',
		    	   margins:'0 3 0 3',
		    	   region:'north',
		    	   items: []
		       }),
		       new Ext.Panel({
		    	   id:'propertypanel',
		    	   title: 'property',
		    	   html:'',
		    	   margins:'3 3 3 3',
		    	   region:'south',
		    	   collapsible:true,
		    	   split:true,
		    	   items : []
		    	   }),
		       new Ext.Panel({
		     	   id:'toolpanel',
		    	   title:'Tool',
		    	   html:'toolbuttons',
		    	   margins:'0 3 0 3',
		    	   region:'east',
		    	   collapsible:true,
		    	   split:true,
		       layout: {
		    	    type: 'vbox',
		    	    align : 'stretch',
		    	    pack  : 'start'
		    	},
		    	items: [
		    	    {html:'panel 1', flex:1},
		    	    {html:'panel 3', flex:2}
		    	]
		       }),
		       new Ext.Panel({
		    	   id:'modelexplorer',
		    	   title:'Model Explorer',
		    	   html:' ',
		    	   margins:'0 0 0 3',
		    	   region:'west',
		    	   collapsible:true,
		    	   split:true,
		    	   items: []
		       }),
		       ]
	});
	*/
	readProject(project);
	Ext.getCmp('menupanel').add(create_menu());
	Ext.getCmp('centerpanel').add(create_tabs());
	if(g_editor_option.diagram_open) {
		for(var key in g_model.diagrams) {
			g_modelExplorer.open_diagram(g_model.diagrams[key], g_model.diagrams[key].id);
		}
	}
	window.onbeforeunload = function(){
		return "このページから移動しますか？ データは保存されません。"; 
	}
}

function create_tabs() {
	editortabpanel = new EditorTabPanel();
	editortabpanel.add(new WelcomeMessageView(), 'welcome');
	return editortabpanel.getPanel();
}

function create_menu() {
	var generatable_is_hidden = false;
	if(g_projectinfo.metamodel.config.editor.generatable) {
		generatable_is_hidden = false;
	}else{
		generatable_is_hidden = true;
	}
	var common_menu = {
        tbar: [{
            text: 'Edit',
            iconCls: 'add16',
            menu: [
                   {
                	   id: 'open',
                	   text: '開く',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   },{
                	   id: 'delete',
                	   text: '削除',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   },{
                	   id: 'deletePoints',
                	   text: 'ポイントを削除',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   },{
                	   id: 'diagram',
                	   text: 'ダイアグラム',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   },{
                	   text: 'エクスポート',
                	   iconCls: 'add16',
                	   menu: [{
                    	   id: 'png',
                    	   text: 'png',
                    	   iconCls: 'add16',
                    	   handler : onItemClick
                       },{
                    	   id: 'jpg',
                    	   text: 'jpg',
                    	   iconCls: 'add16',
                    	   handler : onItemClick
                       }]
                   }
                   ],
        	handler : onItemClick
        },{
            text: 'プロジェクト',
            iconCls: 'add16',
            menu: [
                   {
                	   id: 'generate',
                	   text: 'generate',
                	   iconCls: 'add16',
                	   handler: onProjItemClick,
                	   hidden: generatable_is_hidden
                   },{
                	   id: 'download',
                	   text: 'Download',
                	   iconCls: 'add16',
                	   handler : onProjItemClick,
                	   hidden: generatable_is_hidden
                   },{
                	   id: 'run',
                	   text: 'Run',
                	   iconCls: 'add16',
                	   handler : onProjItemClick,
                	   hidden: generatable_is_hidden
                   },{
                	   id: 'deploy',
                	   text: 'Deploy',
                	   iconCls: 'add16',
                	   handler : onProjItemClick,
                	   hidden: generatable_is_hidden
                   },{
                	   id: 'pviewer',
                	   text: 'プロジェクト情報',
                	   iconCls: 'add16',
                	   handler : onProjItemClick
                   }
                   ]
        },'-',{
            id: 'save',
            text: '保存',
            iconCls: 'add16',
        	handler : onItemClick
        }]
    }
		common_menu.tbar.push({
            text: 'リポジトリ',
            iconCls: 'add16',
            menu: [
                   {
                	   id: 'manage_repository',
                	   text: 'リポジトリ',
                	   iconCls: 'add16',
                       menu: [{
                    	   id: 'create_rep',
                    	   text: 'リポジトリ作成',
                    	   iconCls: 'add16',
                    	   handler : onRepItemClick
                       },{
                    	   id: 'clear_rep',
                    	   text: 'リポジトリ削除',
                    	   iconCls: 'add16',
                    	   handler : onRepItemClick
                       },{
                    	   id: 'import',
                    	   text: 'インポート',
                    	   iconCls: 'add16',
                    	   handler : onRepItemClick
                       },{
                    	   id: 'checkout',
                    	   text: 'チェックアウト',
                    	   iconCls: 'add16',
                    	   handler : onRepItemClick
                       }
                       ]
                   },{
                	   id: 'commit',
                	   text: 'コミット',
                	   iconCls: 'add16',
                	   handler : onRepItemClick
                   },{
                	   id: 'update',
                	   text: 'アップデート',
                	   iconCls: 'add16',
                	   handler : onRepItemClick
                   },{
                	   id: 'update_to_ver',
                	   text: '前のバージョンに戻す',
                	   iconCls: 'add16',
                	   handler : onRepItemClick
                   },{
                	   id: 'history',
                	   text: 'ヒストリー',
                	   iconCls: 'add16',
                	   handler : onRepItemClick
                   }
                   ],
        	handler : onItemClick
        });
	/*
		common_menu.tbar.push({
            text: 'バイナリ',
            iconCls: 'add16',
            menu: [
                   {
                	   id: 'genbin',
                	   text: 'バイナリ生成',
                	   iconCls: 'add16',
                	   handler : onShinshuItemClick
                   }
                   ],
        	handler : onItemClick
        });
        */
	return common_menu;
}

function onItemClick(item){
	if(item.id == 'open') {
    	g_modelExplorer.open_selected_diagram();
	}else if(item.id == 'exit') {
		window.opener="dummy";
		window.open("about:blank","_self").close();
	}else if(item.id == 'save') {
		saveModel(g_project_id);
	}else if(item.id == 'diagram') {
		if(current_editor != null && current_editor.selected != null && g_metamodel.metaobjects[current_editor.selected.meta_id].decomposition != null && current_editor.selected.diagram == null) {
			show_setting_diagram_name_window(g_metamodel.metaobjects[current_editor.selected.meta_id].decomposition, function(d){
				current_editor.selected.diagram = d.id;
			});
		}else{
			show_create_diagram_window();
		}
	}else if(item.id == 'png') {
		current_editor.getImage('png');
	}else if(item.id == 'jpg') {
		current_editor.getImage('jpg');
	}else if(item.id == 'delete') {
		current_editor.deleteSelected();
	}else if(item.id == 'deletePoints') {
		current_editor.deletePoint();
	}else{
		
	}
//    Ext.example.msg('Menu Click', 'You clicked the "{0}" menu item.', item.text);
}

function onFileItemClick(item){
	if(item.id == 'create_rep') {
		create_rep();
	}else if(item.id == 'clear_rep') {
		clear_rep();
	}
}

function onProjItemClick(item){
	if(item.id == 'generate') {
		showGenerateWindow();
//		Generate(g_project_id);
	}else if(item.id == 'download') {
		showDownloadWindow();
//		download(g_project_id);
	}else if(item.id == 'run') {
		showRunWindow();
	}else if(item.id == 'deploy') {
		showDeployWindow();
	}else if(item.text == 'genbin') {
		genbin(g_project_id);
	}else if(item.id == 'pviewer') {
		var editor = new ProjectInfoViewer();
		editortabpanel.add(editor, 'pviewer');
	}
}

function onRepItemClick(item){
	if(item.id == 'create_rep') {
		create_rep();
	}else if(item.id == 'clear_rep') {
		delete_rep_view();
	}else if(item.id == 'checkout') {
		checkoutview();
	}else if(item.id == 'commit') {
		commit();
	}else if(item.id == 'update') {
		Ext.MessageBox.confirm("確認", "自分の変更とリポジトリをマージさせたい時は、まず保存をしてくださいね。保存していない場合は、「No」を押して、保存してください。　アップデートしますか？", function(btn) {
			if (btn == "yes") {
				update();
			} else if (btn == "no") {
				
			}
		}, window);
	}else if(item.id == 'update_to_ver') {
		update_to_ver_view();
	}else if(item.id == 'history') {
		window.open('/mvcs/viewer/'+g_projectinfo.rep_id);
		$.post('/mvcs/gethistory', {pid : g_projectinfo.id},
				function(data) {
			for(var key in data.verlist) {
				console.log(data.verlist[key].version, data.verlist[key].content);
				for(var i=0;i < data.verlist[key].changes.length;i++) {
					console.log(data.verlist[key].changes[i].ver_type + ',' + data.verlist[key].changes[i].type);
				}
			}
				}, "json");
	}else if(item.id == 'import') {
		import_to_rep_view();
	}
}

function onShinshuItemClick(item){
	if(item.id == 'genbin') {
		genbin(g_project_id);
	}
}

function ModelExplorer() {
	var self = this;
	this.selected_diagram = null;
	var diagrams = [];
	for(var key in g_model.diagrams) {
//		console.log("createModelExplorer "+key);
		if(g_model.diagrams[key].ve.ver_type != 'delete') {
			var diagram = g_model.diagrams[key];
			var _is_root = false;
			if(diagram.id == g_model.root) {
				_is_root = true;
			}
			var meta_diagram = g_metamodel.metadiagrams[diagram.meta_id];
			var dname = 'diagram_' + key;
			if(meta_diagram.instance_name != null && meta_diagram.instance_name != undefined) {
				var name_id = g_metamodel.metaproperties[meta_diagram.properties[meta_diagram.instance_name]].id;
				var prop = null;
				for(var j=0;j<diagram.properties.length;j++) {
					if(diagram.properties[j].meta_id == name_id) {
						prop = diagram.properties[j];
					}
				}
				dname = g_model.properties[prop.children[0]].value;
			}
			dname += '(' + meta_diagram.name + ')';
			if(_is_root) {
				diagrams.push({id: key, text: dname, leaf: true, icon: '/static/images/editor/root_leaf.gif'});
			}else{
				diagrams.push({id: key, text: dname, leaf: true});
			}
		}
	}
	var store = Ext.create('Ext.data.TreeStore', {
	    root: {
	        expanded: true,
	        children: [
	            { text: "root", expanded: true, children: diagrams }
	        ]
	    }
	});
	var modelExplorer = Ext.create('Ext.tree.Panel', {
	    width: 240,
	    height: 280,
	    store: store,
	    rootVisible: false
	});
	modelExplorer.on('itemdblclick',function(view, record, item, index, event) {
		if(record.data.text != 'root') {
			var diagram = g_model.diagrams[record.data.id];
			self.open_diagram(diagram, record.data.id, record.data.text);
		}
    });
	var mnuContext = new Ext.menu.Menu({
	    items: [{
	        id: 'delete',
	        text: '削除'
	    },{
	        id: 'open',
	        text: '開く'
	    },{
	        id: 'change',
	        text: '名前を変更'
	    }],
	    listeners: {
        click: function(menu, item) {
            switch (item.id) {
                case 'delete':
                	ModelController.deleteDiagram(selected_diagram_id);
                    break;
                case 'open':
                	open_diagram(g_model.diagrams[selected_diagram_id], selected_diagram_name, selected_diagram_id);
                    break;
                case 'change':
                	change_diagram_name_view(g_model.diagrams[selected_diagram_id]);
                    break;
            }
        }
	    }
	});

	modelExplorer.on('itemmousedown',function(view, record, item, index, event) {
		self.selected_diagram = g_model.diagrams[record.data.id];
		if(event.button == 2) {
			mnuContext.showAt(event.getX(), event.getY());
			selected_diagram_id = record.data.id;
			selected_diagram_name = record.data.text;
		}
    });
	Ext.getCmp('modelexplorer').removeAll();
	Ext.getCmp('modelexplorer').add(modelExplorer);
	Ext.getCmp('modelexplorer').add({
		id: 'element-infomation',
		xtype: 'panel',
		    width: 200,
		    height: 200
	});
	this.panel = modelExplorer;
}

ModelExplorer.prototype.open_diagram = function(diagram,id,dname){
	return this.panel;	
}

ModelExplorer.prototype.open_selected_diagram = function(){
	this.open_diagram(this.selected_diagram,this.selected_diagram.id)
}

ModelExplorer.prototype.open_diagram = function(diagram,id,dname){
	var meta_diagram = g_metamodel.metadiagrams[diagram.meta_id];
	var editor;
	var title = dname;
	if(title == undefined) {
		if(meta_diagram.instance_name != null && meta_diagram.instance_name != undefined) {
			var name_id = g_metamodel.metaproperties[meta_diagram.properties[meta_diagram.instance_name]].id;
			var prop = null;
			for(var j=0;j<diagram.properties.length;j++) {
				if(diagram.properties[j].meta_id == name_id) {
					prop = diagram.properties[j];
				}
			}
			title = g_model.properties[prop.children[0]].value;
		}
	}
	if(meta_diagram.seq == true) {
    	editor = new SequenceEditor(title, id, diagram);
	}else{
    	editor = new DiagramEditor(title, id, diagram);
	}
	editortabpanel.add(editor, id);
}

function show_setting_diagram_name_window(meta_id, cb) {
  	 Ext.Msg.prompt('ダイアグラム','ダイアグラム名を入力してください。',function(btn,text){
		 if(btn != 'cancel') {
         	var d = ModelController.addDiagram(meta_id);
			var meta_diagram = g_metamodel.metadiagrams[d.meta_id];
			if(meta_diagram.instance_name != null && meta_diagram.instance_name != undefined) {
				var name_id = g_metamodel.metaproperties[meta_diagram.properties[meta_diagram.instance_name]].id;
				var prop = null;
				for(var j=0;j<d.properties.length;j++) {
					if(d.properties[j].meta_id == name_id) {
						prop = d.properties[j];
					}
				}
				g_model.properties[prop.children[0]].value = text;
			}
			if(cb != null) cb(d);
        	g_modelExplorer = new ModelExplorer();
        	win.hide();
		 }
	 },null,true,'');
}
function show_create_diagram_window() {
	var datas = [];
	for(var key in g_metamodel.metadiagrams) {
		datas.push(g_metamodel.metadiagrams[key]);
	}
	 var selModel = Ext.create('Ext.selection.RowModel', {
		 mode: 'SINGLE',
	        listeners: {
	            selectionchange: function(sm, selections) {
	                for(var i=0;i < selections.length;i++) {
	                	console.log(i + '=' + selections[i].get('id'));
	                }
	            }
	        }
	    });
	var win = Ext.create('Ext.window.Window', {
	    title: 'Diagram',
	    height: 200,
	    width: 400,
	    layout: 'fit',
	    items: [{
	        xtype: 'grid',
	        border: false,
	        columns: [{text: "name", dataIndex: 'name'}],
	        store: Ext.create('Ext.data.Store', {data:datas,fields:['id','name']}),
		    selModel: selModel,
		    dockedItems: [{
	            xtype: 'toolbar',
	            dock: 'bottom',
	            ui: 'footer',
	            layout: {
	                pack: 'center'
	            },
	            items: []
	        }, {
	            xtype: 'toolbar',
	            items: [{
	                text:'Create',
	                tooltip:'create',
	                iconCls:'add',
	                handler : function() {
	                	show_setting_diagram_name_window(selModel.getSelection()[0].get('id'), null);
	                }
	            }]
	        }]
	     }]
	});
	win.show();
}

function change_diagram_name_view(diagram) {
  	 Ext.Msg.prompt('ダイアグラム','名前の変更',function(btn,text){
		 if(btn != 'cancel') {
			var meta_diagram = g_metamodel.metadiagrams[diagram.meta_id];
			if(meta_diagram.instance_name != null && meta_diagram.instance_name != undefined) {
				var name_id = g_metamodel.metaproperties[meta_diagram.properties[meta_diagram.instance_name]].id;
				var prop = null;
				for(var j=0;j<diagram.properties.length;j++) {
					if(diagram.properties[j].meta_id == name_id) {
						prop = diagram.properties[j];
					}
				}
				var dc = new DiagramController(diagram);
				dc.updateProperty(g_model.properties[prop.children[0]], text, diagram);
			}
        	g_modelExplorer = new ModelExplorer();
		 }
	 },null,false,'');
}

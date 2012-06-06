Ext.require([
    'Ext.panel.*',
    'Ext.toolbar.*',
    'Ext.button.*',
    'Ext.container.ButtonGroup',
    'Ext.layout.container.Table',
    'Ext.tab.Panel'
]);

function init_wb(toolinfo) {
	g_toolinfo = toolinfo;
//	g_metamodel_id = id;
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
		    	   margins:'0 3 0 3',
		    	   region:'north',
		    	   items: [create_menu()]
		       }),
		       new Ext.Panel({
		    	   id:'propertypanel',
		    	   html:'',
		    	   margins:'3 3 3 3',
		    	   region:'south',
		    	   collapsible:true,
		    	   split:true,
		    	   items : [
		    	            ]
		    	   }),
		       new Ext.Panel({
		     	   id:'toolpanel',
		    	   title:'未使用タイトル',
		    	   html:'未使用パネル',
		    	   margins:'0 3 0 3',
		    	   region:'east',
		    	   collapsible:true,
		       layout: {
		    	    type: 'vbox',
		    	    align : 'stretch',
		    	    pack  : 'start'
		    	},
		    	items: [
		    	    {html:'未使用スペース', flex:1},
		    	]
		       }),
		       new Ext.Panel({
		    	   id:'modelexplorer',
		    	   title:'WEST',
		    	   html:'WEST PANEL',
		    	   margins:'0 0 0 3',
		    	   region:'west',
		    	   collapsible:true,
		    	   split:true,
		    	   items: []
		       }),
		       ]
	});

	wb_loadMetaModel(id);
}

function create_tabs() {
	editortabpanel = new EditorTabPanel();
	return editortabpanel.getPanel();
}

function create_menu() {
	return {
        tbar: [{
            xtype:'splitbutton',
            text: 'ファイル',
            iconCls: 'add16',
            menu: [
                   {
                	   text: '未実装',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   }
                   ],
        	handler : onItemClick
        },'-',{
            id: 'save',
            text: '保存',
            iconCls: 'add16',
        	handler : onItemClick
        },{
            text: 'ワークベンチ',
            iconCls: 'add16',
            menu: [
                   {
                	   id: 'preview',
                	   text: 'プレビュー（未実装）',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   },{
                	   id: 'MetaDiagram',
                	   text: 'メタダイアグラム',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   },{
                	   id: 'MetaObj',
                	   text: 'メタオブジェクト',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   },{
                	   id: 'MetaRel',
                	   text: 'メタリレーションシップ',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   },{
                	   id: 'MetaProp',
                	   text: 'メタプロパティ',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   },{
                	   id: 'metajson',
                	   text: 'メタモデル',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   },{
                	   id: 'welcome_editor',
                	   text: 'ウェルカムメッセージ',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   },{
                	   id: 'config',
                	   text: 'コンフィグ',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   }
                   ]
        },{
            text: 'テンプレート',
            iconCls: 'add16',
            menu: [
                   {
                	   id: 'new',
                	   text: '新規作成',
                	   iconCls: 'add16',
                	   handler : onTempItemClick
                   },
                   {
                	   id: 'import',
                	   text: 'インポート',
                	   iconCls: 'add16',
                	   handler : onTempItemClick
                   },
                   {
                	   id: 'export',
                	   text: 'エクスポート',
                	   iconCls: 'add16',
                	   handler : onTempItemClick
                   }
                   ]
        },{
        	id: 'vsibillity_setting',
        	xtype: 'combo',
            fieldLabel: '公開設定',
            store: Ext.create('Ext.data.Store', {
                fields: ['name', 'value'],
                data : [{"name":"非公開", "value":0},
                    {"name":"公開", "value":1}]}),
//                    {"name":"共有＆非公開", "value":2},
//                    {"name":"共有＆公開", "value":3}]}),
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            listeners:{
            	scope: this,
                'select': function(){
                	g_metaproject.visibillity = Ext.getCmp('vsibillity_setting').getValue();
                	saveAll(function(){});
                }
           }
        },{
        	id: 'name_setting',
        	xtype: 'textfield',
            fieldLabel: '名前',
            queryMode: 'local',
            listeners:{
            	scope: this,
                'change': function(){
                	g_metaproject.name = Ext.getCmp('name_setting').getValue();
                }
           }
        }]
    }
}

function onItemClick(item){
	if(item.id == 'save') {
		editortabpanel.current_editor.save();
	}else if(item.id == 'preview') {
		window.open('/wb/preview/'+g_metaproject.id);
	}else if(item.id == 'MetaDiagram') {
//		var editor = new MetaDiagramsEditor(g_metamodel.metadiagrams);
		var editor = new BaseGridEditor(g_metamodel.metadiagrams, 'MetaDiagram', function(d){
			show_setting_metadiagram_window(d, function(metadiagram) {
				alert(index);
				grid.getStore().getAt(index).set('name', metadiagram.name);
			});
	}, MetaDiagram);
		editortabpanel.add(editor, 'metadiagrams');
	}else if(item.id == 'MetaObj') {
		var editor = new BaseGridEditor(g_metamodel.metaobjects, 'MetaObjects', function(metaobj){
			console.log(metaobj.id);
			 Ext.Msg.prompt('編集','プロパティ',function(btn,text){
				 if(btn != 'cancel') {
					 g_metamodel.metaobjects[metaobj.id] = JSON.parse(text);
				 }
			 },null,true,JSON.stringify(metaobj));
		}, MetaObject);
		editortabpanel.add(editor, 'metaobjects');
	}else if(item.id == 'MetaRel') {
		var editor = new BaseGridEditor(g_metamodel.metarelations, 'MetaRelationships', function(metaobj){
			console.log(metaobj.id);
			 Ext.Msg.prompt('編集','プロパティ',function(btn,text){
				 if(btn != 'cancel') {
					 g_metamodel.metarelations[metaobj.id] = JSON.parse(text);
				 }
			 },null,true,JSON.stringify(metaobj));
		}, MetaRelation);
		editortabpanel.add(editor, 'metarelations');
	}else if(item.id == 'MetaProp') {
		var editor = new BaseGridEditor(g_metamodel.metaproperties, 'MetaProperties', function(metaprop){
			console.log(metaprop.id);
			 Ext.Msg.prompt('編集','プロパティ',function(btn,text){
				 if(btn != 'cancel') {
					 g_metamodel.metaproperties[metaprop.id] = JSON.parse(text);
				 }
			 },null,true,JSON.stringify(metaprop));
		}, MetaProperty);
//		var editor = new MetaPropertyEditor(g_metamodel.metaproperties);
		editortabpanel.add(editor, 'metaproperties');
	}else if(item.id == 'metajson') {
		var editor = new MetaJSONEditor(g_metamodel.metadiagrams);
		editortabpanel.add(editor, 'metajson');
	}else if(item.id == 'welcome_editor') {
		var editor = new WellcomeMessageEditor();
		editortabpanel.add(editor, 'welcome_editor');
	}else if(item.id == 'targets') {
//		show_targets_window();
	}else if(item.id == 'config') {
		var editor = new TempConfigEditor();
		editortabpanel.add(editor, 'tempconfig');
	}
}

function onTempItemClick(item){
	if(item.id == 'new') {
		 Ext.Msg.prompt('','',function(btn,text){
			 if(btn != 'cancel') {
				 create_new_template(text);
			 }
		 },null,false);
	}else if(item.id == 'import') {
		 Ext.Msg.prompt('','',function(btn,text){
			 if(btn != 'cancel') {
					import_template(text);
			 }
		 },null,true);
	}else if(item.id == 'export') {
		window.open('/template/export/'+g_metaproject.id);
	}
}

function export_template() {
	$.post('/template/tree', { id : g_metaproject.id},
			function(data) {
				if(data) {
					
				}
			}, "json");
}

function import_template(text) {
	$.post('/template/import', { id : g_metaproject.id, text: text},
			function(data) {
				if(data) {
					load_templates();
				}
			}, "json");
}

/*
 * wb/controller
 */
function load_templates() {
	$.post('/template/tree', { id : g_metaproject.id},
			function(data) {
				if(data) {
					g_templates = data;
					createTemplateExplorer();
				}
			}, "json");
}

function create_new_template(fname, path) {
	$.post('/template/new', { id : g_metaproject.id, fname : fname, path : path },
			function(data) {
				if(data) {
					load_templates();
				}
			}, "json");
}

function save_template(fname, target, content) {
	$.post('/template/save', { id : g_metaproject.id, fname : fname, target : target, content : content},
			function(data) {
				if(data) {
					
				}
			}, "json");
}

function del_template(fname, target) {
	$.post('/template/del', { id : g_metaproject.id, fname : fname, target : target},
			function(data) {
				if(data) {
					load_templates();
				}
			}, "json");
}

function createTemplateExplorer() {
	Ext.getCmp('modelexplorer').removeAll();
	var paths = [];
	for(var i=0;i < g_wbconfig.targets.length;i++) {
		paths.push({text: g_wbconfig.targets[i].name, children:[]});
	}
	for(var i=0;i < g_templates.length;i++) {
		var key = g_templates[i].name;
		var path_name = g_templates[i].path;
		for(var j=0;j < paths.length;j++) {
			if(paths[j].text == path_name) {
				paths[j].children.push({id: i, text: key, leaf: true });
				break;
			}
		}
	}

	var store = Ext.create('Ext.data.TreeStore', {
	    root: {
	        expanded: true,
	        children: [
	            { text: "templates", expanded: true, children: paths, root:true}
	        ]
	    }
	});
	var modelExplorer = Ext.create('Ext.tree.Panel', {
	    title: 'Template Explorer',
	    width: 200,
	    height: 200,
	    store: store,
	    rootVisible: false
	});
	modelExplorer.on('itemdblclick',function(view, record, item, index, event) {
		if(record.data.leaf) {
			var template = g_templates[record.data.id];
	    	editor = new TemplateEditor(template);
	    	editortabpanel.add(editor, template.path + ':' + template.name);
		}
    });
	/*
	 * 右クリックメニューの設定
	 */
	var mnuContext = new Ext.menu.Menu({
	    items: [{
	        id: 'new_target',
	        text: 'ターゲット作成'
	    }],
	    listeners: {
        click: function(menu, item) {
            switch (item.id) {
                case 'new_target':
             		 Ext.Msg.prompt('','',function(btn,text){
            			 if(btn != 'cancel') {
            				 if(text.length != 0) {
                				 g_wbconfig.targets.push({name:text,mapping:[]});
                					$.post('/tcsave', { id : g_metaproject.id, tc : JSON.stringify(g_wbconfig) },
                							function(data) {
                								if(data) {
                        							createTemplateExplorer();
                								}
                							}, "json");
                				 //update
            				 }
            			 }
            		 },null,false);
                    break;
            }
        }
	    }
	});
	var mnuContext2 = new Ext.menu.Menu({
	    items: [{
	        id: 'new',
	        text: '新規作成'
	    }],
	    listeners: {
        click: function(menu, item) {
            switch (item.id) {
                case 'new':
              		 Ext.Msg.prompt('','',function(btn,text){
            			 if(btn != 'cancel') {
            				 create_new_template(text, selected_item.text);
            			 }
            		 },null,false);
                    break;
            }
        }
	    }
	});
	var mnuContext3 = new Ext.menu.Menu({
	    items: [{
	        id: 'delete',
	        text: '削除'
	    }],
	    listeners: {
        click: function(menu, item) {
            switch (item.id) {
                case 'delete':
                	del_template(g_templates[selected_item.id].name, g_templates[selected_item.id].path);
                    break;
            }
        }
	    }
	});
	modelExplorer.on('itemmousedown',function(view, record, item, index, event) {
		if(event.button == 2) {
			if(record.data.root) {
				mnuContext.showAt(event.getX(), event.getY());
			}else if(record.data.leaf != true){
				mnuContext2.showAt(event.getX(), event.getY());
			}else{
				mnuContext3.showAt(event.getX(), event.getY());
			}
			selected_item = record.data;
			console.log(selected_item.id+','+selected_item.text+','+index);
		}
    });
	Ext.getCmp('modelexplorer').add(modelExplorer);
	return modelExplorer;
}

function show_targets_window() {
	 Ext.Msg.prompt('ターゲット','編集',function(btn,text){
		 if(btn != 'cancel') {
			 g_metaproject.targets = JSON.parse(text);
		 }
	 },null,true,JSON.stringify(g_metaproject.targets));
}

function WBConfig() {
	this.targets = [];
}
function WBTarget(name) {
	this.name = name;
	this.mapping = [];
}
function WBMap() {
	this.type = '';
	this.src = '';
	this.dest = '';
}

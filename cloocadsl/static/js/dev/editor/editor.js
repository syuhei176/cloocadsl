Ext.require([
    'Ext.panel.*',
    'Ext.toolbar.*',
    'Ext.button.*',
    'Ext.container.ButtonGroup',
    'Ext.layout.container.Table'
]);

var g_project_id = 0;
function init_clooca(project, is_preview) {
	g_project_id = project.id;
	g_projectinfo = project;
	_is_preview = is_preview;
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
	readProject(project);
}

function create_tabs() {
	editortabpanel = new EditorTabPanel();
	editortabpanel.add(new WelcomeMessageView(), 'welcome');
	return editortabpanel.getPanel();
}

function create_menu() {
	var common_menu = {
        tbar: [{
            text: 'Edit',
            iconCls: 'add16',
            menu: [
                   {
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
                	   handler : onProjItemClick
                   },{
                	   id: 'download',
                	   text: 'download',
                	   iconCls: 'add16',
                	   handler : onProjItemClick
                   },{
                	   id: 'pviewer',
                	   text: 'プロジェクト情報',
                	   iconCls: 'add16',
                	   handler : onProjItemClick
                   }
                   ]
        },'-',{
            id: 'save',
            text: 'Save',
            iconCls: 'add16',
        	handler : onItemClick
        }]
    }
	if(g_projectinfo.group.service == 'free') {
		
	}
	if(g_projectinfo.group.service == 'rep' || g_projectinfo.group.service == 'all') {
		common_menu.tbar.push({
            text: 'リポジトリ',
            iconCls: 'add16',
            menu: [
                   {
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
                	   id: 'checkout',
                	   text: 'checkout',
                	   iconCls: 'add16',
                	   handler : onRepItemClick
                   },{
                	   id: 'commit',
                	   text: 'commit',
                	   iconCls: 'add16',
                	   handler : onRepItemClick
                   },{
                	   id: 'update',
                	   text: 'update',
                	   iconCls: 'add16',
                	   handler : onRepItemClick
                   },{
                	   id: 'history',
                	   text: 'History',
                	   iconCls: 'add16',
                	   handler : onRepItemClick
                   }
                   ],
        	handler : onItemClick
        });
	}
	if(g_projectinfo.group.service == 'shinshu' || g_projectinfo.group.service == 'all') {
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
	}
	return common_menu;
}

function onItemClick(item){
	if(item.id == 'save') {
		saveModel(g_project_id);
	}else if(item.id == 'diagram') {
		if(current_editor.selected != null && g_metamodel.metaobjects[current_editor.selected.meta_id].decomposition != null && current_editor.selected.diagram == null) {
			var d = new Diagram();
			d.meta_id = g_metamodel.metaobjects[current_editor.selected.meta_id].decomposition;
			current_editor.selected.diagram = d.id;
			g_model.diagrams[d.id] = d;
			createModelExplorer();
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
		Generate(g_project_id);
	}else if(item.id == 'download') {
		download(g_project_id);
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
		clear_rep();
	}else if(item.id == 'checkout') {
		checkoutview();
	}else if(item.id == 'commit') {
		commit();
	}else if(item.id == 'update') {
		update();
	}else if(item.id == 'history') {
		$.post('/mvcs/gethistory', {pid : g_projectinfo.id},
				function(data) {
			for(var key in data.verlist) {
				console.log(data.verlist[key].version, data.verlist[key].content);
				for(var i=0;i < data.verlist[key].changes.length;i++) {
					console.log(data.verlist[key].changes[i].ver_type + ',' + data.verlist[key].changes[i].type);
				}
			}
			console.log()
//						current_editor = new HistoryView(data);
				}, "json");
	}
}

function onShinshuItemClick(item){
	if(item.id == 'genbin') {
		genbin(g_project_id);
	}
}

function createModelExplorer() {
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
//	    title: 'Model Explorer',
	    width: 200,
	    height: 200,
	    store: store,
	    rootVisible: false
	});
	modelExplorer.on('itemdblclick',function(view, record, item, index, event) {
		if(record.data.text != 'root') {
	    	var editor = new DiagramEditor(record.data.text, record.data.id, g_model.diagrams[record.data.id]);
	    	editortabpanel.add(editor, record.data.id);
		}
    });
	var mnuContext = new Ext.menu.Menu({
	    items: [{
	        id: 'delete',
	        text: '削除'
	    },{
	        id: 'open',
	        text: '開く',
	        items: [{
		        id: 'open_d',
		        text: 'ダイアグラム'
		    },{
		        id: 'open_s',
		        text: 'シーケンス'
		    }
	        ]
	    }],
	    listeners: {
        click: function(menu, item) {
            switch (item.id) {
                case 'delete':
                	ModelController.deleteDiagram(selected_diagram_id);
                    break;
                case 'open':
        	    	var editor = new SequenceEditor(selected_diagram_name, selected_diagram_name, g_model.diagrams[selected_diagram_id]);
        	    	editortabpanel.add(editor, selected_diagram_name);
                    break;
            }
        }
	    }
	});

	modelExplorer.on('itemmousedown',function(view, record, item, index, event) {
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
	return modelExplorer;
}

function checkoutview() {
	$.post('/mvcs/rep_list', {},
			function(data) {
				if(data) {
					console.log('id\tname\thead_version');
					for(var i=0;i < data.length;i++) {
						console.log(data[i].id + '\t' + data[i].name + '\t' + data[i].head_version);
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
					Ext.create('Ext.window.Window', {
					    title: 'Checkout',
					    height: 200,
					    width: 400,
					    layout: 'fit',
					    items: {
					        xtype: 'grid',
					        border: false,
					        columns: [{text: "name", dataIndex: 'name'}],
					        store: Ext.create('Ext.data.Store', {data:data,fields:['id','name','head_version']}),
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
					                text:'Checkout',
					                tooltip:'checkout',
					                iconCls:'add',
					                handler : function() {
					                	console.log(''+selModel.getSelection()[0].get('id'));
					                	checkout(selModel.getSelection()[0].get('id'));
					                }
					            }]
					        }]
					     }
					}).show();
				}
			}, "json");
}

function show_create_diagram_window() {
	var datas = [];
	for(var i=1;i < g_metamodel.metadiagrams.length;i++) {
		datas.push(g_metamodel.metadiagrams[i]);
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
	               	 Ext.Msg.prompt('編集','プロパティ',function(btn,text){
	            		 if(btn != 'cancel') {
	 	                	var d = ModelController.addDiagram(selModel.getSelection()[0].get('id'));
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
		                	createModelExplorer();
		                	win.hide();
	            		 }
	            	 },null,true,'');
	                }
	            }]
	        }]
	     }]
	});
	win.show();
}

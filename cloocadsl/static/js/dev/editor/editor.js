Ext.require([
    'Ext.panel.*',
    'Ext.toolbar.*',
    'Ext.button.*',
    'Ext.container.ButtonGroup',
    'Ext.layout.container.Table'
]);

var g_project_id = 0;
function init_clooca(project, is_preview) {
	window.onbeforeunload = function(){
		return "このページから移動しますか？ データは保存されません。"; 
	}
	current_editor = null;
	g_project_id = project.id;
	g_projectinfo = project;
	g_projectinfo.group.service = 'rep';
	(window.open("","_self")).addEventListener('close', function(){
		saveModel(g_projectinfo.id);
	}, false);
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
                   },{
                	   id: 'canvas_size',
                	   text: 'キャンバスサイズ変更',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   }
                   ],
        	handler : onItemClick
        },{
            text: 'プロジェクト',
            iconCls: 'add16',
            menu: [
                   /*
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
                   },*/{
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
	if(g_projectinfo.group.service == 'free') {
		
	}
	if(g_projectinfo.group.service == 'rep' || g_projectinfo.group.service == 'all') {
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
	if(item.id == 'exit') {
		window.opener="dummy";
		window.open("about:blank","_self").close();
	}else if(item.id == 'save') {
		saveModel(g_project_id);
	}else if(item.id == 'diagram') {
		if(current_editor != null && current_editor.selected != null && g_metamodel.metaobjects[current_editor.selected.meta_id].decomposition != null && current_editor.selected.diagram == null) {
         	var d = ModelController.addDiagram(g_metamodel.metaobjects[current_editor.selected.meta_id].decomposition);
//			var d = new Diagram();
//			d.meta_id = g_metamodel.metaobjects[current_editor.selected.meta_id].decomposition;
			current_editor.selected.diagram = d.id;
//			g_model.diagrams[d.id] = d;
			change_diagram_name_view(d);
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
	}else if(item.id == 'canvas_size') {
		change_canvas_size();
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

function createModelExplorer() {
	
	var open_diagram = function(diagram,dname,id){
		var meta_diagram = g_metamodel.metadiagrams[diagram.meta_id];
		var editor;
		if(meta_diagram.seq == true) {
	    	editor = new SequenceEditor(dname, id, diagram);
		}else{
	    	editor = new DiagramEditor(dname, id, diagram);
		}
		editortabpanel.add(editor, id);
	}
	
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
//					alert(diagram.properties[j].meta_id);
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
			open_diagram(diagram, record.data.text, record.data.id);
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
	$.post('/mvcs/group_rep_list', {group_id : g_projectinfo.group.id},
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
					var win = Ext.create('Ext.window.Window', {
					    title: 'Checkout',
					    height: 200,
					    width: 400,
					    layout: 'fit',
					    items: {
					        xtype: 'grid',
					        border: false,
					        columns: [{text: "name", dataIndex: 'name'},{text: "head version", dataIndex: 'head_version'}],
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
					                	if(window.confirm('チェックアウトします。よろしいですか？')) {
						                	checkout(selModel.getSelection()[0].get('id'), function(){win.hide();});
					                	}
					                }
					            }]
					        }]
					     }
					}).show();
				}
			}, "json");
}

function import_to_rep_view() {
	$.post('/mvcs/group_rep_list', {group_id : g_projectinfo.group.id},
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
					var win = Ext.create('Ext.window.Window', {
					    title: 'Import',
					    height: 200,
					    width: 400,
					    layout: 'fit',
					    items: {
					        xtype: 'grid',
					        border: false,
					        columns: [{text: "name", dataIndex: 'name'},{text: "head version", dataIndex: 'head_version'}],
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
					                text:'Import',
					                tooltip:'import',
					                iconCls:'add',
					                handler : function() {
					                	console.log(''+selModel.getSelection()[0].get('id'));
					                	if(window.confirm('リポジトリにインポートします。よろしいですか？')) {
						                	import_to_rep(selModel.getSelection()[0].get('id'), function() {
						                		win.hide();
						                	});
					                	}
					                }
					            }]
					        }]
					     }
					}).show();
				}
			}, "json");
}

function delete_rep_view() {
	$.post('/mvcs/group_rep_list', {group_id : g_projectinfo.group.id},
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
					var win = Ext.create('Ext.window.Window', {
					    title: 'Delete',
					    height: 200,
					    width: 400,
					    layout: 'fit',
					    items: {
					        xtype: 'grid',
					        border: false,
					        columns: [{text: "name", dataIndex: 'name'},{text: "head version", dataIndex: 'head_version'}],
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
					                text:'Delete',
					                tooltip:'delete',
					                iconCls:'add',
					                handler : function() {
					                	console.log(''+selModel.getSelection()[0].get('id'));
					                	if(window.confirm('リポジトリ「'+selModel.getSelection()[0].get('name')+'」を削除します。')) {
						                	delete_rep(selModel.getSelection()[0].get('id'), function() {
						                		win.hide();
						                	});
					                	}
					                }
					            }]
					        }]
					     }
					}).show();
				}
			}, "json");
}

function update_to_ver_view() {
	$.post('/mvcs/ver_list', {pid : g_projectinfo.id},
			function(data) {
				if(data) {
					console.log('id\tversion\tcomment');
					for(var i=0;i < data.length;i++) {
						console.log(data[i].id + '\t' + data[i].version + '\t' + data[i].content);
					}
					 var selModel = Ext.create('Ext.selection.RowModel', {
						 mode: 'SINGLE',
					        listeners: {
					            selectionchange: function(sm, selections) {
					                for(var i=0;i < selections.length;i++) {
					                	console.log(i + '=' + selections[i].get('version'));
					                }
					            }
					        }
					    });
					var win = Ext.create('Ext.window.Window', {
					    title: 'update to previous version',
					    height: 200,
					    width: 400,
					    layout: 'fit',
					    items: {
					        xtype: 'grid',
					        border: false,
					        columns: [{text: "version", dataIndex: 'version'},{text: "comment", dataIndex: 'content', width: 160}],
					        store: Ext.create('Ext.data.Store', {data:data,fields:['version','content']}),
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
					                text:'update',
					                tooltip:'update',
					                iconCls:'add',
					                handler : function() {
					                	console.log(''+selModel.getSelection()[0].get('version'));
					                	update_to_ver(selModel.getSelection()[0].get('version'), function() {
					                		win.hide();
					                	});
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
	               	 Ext.Msg.prompt('ダイアグラム','新規作成',function(btn,text){
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
		        				g_model.properties[prop.children[0]].value = text;
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
        	createModelExplorer();
		 }
	 },null,false,'');
}

function change_canvas_size() {
	var win = Ext.create('Ext.window.Window', {
	    title: 'キャンバスサイズ変更',
	    height: 240,
	    width: 300,
	    layout: 'vbox',
	    items: [{
	        xtype: 'numberfield',
//	        anchor: '100%',
	        name: 'bottles',
	        fieldLabel: 'width',
	        value: current_editor.width,
	        maxValue: 2000,
	        minValue: 500,
	        listeners: {
	            change: function(field, value) {
	            	current_editor.changeCanvasWidth(Number(value));
	            }
	        }
	     },{
	         xtype: 'numberfield',
//	         anchor: '100%',
	         name: 'bottles',
	         fieldLabel: 'height',
	         value: current_editor.height,
	         maxValue: 2000,
	         minValue: 500,
		        listeners: {
		            change: function(field, value) {
		            	current_editor.changeCanvasHeight(Number(value));
		            }
		        }
	     }]
	     });
	win.show();
}
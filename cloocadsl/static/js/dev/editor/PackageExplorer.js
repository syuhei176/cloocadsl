function PackageExplorer(modelController, editor) {
	this.modelController = modelController;
	this.editor = editor;
	this.selectedPackage = null;
	this.refresh()
}

/**
 * レンダリング
 */
PackageExplorer.prototype.refresh = function() {
	var self = this;
	/*
	 * メタデータコントローラからデータ取得
	 */
	var packages = this.modelController.getPackages();
	/*
	 * パッケージを読み込みツリー状に表示する
	 */
	function create_package_tree(packages, parent_uri) {
		var packages_tree = [];
		for(var i=0;i < packages.length;i++) {
			var nestings = null;
			var current_uri = parent_uri + '.' + packages[i].name;
			if(packages[i].nestingPackages) {
				nestings = create_package_tree(packages[i].nestingPackages, current_uri);
				packages_tree.push({text: packages[i].name, icon: '/static/images/editor/root_leaf.gif', children: nestings, uri:current_uri});
			}else{
				packages_tree.push({text: packages[i].name, leaf: true, icon: '/static/images/editor/root_leaf.gif', uri:current_uri});
			}
		}
		return packages_tree;
	}
	var packages_tree = create_package_tree(packages, g_toolinfo.toolkey);
	
	var store = Ext.create('Ext.data.TreeStore', {
        fields: ['text',{name:'uri',type:'string'}],
	    root: {
	        expanded: true,
	        children: [
	            { text: g_toolinfo.toolkey, expanded: true, children: packages_tree, root:true , uri:g_toolinfo.toolkey}
	        ]
	    }
	});
	this.panel = Ext.create('Ext.tree.Panel', {
/*	    title: 'Package Explorer',
	    width: 220,*/
	    height: 240,
	    store: store,
	    rootVisible: false
	});
	this.panel.on('itemdblclick',function(view, record, item, index, event) {
		if(record.data.leaf) {
			/*
			var template = g_templates[record.data.id];
	    	editor = new TemplateEditor(template);
	    	editortabpanel.add(editor, template.path + ':' + template.name);
	    	*/
		}
		self.open();
    });
	this.init_contextmenu();
	Ext.getCmp('package-explorer').removeAll();
	Ext.getCmp('package-explorer').add(this.panel);
}

PackageExplorer.prototype.create = function() {
	var self = this;
	var defaultParentPackage = this.selectedPackage;
	/*
	 * パッケージの新規作成ダイアログを表示する
	 */
	var type_states = Ext.create('Ext.data.Store', {
	    fields: ['disp','type'],
	    data : [
	        {"disp":"DSL","type":"dsl"},
	        {"disp":"DSML","type":"dsml"}
	    ]
	});
	
	var win = Ext.create('Ext.window.Window', {
	    title: 'パッケージ作成',
	    height: 200,
	    width: 400,
	    layout: 'fit',
	    items: {
	        xtype: 'panel',
	        layout: 'vbox',
	        items: [{
	        	name: 'parent',
	        	xtype: 'textfield',
	        	fieldLabel: '親パッケージ',
	        	value: defaultParentPackage
	        },{
	        	name: 'name',
	        	xtype: 'textfield',
	        	fieldLabel: 'パッケージ名',
	        	value: ''
	        },{
	        	name: 'type',
	        	xtype: 'combo',
		        store: type_states,
		        queryMode: 'local',
		        displayField: 'disp',
		        valueField: 'type',
			    value: 'dsl',
	        	fieldLabel: '言語タイプ',
	        },{
	        	xtype: 'button',
	        	text: 'OK',
	        	handler: function(okbutton) {
	        		console.log(okbutton.up().down('textfield[name="name"]'));
//	        		console.log(a.up().down('#name').value);
	        		var parent = okbutton.up().down('textfield[name="parent"]').value;
	        		var name = okbutton.up().down('textfield[name="name"]').value;
	        		var type = okbutton.up().down('combo[name="type"]').value;
	        		self.metaDataController.addPackage(parent, name, type);
	        		self.refresh();
	        		win.hide();
	        	}
	        }]
	    }
	});
	win.show();
}

PackageExplorer.prototype.open = function() {
	/*
	選択されているパッケージがDSLかDSMLかを判断して
	EditorTabPanelにタブを追加する
	*/
	var p = this.metaDataController.getPackage(this.selectedPackage);
	var key = p.uri + '.' + p.name;
	if(p.lang_type == 'dsl') {
		var dsleditor = new DSLEditor(key, p.name, this.metaDataController);
		this.wb.editorTabPanel.add(dsleditor, key);
	}else{
		var dsleditor = new MetaJSONEditor(key, p.name, this.metaDataController);
		this.wb.editorTabPanel.add(dsleditor, key);
	}
}

PackageExplorer.prototype.resetting_option = function() {
	/*
	 * 選択されているパッケージの設定を変更するダイアログを表示する
	*/
}

PackageExplorer.prototype.del = function() {
	var self = this;
	/*
	 * 選択されているパッケージを削除する
	*/
    Ext.Msg.confirm( 
            'パッケージの削除', 
            self.selectedPackage+'を削除しますよ？', 
            function(btn){ 
                if(btn == 'yes'){ 
                    self.metaDataController.delPackage(self.selectedPackage);
                	self.refresh();
                } 
                if(btn == 'no'){ 
                } 
            } 
        );
}

/*
 * private function
 */
PackageExplorer.prototype.init_contextmenu = function() {
	var self = this;
	/*
	 * 右クリックメニューの設定
	 */
	var mnuContext = new Ext.menu.Menu({
	    items: [{
	        id: 'create',
	        text: '新規作成'
	    },{
	        id: 'delete',
	        text: '削除'
	    }],
	    listeners: {
        click: function(menu, item) {
            switch (item.id) {
                case 'create':
                	self.create();
                    break;
                case 'delete':
                	self.del();
                    break;
            }
        }
	    }
	});
	this.panel.on('itemmousedown',function(view, record, item, index, event) {
		self.selectedPackage = record.data.uri;
		if(event.button == 2) {
			if(record.data.root) {
				mnuContext.showAt(event.getX(), event.getY());
			}else if(record.data.leaf != true){
				mnuContext.showAt(event.getX(), event.getY());
			}else{
				mnuContext.showAt(event.getX(), event.getY());
			}
			selected_item = record.data;
			console.log(selected_item.id+','+selected_item.text+','+index);
		}
    });
}

/**
 * packageExplorer
 * プロジェクト内のパッケージを表示する。
 * @returns
 */
/*
function PackageExplorer() {
	console.log("PackageExplorer Constructor");
	var self = this;
	this.selected_diagram = null;
	var diagrams = [];
	for(var key in g_model.diagrams) {
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

PackageExplorer.prototype.open_selected_diagram = function(){
	console.log("PackageExplorer open_selected_package");
	this.open_diagram(this.selected_diagram,this.selected_diagram.id)
}

PackageExplorer.prototype.open = function(diagram,id,dname){
	console.log("PackageExplorer open_package");
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

PackageExplorer.prototype.changePackageNameDialog = function(meta_id, cb){
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

PackageExplorer.prototype.createPackageDialog = function(){
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
*/
function MetaPackageExplorer(metaDataController, wb) {
	this.metaDataController = metaDataController;
	this.wb = wb;
	this.selected = null;
	this.selected_item = null;
	this.panel = null;
	this.refresh()
}

/**
 * レンダリング
 */
MetaPackageExplorer.prototype.refresh = function() {
	var self = this;
	/*
	 * メタデータコントローラからデータ取得
	 */
	var packages = this.metaDataController.getPackages();
	/*
	 * パッケージを読み込みツリー状に表示する
	 */
	function create_package_tree(packages, parent_uri) {
		var packages_tree = [];
		for(var key in packages) {
			if(packages[key].op != 'del') {
				packages_tree.push(create_package_tree_part(packages[key]));
			}
		}
		
		function create_package_tree_part(pkg) {
			var packages_tree = [];
			var package_uri = pkg.parent_uri + '.' + pkg.name;
			for(var key in pkg.nestingPackages) {
				packages_tree.push(create_package_tree_part(pkg.nestingPackages[key]));
			}
			for(var key in pkg.content.classes) {
				var klass = pkg.content.classes[key];
				var current_uri = package_uri;
				current_uri += '.' + klass.name;
				var asso_tree = [];
				for(var akey in klass.associations) {
					var asso = klass.associations[akey];
					var asso_uri = current_uri;
					asso_uri += '.' + asso.name;
					asso_tree.push({id:asso_uri,text: asso.name, leaf: true, icon: '/static/images/editor/Class.gif', uri:asso_uri});
				}
				for(var akey in klass.properties) {
					var prop = klass.properties[akey];
					var asso_uri = current_uri;
					asso_uri += '.' + prop.name;
					asso_tree.push({id:asso_uri,text: prop.name, leaf: true, icon: '/static/images/editor/Class.gif', uri:asso_uri});
				}
				packages_tree.push({id:current_uri,text: klass.name, /*leaf: true, */children: asso_tree, icon: '/static/images/editor/Class.gif', uri:current_uri});
			}
			/*
			 * パッケージツリーに表示するテキストを生成
			 * 更新されていれば、">"、後ろにバージョン番号を付加
			 */
			var tree_text = ((pkg.op=='none') ? '' : '>') + pkg.name + ':' + pkg.version;
			return {id:package_uri,text: tree_text, icon: '/static/images/editor/root_leaf.gif', children: packages_tree, uri:package_uri};
		}
		return packages_tree;
	}
	var packages_tree = create_package_tree(packages, g_toolinfo.toolkey);
	
	var store = Ext.create('Ext.data.TreeStore', {
        fields: ['text',{name:'uri',type:'string'}],
	    root: {
	        expanded: true,
	        children: [
	            { text: g_toolinfo.toolkey + ':' + g_toolinfo.current_version , expanded: true, children: packages_tree, root:true , uri:g_toolinfo.toolkey}
	        ]
	    }
	});
	this.panel = Ext.create('Ext.tree.Panel', {
		width: 320,
	    height: 240,
	    store: store,
	    rootVisible: false,
        viewConfig: {                         
            plugins: { 
                ptype: 'treeviewdragdrop', 
                ddGroup: 'fff',
                appendOnly: true
            }
          }
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

MetaPackageExplorer.prototype.create_package = function() {
	var self = this;
	var defaultParentPackage = this.selected;
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

MetaPackageExplorer.prototype.create_class = function() {
	var self = this;
	var defaultParentPackage = this.selected;
	
	/*
	 * パッケージの新規作成ダイアログを表示する
	 */
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
	        	fieldLabel: '名前',
	        	value: ''
	        },{
	        	xtype: 'button',
	        	text: 'OK',
	        	handler: function(okbutton) {
	        		var parent = okbutton.up().down('textfield[name="parent"]').value;
	        		var name = okbutton.up().down('textfield[name="name"]').value;
	        		self.metaDataController.addClass(parent, name);
	        		self.refresh();
	        		win.hide();
	        	}
	        }]
	    }
	});
	win.show();
}


MetaPackageExplorer.prototype.open = function() {
	/*
	選択されているパッケージがDSLかDSMLかを判断して
	EditorTabPanelにタブを追加する
	*/
	var p = this.selected_item;
	var key = p.parent_uri + '.' + p.name;
	if(p.lang_type == 'dsl') {
		var dsleditor = new DSLEditor(key, p.name, this.metaDataController);
		this.wb.editorTabPanel.add(dsleditor, key);
	}else if(p.lang_type == 'dsml'){
		if(p.meta == 'C') {
			p = this.metaDataController.get(p.parent_uri);
			var key = p.parent_uri + '.' + p.name;
			key = key.split(".").join("-"); 
			var dsleditor = new GraphiticalMetaModelEditor(key, p.name, p, this.metaDataController, this.wb);
			this.wb.editorTabPanel.add(dsleditor, key);
		}else{
			key = key.split(".").join("-"); 
			var dsml_editor = new DSMLEditor(key, p.name, p, this.metaDataController);
			//var dsleditor = new GraphiticalMetaModelEditor(key, p.name, p, this.metaDataController, this.wb);
			this.wb.editorTabPanel.add(dsml_editor, key);
		}
	}
}

MetaPackageExplorer.prototype.resetting_option = function() {
	/*
	 * 選択されているパッケージの設定を変更するダイアログを表示する
	*/
}

MetaPackageExplorer.prototype.del = function() {
	var self = this;
	/*
	 * 選択されているパッケージを削除する
	*/
    Ext.Msg.confirm( 
            'パッケージの削除', 
            self.selected+'を削除しますよ？', 
            function(btn){ 
                if(btn == 'yes'){ 
                    self.metaDataController.delPackage(self.selected);
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
MetaPackageExplorer.prototype.init_contextmenu = function() {
	var self = this;
	/*
	 * 右クリックメニューの設定
	 */
	var mnuContext_package = new Ext.menu.Menu({
	    items: [{
	        id: 'create',
	        text: '新規作成',
	        menu: [{
		        id: 'create-package',
		        text: 'パッケージ作成',
		        handler: function(){self.create_package();}
	        }]
	    },{
	        id: 'delete',
	        text: '削除',
	        handler: function(){self.del();}
	    },{
	        id: 'refresh',
	        text: '更新',
	        handler: function(){self.refresh();}
	    },{
	        id: 'package-info',
	        text: '情報',
	        handler: function(){
	        	Ext.Msg.alert('','' + self.selected_item.name + ',' + self.selected_item.op);
	        }
	    }],
	    listeners: {click: function(menu, item) {}}
	});
	this.panel.on('itemmousedown',function(view, record, item, index, event) {
		self.selected = record.data.uri;
		self.selected_item = self.metaDataController.get(self.selected);
		if(event.button == 2) {
			if(self.selected_item.meta == 'C') {
				
			}else if(self.selected_item.meta == 'A') {
				//nothing to do
			}else if(self.selected_item.meta == 'P') {
				//nothing to do
			}else{
				mnuContext_package.showAt(event.getX(), event.getY());
			}
		}
    });
}

MetaPackageExplorer.prototype.change = function() {
	this.panel.getStore().getAt().set('text','>');
}

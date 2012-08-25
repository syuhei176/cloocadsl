function ModelExplorer(modelController, editor, ctool) {
	var self = this;
	this.modelController = modelController;
	this.editor = editor;
	this.selected = null;
	this.ctool = ctool;
	this.panel = Ext.create('Ext.tree.Panel', {
		store : Ext.create('Ext.data.TreeStore', {fields: ['text',{name:'uri',type:'string'}]}),
	    width: 220,
//	    height: 240,
	    anchor : '100% 100%',
	    rootVisible: false,
	    autoScroll: true,
	    scroll : 'vertical'
	});
	this.panel.on('itemdblclick',function(view, record, item, index, event) {
		if(record.data.leaf) {
		}
		self.open();
    });
	this.init_contextmenu();
//	this.panel.render('model-explorer');
	Ext.getCmp('model-explorer').removeAll();
	Ext.getCmp('model-explorer').add(this.panel);
	this.refresh();
}

/**
 * レンダリング
 */
ModelExplorer.prototype.refresh = function() {
	var self = this;
	/*
	 * モデルコントローラからデータ取得
	 */
	var model = this.modelController.getModel();
	/*
	 * パッケージを読み込みツリー状に表示する
	 */
	function create_package_tree(m, parent_uri) {
		var packages_tree = [];
		for(var key in m) {
			if(key == '0') continue;
			if(key.substr(0,4) == '_sys') continue;
			var current_uri = parent_uri + '.' + key;
			var children = create_package_tree(m[key], current_uri);
			if(m[key]['_sys_exist'] == undefined && children.length == 0) continue;
			packages_tree.push({text: key,
				icon: '/static/images/editor/root_leaf.gif',
				leaf : children.length == 0,
				children : children,
				uri:current_uri});
		}
		return packages_tree;
	}
	var packages_tree = create_package_tree(model, 'root');
	console.log(packages_tree);
	
	this.panel.getStore().setRootNode(	{
        expanded: true,
        children: [
            { text: 'root', expanded: true, children: packages_tree, root:true , uri:'root'}
        ]
    });
}

ModelExplorer.prototype.create = function(klass) {
	console.log('create ' + klass.id);
	var self = this;
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
	    title: klass.getName() + '作成',
	    height: 200,
	    width: 400,
	    layout: 'fit',
	    items: {
	        xtype: 'panel',
	        layout: 'vbox',
	        items: [{
	        	name: 'name',
	        	xtype: 'textfield',
	        	fieldLabel: '名前',
	        	value: ''
	        },{
	        	xtype: 'button',
	        	text: 'OK',
	        	handler: function(okbutton) {
	        		var name = okbutton.up().down('textfield[name="name"]').value;
	        		var newInstance = self.modelController.add(self.selected, klass);
	        		self.modelController.rename(newInstance._sys_uri, name);
	        		self.refresh();
	        		win.hide();
	        	}
	        }]
	    }
	});
	win.show();
}

ModelExplorer.prototype.open = function() {
	var key = this.selected.split(".").join("-"); 
	var deditor = new DiagramEditor(
			key,			//key
			this.selected,								//title of diagram editor
			this.modelController.get(this.selected),	//diagram instance
			this.modelController,							//model controller
			this.ctool,									//compiled tool
			this.editor
			);
	this.editor.editorTabPanel_preview.add(deditor, key);
}

ModelExplorer.prototype.resetting_option = function() {
	/*
	 * 選択されているパッケージの設定を変更するダイアログを表示する
	*/
}

ModelExplorer.prototype.del = function() {
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
ModelExplorer.prototype.init_contextmenu = function() {
	var self = this;
	/*
	 * 右クリックメニューの設定
	 */
	this.panel.on('itemmousedown',function(view, record, item, index, event) {
		self.selected = record.data.uri;
		if(event.button == 2) {
			if(record.data.root) {
				self.showContextmenu(self.ctool.getRootClass().id, event.getX(), event.getY());
			}else{
				self.showContextmenu(self.modelController.get(self.selected)._sys_meta, event.getX(), event.getY());
			}
		}
    });
}

ModelExplorer.prototype.showContextmenu = function(meta, x, y) {
	console.log('showContextmenu:' + meta);
	var self = this;
	var klass = this.ctool.getClass(meta);
	var contClasses = this.ctool.getContainableClasses(klass);
	var menu = [];
	for(var i=0;i < contClasses.length;i++) {
		var key = i;
		menu.push({
	        id: 'create-' + contClasses[i].id,
	        text: contClasses[i].name + '作成',
	        handler: function(){self.create(contClasses[key]);}
        });
	}
	var mnuContext = new Ext.menu.Menu({
	    items: [{
	        id: 'create',
	        text: '新規作成',
	        menu: [menu]
	    },{
	        id: 'delete',
	        text: '削除'
	    },{
	        id: 'refresh',
	        text: '更新',
	        handler: function(){self.refresh()}
	    }]
	});
	mnuContext.showAt(x, y);
}

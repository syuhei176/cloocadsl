function NotationExplorer(notationController, wb) {
	this.notationController = notationController;
	this.wb = wb;
	this.selectedNotation = null;
	this.refresh()
}

/**
 * レンダリング
 */
NotationExplorer.prototype.refresh = function() {
	var self = this;
	/*
	 * メタデータコントローラからデータ取得
	 */
	var notation_members = this.notationController.getlist();
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
	var packages_tree = create_package_tree(notation_members, g_toolinfo.toolkey);
	
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
	Ext.getCmp('notation-explorer').removeAll();
	Ext.getCmp('notation-explorer').add(this.panel);
}

NotationExplorer.prototype.create = function() {
	var self = this;
	var defaultTargetPackage = this.selectedPackage;
	/*
	 * パッケージの新規作成ダイアログを表示する
	 */
	var type_states = Ext.create('Ext.data.Store', {
	    fields: ['disp','type'],
	    data : [
	        {"disp":"ダイアグラム","type":"diagram"},
	        {"disp":"GUI","type":"gui"},
	        {"disp":"グラフィック","type":"graphic"},
	        {"disp":"ウィジェット","type":"wiget"}
	    ]
	});
	
	var win = Ext.create('Ext.window.Window', {
	    title: 'ノーテーション追加',
	    height: 200,
	    width: 400,
	    layout: 'fit',
	    items: {
	        xtype: 'panel',
	        layout: 'vbox',
	        items: [{
	        	name: 'target',
	        	xtype: 'textfield',
	        	fieldLabel: '対象要素',
	        	value: defaultTargetPackage
	        },{
	        	name: 'type',
	        	xtype: 'combo',
		        store: type_states,
		        queryMode: 'local',
		        displayField: 'disp',
		        valueField: 'type',
			    value: 'graphic',
	        	fieldLabel: '言語タイプ',
	        },{
	        	name: 'option',
	        	xtype: 'textfield',
	        	fieldLabel: 'オプション',
	        	value: ''
	        },{
	        	xtype: 'button',
	        	text: 'OK',
	        	handler: function(okbutton) {
	        		console.log(okbutton.up().down('textfield[name="name"]'));
//	        		console.log(a.up().down('#name').value);
	        		var parent = okbutton.up().down('textfield[name="parent"]').value;
	        		var name = okbutton.up().down('textfield[name="name"]').value;
	        		var type = okbutton.up().down('combo[name="type"]').value;
	        		self.notationController.add();
	        		self.refresh();
	        		win.hide();
	        	}
	        }]
	    }
	});
	win.show();
}

NotationExplorer.prototype.open = function() {
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

NotationExplorer.prototype.resetting_option = function() {
	/*
	 * 選択されているパッケージの設定を変更するダイアログを表示する
	*/
}

NotationExplorer.prototype.del = function() {
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
NotationExplorer.prototype.init_contextmenu = function() {
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
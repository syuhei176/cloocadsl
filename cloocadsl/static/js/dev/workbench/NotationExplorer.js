function NotationExplorer(notationController, wb) {
	this.notationController = notationController;
	this.wb = wb;
	this.selected = null;
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
	var notation_members = this.notationController.getRoot();
	/*
	 * パッケージを読み込みツリー状に表示する
	 */
	function create_package_tree(notations, parent_uri) {
		var packages_tree = [];
		for(var key in notations) {
			var nestings = null;
			var current_uri = parent_uri + '.' + key;
			if(notations[key].children) {
				nestings = create_package_tree(notations[key].children, current_uri);
				packages_tree.push({text: key, icon: '/static/images/editor/root_leaf.gif', children: nestings, uri:current_uri});
			}else{
				packages_tree.push({text: key, leaf: true, icon: '/static/images/editor/root_leaf.gif', uri:current_uri});
			}
		}
		return packages_tree;
	}
	var packages_tree = create_package_tree(notation_members.children, 'notation');
	
	var store = Ext.create('Ext.data.TreeStore', {
        fields: ['text',{name:'uri',type:'string'}],
	    root: {
	        expanded: true,
	        children: [
	            { text: 'notation', expanded: true, children: packages_tree, root:true , uri:'notation'}
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

NotationExplorer.prototype.create = function(root) {
	var self = this;
	/*
	 * TODO : パッケージのuriリストを取得
	var defaultTargetPackage;
	*/
	var classes = this.wb.metaDatacontroller.getClassList();
	var data = [];
	for(var i=0;i < classes.length;i++) {
		data.push({disp : classes[i].name, type : classes[i].parent_uri + '.' + classes[i].name});
	}
	var classes_states = Ext.create('Ext.data.Store', {
	    fields: ['disp','type'],
	    data : data
	});
	
	var parentNotationURI = this.selected;
	/*
	 * パッケージの新規作成ダイアログを表示する
	 */
	var type_states = Ext.create('Ext.data.Store', {
	    fields: ['disp','type'],
	    data : [
	        {"disp":"ダイアグラム","type":"diagram"},
	        {"disp":"ノード","type":"node"},
	        {"disp":"コネクション","type":"connection"},
	        {"disp":"ラベル","type":"label"}
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
	        	name: 'parent',
	        	xtype: 'textfield',
	        	fieldLabel: '親',
	        	value: parentNotationURI
	        },{
	        	name: 'target',
	        	xtype: 'combo',
		        store: classes_states,
		        queryMode: 'local',
		        displayField: 'disp',
		        valueField: 'type',
			    value: '',
	        	fieldLabel: '対象要素',
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
	        	name: 'name',
	        	xtype: 'textfield',
	        	fieldLabel: '名前',
	        	value: ''
	        },{
	        	xtype: 'button',
	        	text: 'OK',
	        	handler: function(okbutton) {
	        		console.log(okbutton.up().down('textfield[name="name"]'));
	        		var parent = okbutton.up().down('textfield[name="parent"]').value;
	        		var target = okbutton.up().down('combo[name="target"]').value;
	        		var type = okbutton.up().down('combo[name="type"]').value;
	        		var name = okbutton.up().down('textfield[name="name"]').value;
	        		var dn = new DiagramNotation({
	        			gtype: type,
	        			target_uri: target
	        			});
	        		if(root == 0) {
		        		self.notationController.addRoot(name, dn);
	        		}else{
		        		self.notationController.addChild(parent, name, dn);
	        		}
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
	var notation = this.notationController.get(this.selected);
	var dsleditor = new NotationEditor(this.selected, this.selected, this.notationController);
	this.wb.editorTabPanel.add(dsleditor, key);
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
                    self.NotationController.del(self.selected);
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
	var mnuContextRoot = new Ext.menu.Menu({
	    items: [{
	        id: 'create',
	        text: '新規作成',
	        handler: function(){self.create(0);}
	    },{
	        id: 'delete',
	        text: '削除',
	        handler: function(){self.del();}
	    }]
	});
	var mnuContext = new Ext.menu.Menu({
	    items: [{
	        id: 'create',
	        text: '子を新規作成',
	        handler: function(){self.create(1);}
	    },{
	        id: 'delete',
	        text: '削除',
	        handler: function(){self.del();}
	    }]
	});
 	this.panel.on('itemmousedown',function(view, record, item, index, event) {
		self.selected = record.data.uri;
		console.log(self.selected);
		if(event.button == 2) {
			if(record.data.root) {
				mnuContextRoot.showAt(event.getX(), event.getY());
			}else{
				mnuContext.showAt(event.getX(), event.getY());
			}
		}
		createPropertyArea();
    });
 	function createPropertyArea() {
 		var props = [];
 		for(var key in self.notationController.getPropertyKeys(self.selected)) {
 	 		props.push({
 	 	        	name: key,
 	 	        	xtype: 'textfield',
 	 	        	fieldLabel: key,
 	 	        	value: self.notationController.getProperty(self.selected, key),
 	 	        	listeners : {
 	 	        		change : {
 	 	        			fn : function(textField, newValue) {
 	 	        				self.notationController.setProperty(self.selected, key, newValue);
 	 	        			}
 	 	        		}
 	 	        	}
 	 			});
 		}
 		self.wb.statuspanel.setPropertyPanel(props);
 	}
}
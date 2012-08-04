function TemplateExplorer(templateController, wb) {
	this.templateController = templateController;
	this.wb = wb;
	this.selectedTemplate = null;
	this.refresh()
}

/**
 * レンダリング
 */
TemplateExplorer.prototype.refresh = function() {
	var self = this;
	/*
	 * テンプレートコントローラからデータ取得
	 */
//	var templates = this.templateController.getTemplates();
	/*
	 * テンプレートを読み込みツリー状に表示する
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
	//var packages_tree = create_package_tree(packages, g_toolinfo.toolkey);
	
	var store = Ext.create('Ext.data.TreeStore', {
        fields: ['text',{name:'name',type:'string'},{name:'package_uri',type:'string'},{name:'content',type:'string'}],
        proxy: {
            type: 'ajax',
            url : '/wb-api/templates/' + g_toolinfo.toolkey,
            reader: {
                type: 'json',
                root: 'templates'
            }
        },
        root: {
        	id: 'templates',
        	text: 'templates',
        	expanded: true
        }
	/*,
        root: {
	        expanded: true,
	        children: [
	            { text: g_toolinfo.toolkey, expanded: true, children: packages_tree, root:true , uri:g_toolinfo.toolkey}
	        ]
	    }*/
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
			self.selectedTemplate = record.data;
		}
		self.open();
    });
//	this.init_contextmenu();
	Ext.getCmp('template-explorer').removeAll();
	Ext.getCmp('template-explorer').add(this.panel);
}

TemplateExplorer.prototype.create = function() {
	var self = this;
	/*
	 * テンプレートの新規作成ダイアログを表示する
	 */
	var type_states = Ext.create('Ext.data.Store', {
	    fields: ['disp','type'],
	    data : [
	        {"disp":"DSL","type":"dsl"},
	        {"disp":"DSML","type":"dsml"}
	    ]
	});
	
	var win = Ext.create('Ext.window.Window', {
	    title: 'テンプレート作成',
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
	        	name: 'package',
	        	xtype: 'textfield',
	        	fieldLabel: 'パッケージ名',
	        	value: ''
	        },{
	        	xtype: 'button',
	        	text: 'OK',
	        	handler: function(okbutton) {
	        		var name = okbutton.up().down('textfield[name="name"]').value;
	        		var package_uri = okbutton.up().down('textfield[name="package"]').value;
	        		self.templateController.create(name, package_uri, function(){
		        		self.panel.getStore().load();
	        		});
	        		win.hide();
	        	}
	        }]
	    }
	});
	win.show();
}

TemplateExplorer.prototype.open = function() {
	/*
	選択されているテンプレートがDSLかDSMLかを判断して
	EditorTabPanelにタブを追加する
	*/
	var dsleditor = new TemplateEditor(this.templateController, this.selectedTemplate);
	this.wb.editorTabPanel.add(dsleditor, this.selectedTemplate.name);
}

TemplateExplorer.prototype.resetting_option = function() {
	/*
	 * 選択されているテンプレートの名前を変更するダイアログを表示する
	*/
}

TemplateExplorer.prototype.del = function() {
	var self = this;
	/*
	 * 選択されているテンプレートを削除する
	*/
	this.templateController.del(this.selectedTemplate.name, function(){
		self.panel.getStore().load();
	});
}
Ext.require([
    'Ext.panel.*',
    'Ext.toolbar.*',
    'Ext.button.*',
    'Ext.container.ButtonGroup',
    'Ext.layout.container.Table',
    'Ext.tab.Panel'
]);

var g_metamodel_id = 0;
function init_wb(id) {
	g_metamodel_id = id;
	load_templates();
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
                   },{
                	   id: 'tempconfig',
                	   text: 'テンプレートコンフィグ',
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
		g_model = new Model();
		g_model.root = 1;
		g_model.diagrams[1] = new Diagram();
		g_model.diagrams[1].meta_id = 1;
		editor = new DiagramEditor('preview', 'preview'+new Date().getTime(), g_model.diagrams[1]);
		//if not exist
		// create_project
		//editorjs
	}else if(item.id == 'MetaDiagram') {
		var editor = new MetaDiagramsEditor(g_metamodel.metadiagrams);
		editortabpanel.add(editor, 'metadiagrams');
	}else if(item.id == 'MetaObj') {
		var editor = new MetaObjectsEditor(g_metamodel.metaobjects);
		editortabpanel.add(editor, 'metaobjects');
	}else if(item.id == 'MetaRel') {
		var editor = new MetaRelationsEditor(g_metamodel.metarelations);
		editortabpanel.add(editor, 'metarelations');
	}else if(item.id == 'MetaProp') {
		var editor = new MetaPropertyEditor(g_metamodel.metaproperties);
		editortabpanel.add(editor, 'metaproperties');
	}else if(item.id == 'metajson') {
		var editor = new MetaJSONEditor(g_metamodel.metadiagrams);
		editortabpanel.add(editor, 'metajson');
	}else if(item.id == 'welcome_editor') {
		var editor = new WellcomeMessageEditor();
		editortabpanel.add(editor, 'welcome_editor');
	}else{
		
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
		window.open('/template/export/'+g_metamodel_id);
	}else if(item.id == 'tempconfig') {
		var editor = new TempConfigEditor();
		editortabpanel.add(editor, 'tempconfig');
	}
}

function export_template() {
	$.post('/template/tree', { id : g_metamodel_id},
			function(data) {
				if(data) {
					
				}
			}, "json");
}

function import_template(text) {
	$.post('/template/import', { id : g_metamodel_id, text: text},
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
	$.post('/template/tree', { id : g_metamodel_id},
			function(data) {
				if(data) {
					g_templates = data;
					createTemplateExplorer();
				}
			}, "json");
}

function create_new_template(fname) {
	$.post('/template/new', { id : g_metamodel_id, fname : fname },
			function(data) {
				if(data) {
					load_templates();
				}
			}, "json");
}

function save_template(fname, content) {
	$.post('/template/save', { id : g_metamodel_id, fname : fname , content : content},
			function(data) {
				if(data) {
					
				}
			}, "json");
}


function createTemplateExplorer() {
	Ext.getCmp('modelexplorer').removeAll();
	var nodes = [];
	for(var i=0;i < g_templates.length;i++) {
		var key = g_templates[i].name;
		nodes.push({id: ''+i, text: key, leaf: true});
	}

	var store = Ext.create('Ext.data.TreeStore', {
	    root: {
	        expanded: true,
	        children: [
	            { text: "templates", expanded: true, children: nodes }
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
	modelExplorer.on('itemclick',function(view, record, item, index, event) {
    	editor = new TemplateEditor(g_templates[record.data.id]);
    	editortabpanel.add(editor, record.data.text);
    });
	Ext.getCmp('modelexplorer').add(modelExplorer);
	return modelExplorer;
}

Ext.require([
    'Ext.panel.*',
    'Ext.toolbar.*',
    'Ext.button.*',
    'Ext.container.ButtonGroup',
    'Ext.layout.container.Table'
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
		    	   title:'EAST',
		    	   html:'EAST PANEL',
		    	   margins:'0 3 0 3',
		    	   region:'east',
		    	   collapsible:true,
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
            text: 'Edit',
            iconCls: 'add16',
            menu: [
                   {
                	   text: 'delete',
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
                	   text: 'プレビュー',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   },{
                	   id: 'MetaObj',
                	   text: 'MetaObj',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   },{
                	   id: 'MetaRel',
                	   text: 'MetaRel',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   },{
                	   id: 'metajson',
                	   text: 'メタモデル',
                	   iconCls: 'add16',
                	   handler : onItemClick
                   },{
                	   id: 'tempconfig',
                	   text: 'テンプレートコンフィグ',
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
		current_editor.save();
	}else if(item.id == 'preview') {
		g_model = new Model();
		g_model.root = 1;
		g_model.diagrams[1] = new Diagram();
		g_model.diagrams[1].meta_id = 1;
		editor = new DiagramEditor('preview', 'preview'+new Date().getTime(), g_model.diagrams[1]);
	}else if(item.text == 'MetaObj') {
		MetaModelEditor(g_metamodel.metaobjects);
	}else if(item.text == 'MetaRel') {
		MetaRelationEditor(g_metamodel.metarelations);
	}else if(item.id == 'metajson') {
		var editor = new MetaJSONEditor(g_metamodel.metadiagrams);
		editortabpanel.add(editor, 'metajson');
	}else if(item.id == 'tempconfig') {
		var editor = new TempConfigEditor();
		editortabpanel.add(editor, 'tempconfig');
	}else{
		
	}
}

function onTempItemClick(item){
	if(item.id == 'new') {
		 Ext.Msg.prompt('','',function(btn,text){
			 if(btn != 'cancel') {
				 create_new_template(text);
			 }
		 },null,true);
	}
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
	    height: 150,
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

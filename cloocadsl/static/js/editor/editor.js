Ext.require([
    'Ext.panel.*',
    'Ext.toolbar.*',
    'Ext.button.*',
    'Ext.container.ButtonGroup',
    'Ext.layout.container.Table'
]);

Ext.onReady(function(){
new Ext.Viewport({
	layout:'border',
	items:[
	       new Ext.Panel({
	    	   html:'CENTER PANEL',
	    	   width:'100px',
	    	   region:'center',
	    	   items : [create_tabs()]
	       }),
	       new Ext.Panel({
	    	   margins:'0 3 0 3',
	    	   region:'north',
	    	   items: [create_menu()]
	       }),
	       new Ext.Panel({
	    	   html:'SOUTH PANEL',
	    	   margins:'3 3 3 3',
	    	   region:'south',
	    	   collapsible:true,
	    	   split:true
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

loadModel(10);
loadMetaModel(6);

});

function create_tabs() {
	var tabs = Ext.create('Ext.tab.Panel', {
	    items: [
	        {
	            title: 'Tab 1',
	            html : 'A simple tab',
	            closable: 'true'
	        },
	        {
	            id   : 'remove-this-tab',
	            title: 'Tab 2',
	            html : 'Another one',
		        closable: 'true'
	        }
	    ],
	});
	editor_tabs = tabs;
	return tabs;
}

function create_menu() {
	return {
        tbar: [{
            xtype:'splitbutton',
            text: 'Menu Button',
            iconCls: 'add16',
            menu: [{text: 'Menu Button 1'}],
        	handler : onItemClick
        },'-',{
            xtype:'splitbutton',
            text: 'Save',
            iconCls: 'add16',
            menu: [{text: 'Cut Menu Item'}],
        	handler : onItemClick
        },{
            text: 'MetaOpen',
            iconCls: 'add16',
            handler : onItemClick
        },{
            text: 'Paste',
            iconCls: 'add16',
            menu: [
                   {text: 'Paste Menu Item'}
                   ]
        },'-',{
            text: 'Format',
            iconCls: 'add16'
        }]
    }
}

function onItemClick(item){
	window.alert('item'+ item.text);
	if(item.text == 'Save') {
		saveModel(10);
	}else if(item.text == 'MetaOpen') {
		MetaModelEditor(g_metamodel.metadiagram.metaobjects);
	}else{
	}
//    Ext.example.msg('Menu Click', 'You clicked the "{0}" menu item.', item.text);
}
/*
var viewport = new Ext.Viewport({
id:'viewport',
layout:'fit',
items:
{
id:'tabs',
xtype:'tabpanel',
closable : 'true',
activeTab: 'firstTab',
defaults:{
bodyStyle:'padding:50px;text-align:center;'
},
items: [
{
id:'firstTab',
title: 'タブパネル1',
html: '<h1>１つ目のタブパネル</h1>'
},{
id:'secondTab',
title: 'タブパネル2',
html: '<h1>2つ目のタブパネル</h1>'
}
]
}
});
*/


function createModelExplorer() {
	var store = Ext.create('Ext.data.TreeStore', {
	    root: {
	        expanded: true,
	        children: [
	            { text: "root", expanded: true, children: [
	                { id: "1", text: "book report", leaf: true },
	                { id: "2", text: "alegrbra", leaf: true}
	            ] }
	        ]
	    }
	});
	var modelExplorer = Ext.create('Ext.tree.Panel', {
	    title: 'Model Explorer',
	    width: 200,
	    height: 150,
	    store: store,
	    rootVisible: false
	});
	modelExplorer.on('itemclick',function(view, record, item, index, event) {
    	console.log('click '+record.data.id);
    	if(record.data.id == 1) {
    		editor = new DiagramEditor('test', 'test'+new Date().getTime(), g_model.root);
    	}
    });
	Ext.getCmp('modelexplorer').add(modelExplorer);
	console.log('a');
	return modelExplorer;
}

/*
Ext.Loader.setConfig({enabled: true});

Ext.Loader.setPath('Ext.ux', '../ux/');

Ext.require([
    'Ext.tab.*',
    'Ext.ux.TabCloseMenu'
]);

Ext.onReady(function() {
    var currentItem;
    var tabs = Ext.createWidget('tabpanel', {
        renderTo: 'tabs',
        resizeTabs: true,
        enableTabScroll: true,
        width: 600,
        height: 250,
        defaults: {
            autoScroll:true,
            bodyPadding: 10
        },
        items: [{
            title: 'Tab 1',
            iconCls: 'tabs',
            html: 'Tab Body<br/><br/>' + Ext.example.bogusMarkup,
            closable: true
        }],
        plugins: Ext.create('Ext.ux.TabCloseMenu', {
            extraItemsTail: [
                '-',
                {
                    text: 'Closable',
                    checked: true,
                    hideOnClick: true,
                    handler: function (item) {
                        currentItem.tab.setClosable(item.checked);
                    }
                }
            ],
            listeners: {
                aftermenu: function () {
                    currentItem = null;
                },
                beforemenu: function (menu, item) {
                    var menuitem = menu.child('*[text="Closable"]');
                    currentItem = item;
                    menuitem.setChecked(item.closable);
                }
            }
        })
    });

    // tab generation code
    var index = 0;
    while(index < 3){
        addTab(index % 2);
    }

    function addTab (closable) {
        ++index;
        tabs.add({
            title: 'New Tab ' + index,
            iconCls: 'tabs',
            html: 'Tab Body ' + index + '<br/><br/>' + Ext.example.bogusMarkup,
            closable: !!closable
        }).show();
    }

    Ext.createWidget('button', {
        renderTo: 'addButtonCt',
        text: 'Add Closable Tab',
        handler: function () {
            addTab(true);
        },
        iconCls:'new-tab'
    });

    Ext.createWidget('button', {
        renderTo: 'addButtonCt',
        text: 'Add Unclosable Tab',
        handler: function () {
            addTab(false);
        },
        iconCls:'new-tab',
        style: 'margin-left: 8px;'
    });
});
*/
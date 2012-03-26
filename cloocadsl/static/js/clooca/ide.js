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
items : [
{
	id:'tabs',
	xtype:'tabpanel',
	activeTab: 'firstTab',
	items: [
{
id:'firstTab',
title: 'タブパネル1',
html: '<h1>１つ目のタブパネル</h1>',
closable: 'true',
},{
id:'secondTab',
title: 'タブパネル2',
html: '<h1>2つ目のタブパネル</h1>',
closable: 'true',
}]
}
]
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
title:'EAST',
html:'EAST PANEL',
margins:'0 3 0 3',
region:'east',
collapsible:true
}),
new Ext.Panel({
title:'WEST',
html:'WEST PANEL',
margins:'0 0 0 3',
region:'west',
collapsible:true,
split:true
}),
]
});

function create_menu() {
	return {
        tbar: [{
            xtype:'splitbutton',
            text: 'Menu Button',
            iconCls: 'add16',
            menu: [{text: 'Menu Button 1'}]
        },'-',{
            xtype:'splitbutton',
            text: 'Cut',
            iconCls: 'add16',
            menu: [{text: 'Cut Menu Item'}]
        },{
            text: 'Copy',
            iconCls: 'add16'
        },{
            text: 'Paste',
            iconCls: 'add16',
            menu: [{text: 'Paste Menu Item'}]
        },'-',{
            text: 'Format',
            iconCls: 'add16'
        }]
    }
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
});

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
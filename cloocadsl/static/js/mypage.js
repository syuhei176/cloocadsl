Ext.require('Ext.tab.*');
Ext.define('Project', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'name',  type: 'string'},
        {name: 'tool_id', type: 'int'},
        {name: 'tool_name', type: 'string'}
    ]
});

Ext.define('Tool', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'name',  type: 'string'}
    ]
});

function create_mypage(tab_items, extends_html) {
	var body = Ext.getBody();
	
    var tabs = Ext.createWidget('tabpanel', {
        activeTab: 0,
        width: 750,
        height: 420,
        plain: true,
        region: 'center',
        defaults :{
            autoScroll: false,
            bodyPadding: 10
        },
        items: [tab_items]
    });

    var viewport = Ext.create('Ext.Viewport', {
        id: 'border-example',
        renderTo: body,
        layout: 'border',
        items: [
        // create instance immediately
        Ext.create('Ext.Component', {
            region: 'north',
            height: 32, // give north and south regions a height
            html:'<div><div style="float:left;">&nbsp;&nbsp;clooca&nbsp;</div><div style="float:left;">'+extends_html+'</div><div id="user-div"><img width="32px" src="/static/images/icon/identity.png"/>'+g_user.uname+'</div><div id="logout-div" onclick="logout()"><a href="/logout">logout</a>&nbsp;&nbsp;&nbsp;</div></div>'
        }), tabs]
    });
}
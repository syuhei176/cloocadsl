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

Ext.onReady(function() {
	var body = Ext.getBody();
	
	function mytools() {
		$.ajax({
			type:"POST",
			url: '/mytools',
			data: '',
			dataType: 'json',
			success: function(data){
				g_mytools = data;
			}
		});
	}
	mytools();
	
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
        items: [create_projects_tab(), create_mytools_tab()]
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
            html:'<p>　clooca <div style="color:#fff;float:right;padding-right: 15px;">'+g_username+'&nbsp;&nbsp;<a href="/logout" style="color:#fff;">logout</a>&nbsp;&nbsp;&nbsp;</div></p>'
        }), tabs]
    });
    
    function create_projects_tab() {
        var ds = Ext.create('Ext.data.Store', {
            model: 'Project',
            proxy: {
                type: 'ajax',
                url : '/project_list',
                reader: {
                    type: 'json',
                }
            },
            autoLoad: true
        });
        
    	var grid = Ext.create('Ext.grid.Panel', {
            columnWidth: 0.60,
            xtype: 'gridpanel',
            store: ds,
            height: 360,
            title:'プロジェクト',

            columns: [
                {
                    text   : '名前',
                    flex: 1,
                    sortable : true,
                    dataIndex: 'name'
                },
                {
                    text   : 'ツール',
                    width    : 120,
                    sortable : true,
                    dataIndex: 'tool_name'
                }
            ],
           	tbar:[
                  {
                      text:'新規作成',
                      iconCls:'add',
                      handler:function(btn){
                    	  create_project_window();
//                          ds.insert(new_metadiagram.id,data);
                      }
                  },{
                      text:'削除',
                      iconCls:'delete',
                      handler:function(btn){
                          var record = grid.getSelectionModel().getSelection()[0];
                          if (record) {
                        		$.post('/deletep', { pid : record.get('id') },
                        				function(data) {
                        					if(data) {
                                                ds.remove(record);
                        					}
                        				}, "json");
                          }
                      }
                  },{
//                      text:'更新',
                      cls: 'x-btn-icon',
                      icon:'/static/images/editor/update.png',
                      handler:function(btn){
                    	  ds.load();
                      }
                  }
                  ],
            listeners: {
                selectionchange: function(model, records) {
                    if (records[0]) {
                        this.up('form').getForm().loadRecord(records[0]);
                    }
                }
            }
        });
	
    var gridForm = Ext.create('Ext.form.Panel', {
        id: 'myprojects-tab',
        frame: true,
        title: 'ダッシュボード',
        bodyPadding: 5,
        width: 750,
        layout: 'column',

        fieldDefaults: {
            labelAlign: 'left',
            msgTarget: 'side'
        },

        items: [grid, {
            columnWidth: 0.4,
            margin: '0 0 0 10',
            xtype: 'fieldset',
            title:'プロジェクトの詳細',
            defaults: {
                width: 240,
                labelWidth: 90
            },
            defaultType: 'textfield',
            items: [{
                fieldLabel: '名前',
                name: 'name'
            },{
                fieldLabel: 'ツール',
                name: 'tool_name'
            }, {
            	xtype: 'button',
            	text: '編集',
        	    handler: function() {
                    var record = grid.getSelectionModel().getSelection()[0];
        	    	window.open('/editor/'+record.get('id'));
        	    }
            }]
        }],
    });
    return gridForm;
    function create_project_window() {
    	var tmps = [];
    	for(var i=0;i < g_mytools.length;i++) {
    		tmps.push({'disp':g_mytools[i].name, 'type':g_mytools[i].id});
    	}
    	var tools_state = Ext.create('Ext.data.Store', {
    	    fields: ['disp','type'],
    	    data : tmps
    	});

    	var win = Ext.create('Ext.window.Window', {
    	    title: 'プロジェクト作成',
    	    height: 240,
    	    width: 360,
    	    layout: 'vbox',
    	    items: [
    	            {
    	            	xtype: 'form',
    	            	url: '/createp',
        	    items: [{
        	    	xtype: 'textfield',
        	    	name: 'name',
        	        fieldLabel: '名前',
        	    	value: '',
        	    },{
        	    	name: 'metamodel_id',
        	    	xtype: 'combo',
        	        fieldLabel: 'ツール',
        	        store: tools_state,
        	        queryMode: 'local',
        	        displayField: 'disp',
        	        valueField: 'type',
        		    value: '',
        	    },{
        	    	xtype: 'textfield',
        	    	name: 'xml',
        	    	hidden: true,
        	    	value: '',
        	    },{
        	    	xtype: 'numberfield',
        	    	name: 'group_id',
        	    	hidden: true,
        	    	value: 0,
        	    },{
        	        xtype: 'checkbox',
        	        fieldLabel: 'サンプルプロジェクト',
        	        name: 'sample',
        	        value: 'false'
        	    }],
        	    buttons: [{
        	    	xtype: 'button',
        	        text: 'OK',
        	        handler: function() {
        	        	alert(this);
        	            var form = this.up('form').getForm();
        	            alert(this.up('form').child('name'));
        	            if (form.isValid()) {
        	                form.submit({
        	                    success: function(form, action) {
        	                    	ds.load();
        	                       Ext.Msg.alert('Success', action.result.msg);
        	                    },
        	                    failure: function(form, action) {
        	                        Ext.Msg.alert('Failed', action.result.msg);
        	                    }
        	                });
        	            }
        	        	win.hide();
        	        }
        	    }]
    	    }]
    	});
    	win.show();
    }
    }
    
    function create_mytools_tab() {
        var mytools_ds = Ext.create('Ext.data.Store', {
            model: 'Tool',
            proxy: {
                type: 'ajax',
                url : '/mytools',
                reader: {
                    type: 'json',
                }
            },
            autoLoad: true
        });
        
    	var grid = Ext.create('Ext.grid.Panel', {
            columnWidth: 0.60,
            xtype: 'gridpanel',
            store: mytools_ds,
            height: 360,
            title:'ツール',
            columns: [
                {
                    id       :'name',
                    text   : '名前',
                    flex: 1,
                    sortable : true,
                    dataIndex: 'name'
/*                },{
                    text   : '公開範囲',
                    width    : 75,
                    sortable : true,
                    dataIndex: 'meta_id'*/
                }
            ],
           	tbar:[
                  {
                      text:'新規作成',
                      iconCls:'add',
                      handler:function(btn){
                    	  create_project_window();
//                          ds.insert(new_metadiagram.id,data);
                      }
                  },{
                      text:'削除',
                      iconCls:'delete',
                      handler:function(btn){
                          var record = grid.getSelectionModel().getSelection()[0];
                          if (record) {
                        		$.post('/deletep', { pid : record.get('id') },
                        				function(data) {
                        					if(data) {
                        						mytools_ds.remove(record);
                        					}
                        				}, "json");
                          }
                      }
                  },{
//                      text:'更新',
                      cls: 'x-btn-icon',
                      icon:'/static/images/editor/update.png',
                      handler:function(btn){
                    	  mytools_ds.load();
                      }
                  }
                  ],
            listeners: {
                selectionchange: function(model, records) {
                    if (records[0]) {
                        this.up('form').getForm().loadRecord(records[0]);
                    }
                }
            }
        });
	
    var gridForm = Ext.create('Ext.form.Panel', {
        id: 'mytools-tab',
        frame: true,
        title: 'マイツール',
        bodyPadding: 5,
        width: 750,
        layout: 'column',

        fieldDefaults: {
            labelAlign: 'left',
            msgTarget: 'side'
        },

        items: [grid, {
            columnWidth: 0.4,
            margin: '0 0 0 10',
            xtype: 'fieldset',
            title:'ツールの詳細',
            defaults: {
                width: 240,
                labelWidth: 90
            },
            defaultType: 'textfield',
            items: [{
                fieldLabel: '名前',
                name: 'name'
            },{
                fieldLabel: 'ツール',
                name: 'meta_id'
            }, {
            	xtype: 'button',
            	text: '編集',
        	    handler: function() {
                    var record = grid.getSelectionModel().getSelection()[0];
        	    	window.open('/editor/'+record.get('id'));
        	    }
            }]
        }],
    });
    return gridForm;
    /*
    function create_project_window() {
    	var tmps = [];
    	for(var i=0;i < g_mytools.length;i++) {
    		tmps.push({'disp':g_mytools[i].name, 'type':g_mytools[i].id});
    	}
    	var tools_state = Ext.create('Ext.data.Store', {
    	    fields: ['disp','type'],
    	    data : tmps
    	});

    	var win = Ext.create('Ext.window.Window', {
    	    title: 'プロジェクト作成',
    	    height: 240,
    	    width: 360,
    	    layout: 'vbox',
    	    items: [
    	            {
    	            	xtype: 'form',
    	            	url: '/createp',
        	    items: [{
        	    	xtype: 'textfield',
        	    	name: 'name',
        	        fieldLabel: '名前',
        	    	value: '',
        	    },{
        	    	name: 'metamodel_id',
        	    	xtype: 'combo',
        	        fieldLabel: 'ツール',
        	        store: tools_state,
        	        queryMode: 'local',
        	        displayField: 'disp',
        	        valueField: 'type',
        		    value: '',
        	    },{
        	    	xtype: 'textfield',
        	    	name: 'xml',
        	    	hidden: true,
        	    	value: '',
        	    },{
        	    	xtype: 'numberfield',
        	    	name: 'group_id',
        	    	hidden: true,
        	    	value: 0,
        	    },{
        	        xtype: 'checkbox',
        	        fieldLabel: 'サンプルプロジェクト',
        	        name: 'sample',
        	        value: 'false'
        	    }],
        	    buttons: [{
        	    	xtype: 'button',
        	        text: 'OK',
        	        handler: function() {
        	        	alert(this);
        	            var form = this.up('form').getForm();
        	            alert(this.up('form').child('name'));
        	            if (form.isValid()) {
        	                form.submit({
        	                    success: function(form, action) {
        	                    	ds.load();
        	                       Ext.Msg.alert('Success', action.result.msg);
        	                    },
        	                    failure: function(form, action) {
        	                        Ext.Msg.alert('Failed', action.result.msg);
        	                    }
        	                });
        	            }
        	        	win.hide();
        	        }
        	    }]
    	    }]
    	});
    	win.show();
    }
    */
    }
});
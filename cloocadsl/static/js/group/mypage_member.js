Ext.require('Ext.tab.*');
Ext.define('Project', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'name',  type: 'string'},
        {name: 'tool_id', type: 'int'},
        {name: 'tool_name', type: 'string'},
        {name: 'tool_version', type: 'int'}
    ]
});

Ext.define('Tool', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'name',  type: 'string'}
    ]
});

    function create_projects_tab() {
    	
    	function mytools() {
    		$.ajax({
    			type:"POST",
    			url: '/tools',
    			data: '',
    			dataType: 'json',
    			success: function(data){
    				g_mytools = data;
    			}
    		});
    	}
    	mytools();

    	
        var ds = Ext.create('Ext.data.Store', {
            model: 'Project',
            proxy: {
                type: 'ajax',
                url : '/myprojects',
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
                },{
                    text   : 'ツール',
                    width    : 120,
                    sortable : true,
                    dataIndex: 'tool_name'
                },{
                    text   : 'ツールのバージョン',
                    width    : 100,
                    sortable : true,
                    dataIndex: 'tool_version'
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
                        	  Ext.Msg.confirm('プロジェクトの削除','削除しますか？',function(btn){
                        		  if(btn == 'yes') {
                                		$.post('/deletep', { pid : record.get('id') },
                                				function(data) {
                                					if(data) {
                                                        ds.remove(record);
                                					}
                                				}, "json");
                        		  }
                        	  });
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
                },
                itemdblclick: {
                	fn : function(rmodel,record,item,index,options){
                        if (record) {
                            this.up('form').getForm().loadRecord(record);
//                            var record = grid.getSelectionModel().getSelection()[0];
                	    	window.open('/editor/'+record.get('id'));
                        }
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
        	            var form = this.up('form').getForm();
//        	            alert(this.up('form').child('name'));
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
                url : '/tools',
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
                      text:'購入',
                      iconCls:'add',
                      handler:function(btn){
                    	  window.open('/market')
                      }
                  },{
                      text:'削除',
                      iconCls:'delete',
                      handler:function(btn){
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
        title: 'グループツール',
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

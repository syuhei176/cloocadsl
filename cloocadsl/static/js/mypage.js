Ext.require('Ext.tab.*');
Ext.define('Project', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'name',  type: 'string'},
        {name: 'meta_id', type: 'int'}
    ]
});
Ext.onReady(function() {
	var body = Ext.getBody();

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
	
	function update() {
		$.ajax({
			type:"POST",
			url: 'project_list',
			data: '',
			dataType: 'json',
			success: function(data){
			}
		});
	}
	
	var grid = Ext.create('Ext.grid.Panel', {
            columnWidth: 0.60,
            xtype: 'gridpanel',
            store: ds,
            height: 360,
            title:'プロジェクト',

            columns: [
                {
                    id       :'name',
                    text   : '名前',
                    flex: 1,
                    sortable : true,
                    dataIndex: 'name'
                },
                {
                    text   : 'ツール',
                    width    : 75,
                    sortable : true,
                    dataIndex: 'meta_id'
                }
            ],
           	tbar:[
                  {
                      text:'追加',
                      iconCls:'add',
                      handler:function(btn){
                    	  create_project_window();
                          ds.insert(new_metadiagram.id,data);
                      }
                  },
                  {
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
        id: 'company-form',
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
        items: [
                gridForm
        ]
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
            html:'<p>　clooca<a href="/logout" style="color:#fff;float:right;padding-right: 15px;">logout</a>&nbsp;&nbsp;&nbsp;</p>'
        }), tabs]
    });
    
    function create_project_window() {
    	var tools_state = Ext.create('Ext.data.Store', {
    	    fields: ['disp','type'],
    	    data : [
    	        {"disp":"ツール１","type":1},
    	        {"disp":"ツール２","type":2},
    	        {"disp":"ツール３","type":3}
    	    ]
    	});

    	var win = Ext.create('Ext.window.Window', {
    	    title: 'プロジェクト作成',
    	    height: 240,
    	    width: 360,
    	    layout: 'vbox',
    	    items: [{
    	    	xtype: 'textfield',
    	        fieldLabel: '名前',
    	    	value: '',
                listeners:{
                	scope: this,
                    'change': function(field, newValue, oldValue, opt){
                    	metadiagram.name = newValue;
                    }
               }
    	    },{
    	    	xtype: 'combo',
    	        fieldLabel: 'ツール',
    	        store: tools_state,
    	        queryMode: 'local',
    	        displayField: 'disp',
    	        valueField: 'type',
    		    value: '',
    		    listeners:{
    	            	scope: this,
    	                'select': function(combo, records, option){
    	                }
    		    }
    	    },{
    	        xtype: 'checkbox',
    	        fieldLabel: 'サンプルプロジェクト',
    	        name: 'metaobjects',
    	        value: 'false'
    	    },{
    	    	xtype: 'button',
    	        text: 'OK',
    	        handler: function() {
    	        	win.hide();
    	        	if(fn != null) fn(metadiagram);
    	        }
    	    }]
    	});
    	win.show();
    }
});
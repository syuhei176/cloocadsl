
Ext.define('Tag', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'version',  type: 'int'},
        {name: 'created_date',  type: 'string'},
        {name: 'tag',  type: 'string'}
    ]
});

CloocaWorkbench.ManageVersionsWindow = function() {
	var self = this;
	self.textField = null;
    var ds = Ext.create('Ext.data.Store', {
        model: 'Tag',
        proxy: {
            type: 'ajax',
            url : '/wb-api/tags/' + g_toolinfo.toolkey,
            reader: {
                type: 'json',
            }
        },
        autoLoad: true
    });
	self.grid = Ext.create('Ext.grid.Panel', {
        columnWidth: 0.60,
        xtype: 'gridpanel',
        store: ds,
        height: 360,
//        title:'Manage Versions',
        columns: [
            {
                text   : 'タグ',
                flex: 1,
                sortable : true,
                dataIndex: 'tag'
            },{
                text   : 'バージョン',
                width    : 120,
                sortable : true,
                dataIndex: 'version'
            },{
                text   : 'Date',
                width    : 100,
                sortable : true,
                dataIndex: 'created_date'
            }
        ],
       	tbar:[{
            xtype: 'textfield',
            name: 'newTagfield',
            hideLabel: true,
            width: 200/*,
            listeners: {
                change: {
                    fn: self.onTextFieldChange,
                    scope: this,
                    buffer: 100
                }
            }*/
       	}, {
           xtype: 'button',
           text: 'タグ付け',
           tooltip: 'Find Previous Row',
           handler: function() {
        		$.post('/wb-api/create-tag', { toolkey : g_toolinfo.toolkey, tag : self.textField.getValue()},
        				function(data) {
        					if(data) {
        						ds.load();
        					}
        				}, "json");
           },
           scope: self
        }],
        listeners: {
            selectionchange: function(model, records) {
                if (records[0]) {
                    //this.up('form').getForm().loadRecord(records[0]);
                }
            },
            itemdblclick: {
            	fn : function(rmodel,record,item,index,options){
                    if (record) {
                        this.up('form').getForm().loadRecord(record);
//                        var record = grid.getSelectionModel().getSelection()[0];
            	    	window.open('/editor/'+record.get('id'));
                    }
            	}
            },
            afterrender: function() {
            	self.textField = self.grid.down('textfield[name=newTagfield]');
            }
        }
    });
	var win = Ext.create('Ext.window.Window', {
	    title: 'タグ管理',
	    height: 320,
	    width: 480,
//	    layout: 'vbox',
	    closable: true,
	    items: [self.grid]
	});
	return {
		show : function() {
			win.show();
		}
	};
}

CloocaWorkbench.ManageVersionsWindow.prototype.onCreateNewTag = function(self) {
	$.post('/wb-api/create-tag', { toolkey : g_toolinfo.toolkey, tag : self.textField.getValue()},
			function(data) {
				if(data) {
					ds.load();
				}
			}, "json");
}

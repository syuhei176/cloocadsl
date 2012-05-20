function MetaDiagramsEditor(metaobjects) {
	var self = this;
	var l_metaobjs = [];
	for(var i=0;i < metaobjects.length;i++) {
		if(metaobjects[i] != null) l_metaobjs.push(metaobjects[i]);
	}
	Ext.create('Ext.data.Store', {
	    storeId:'simpsonsStore',
	    fields:['id', 'name'],
	    data:{
	    	'items':l_metaobjs
	    },
	    proxy: {
	        type: 'memory',
	        reader: {
	            type: 'json',
	            root: 'items'
	        }
	    }
	});
	
	var grid = Ext.create('Ext.grid.Panel', {
	    title: 'MetaDiagrams',
	    store: Ext.data.StoreManager.lookup('simpsonsStore'),
	    columns: [
	        { header: 'Id',  dataIndex: 'id' },
	        { header: 'Name', dataIndex: 'name', flex: 1 }
	    ],
	    height: 200,
	    width: 400,
    	listeners : {
    		itemdblclick : {
    			fn : function(rmodel,record,item,index,options){
    				self.show_setting_metadiagram_window(metaobjects[record.data.id], function(metadiagram) {
    					alert(index);
    					grid.getStore().getAt(index).set('name', metadiagram.name);
    				});
    			}
    		}
    	},
    	tbar:[
              {
                  text:'追加',
                  iconCls:'add',
                  handler:function(btn){
    	  	     	    var new_metadiagram = new MetaDiagram(metaobjects.length, '');
//    	  	  	     	self.show_setting_metadiagram_window(new_metadiagram);
    	  	  	     	metaobjects.push(new_metadiagram);
                      var data = {
                          id: new_metadiagram.id,name: new_metadiagram.name
                      };
                      grid.getStore().insert(new_metadiagram.id,data);
                  }
              },
              {
                  text:'削除',
                  iconCls:'delete',
                  handler:function(btn){
                      var record = grid.getSelectionModel().getSelection()[0];
                      if (record) {
                          grid.getStore().remove(record);
                      }
                  }
              }
              ]
	});
	
	this.panel = Ext.create('Ext.panel.Panel',
		{
			xtype: 'panel',
		  	   title: 'MetaDiagrams',
		  	   layout: {
		  		   type: 'hbox',
		  		   align: 'center'
		  	   },
		  	   items: [grid],
		  	   closable: 'true'
	});
	
}

MetaDiagramsEditor.prototype.show_setting_metadiagram_window = function(metadiagram, fn) {
	var self = this;
	var type_states = Ext.create('Ext.data.Store', {
	    fields: ['disp','type'],
	    data : [
	        {"disp":"テンプレート","type":"template"},
	        {"disp":"テンプレート（ダイアグラム）","type":"template_diagram"},
	        {"disp":"コピー","type":"copy"}
	    ]
	});
	
	var metaobject_names = [];
	for(var i=0;i < metadiagram.metaobjects.length;i++) {
		metaobject_names.push(g_metamodel.metaobjects[metadiagram.metaobjects[i]].name);
	}
	var metarelation_names = [];
	for(var i=0;i < metadiagram.metarelations.length;i++) {
		metarelation_names.push(g_metamodel.metarelations[metadiagram.metarelations[i]].name);
	}
	var win = Ext.create('Ext.window.Window', {
	    title: 'metadiagram',
	    height: 240,
	    width: 360,
	    layout: 'vbox',
	    items: [{
	    	xtype: 'textfield',
	        fieldLabel: 'name',
	    	value: metadiagram.name,
            listeners:{
            	scope: this,
                'change': function(field, newValue, oldValue, opt){
                	metadiagram.name = newValue;
                }
           }
/*	    },{
	    	xtype: 'combo',
	        fieldLabel: 'type',
	        store: type_states,
	        queryMode: 'local',
	        displayField: 'disp',
	        valueField: 'type',
		    value: mapping.type,
		    listeners:{
	            	scope: this,
	                'select': function(combo, records, option){
	                	mapping.type = combo.getValue();
	                	self.texteditor.setValue(JSON.stringify(g_wbconfig));
	                }
		    }*/
	    },{
	        xtype: 'displayfield',
	        fieldLabel: 'MetaObjects',
	        name: 'metaobjects',
	        value: metaobject_names
	    },{
	    	xtype: 'button',
	        text: 'add metaobjects',
	        handler: function() {
	        	self.createMetaObjectGrid(function(meta_objs){
	        		metadiagram.metaobjects = meta_objs;
	        		win.hide();
	        		self.show_setting_metadiagram_window(metadiagram);
	        	}, metadiagram.metaobjects);
	        }
	    },{
	        xtype: 'displayfield',
	        fieldLabel: 'MetaRelationships',
	        name: 'metarelations',
	        value: metarelation_names
	    },{
	    	xtype: 'button',
	        text: 'add metarelationships',
	        handler: function() {
	        	self.createMetaRelationGrid(function(meta_objs){
	        		metadiagram.metarelations = meta_objs;
	        	}, metadiagram.metarelations);
	        }
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

MetaDiagramsEditor.prototype.save = function() {
	var self = this;
	saveMetaModel(g_metamodel_id, function(data){
		if(data) {
			self.panel.setTitle('MetaDiagrams');
		}
	});
}

MetaDiagramsEditor.prototype.getPanel = function() {
	return this.panel;
}

MetaDiagramsEditor.prototype.Initialize = function() {
}

MetaDiagramsEditor.prototype.onActivate = function() {
	current_editor = this;
}

MetaDiagramsEditor.prototype.createMetaObjectGrid = function(fn, selected) {
	var l_metaobjs = [];
	for(var i=0;i < g_metamodel.metaobjects.length;i++) {
		if(g_metamodel.metaobjects[i] != null) l_metaobjs.push(g_metamodel.metaobjects[i]);
	}
	this.createMetaElementGrid(l_metaobjs, fn, selected);
}

MetaDiagramsEditor.prototype.createMetaRelationGrid = function(fn, selected) {
	var l_metaobjs = [];
	for(var i=0;i < g_metamodel.metarelations.length;i++) {
		if(g_metamodel.metarelations[i] != null) l_metaobjs.push(g_metamodel.metarelations[i]);
	}
	this.createMetaElementGrid(l_metaobjs, fn, selected);
}

MetaDiagramsEditor.prototype.createMetaElementGrid = function(l_elements, fn, selected) {
	var win = null;
	var metaobjs = [];
	Ext.create('Ext.data.Store', {
	    storeId:'metaobjects',
	    fields:['id', 'name'],
	    data:{'items':l_elements},
	    proxy: {
	        type: 'memory',
	        reader: { type: 'json', root: 'items' }
	    }
	});
	
	var grid = Ext.create('Ext.grid.Panel', {
	    title: 'MetaObjects',
	    autoScroll: true,
	    store: Ext.data.StoreManager.lookup('metaobjects'),
	    columns: [
	        { header: 'Id',  dataIndex: 'id' },
	        { header: 'Name', dataIndex: 'name', flex: 1 }
	    ],
	    height: 240,
	    width: 400,
	    selModel : new Ext.selection.CheckboxModel({
	        listeners: {
	            selectionchange: function(sm, selections) {
	            	metaobjs = [];
	                for(var i=0;i < selections.length;i++) {
	            		console.log(selections[i].get('id'));
	                	metaobjs.push(selections[i].get('id'));
	                }
	            }
        	}
        	})
	});
	
	win = Ext.create('Ext.window.Window', {
	    title: 'mappings',
	    width: 360,
	    height: 300,
	    layout: 'fit',
	    items: [grid],
	    dockedItems: [{
	        xtype: 'toolbar',
	        dock: 'bottom',
	        ui: 'footer',
	        layout: {
	            pack: 'center'
	        },
	        items: []
	    }, {
	        xtype: 'toolbar',
	        items: [{
	            text:'OK',
	            tooltip:'OK',
	            iconCls:'add',
	            handler : function(){
					fn(metaobjs);
		        	win.hide();
	            }
	        }]
	    }]
	});
	win.show();
	
	for(var i=0;i<selected.length;i++) {
		grid.getSelectionModel().select(selected[i]-1, true);
	}

}

function MetaObjectsEditor(metaobjects) {
	var l_metaobjs = [];
	for(var i=0;i < metaobjects.length;i++) {
		if(metaobjects[i] != null) l_metaobjs.push(metaobjects[i]);
	}
	Ext.create('Ext.data.Store', {
	    storeId:'metaobjects',
	    fields:['id', 'name', 'graphic'],
	    data:{'items':l_metaobjs},
	    proxy: {
	        type: 'memory',
	        reader: { type: 'json', root: 'items' }
	    }
	});
	
	var grid = Ext.create('Ext.grid.Panel', {
	    title: 'MetaObjects',
	    store: Ext.data.StoreManager.lookup('metaobjects'),
	    columns: [
	        { header: 'Id',  dataIndex: 'id' },
	        { header: 'Name', dataIndex: 'name', flex: 1 },
	        { header: 'Graphic', dataIndex: 'graphic', flex: 1 }
	    ],
	    height: 240,
	    width: 400,
	    selModel : new Ext.selection.RowModel({
        	singleSelect : true,
        	listeners : {
        		select : {
        			fn : function(rmodel,record,index,options){
        				 Ext.Msg.prompt('編集','プロパティ',function(btn,text){
        					 if(btn != 'cancel') {
        						 metaobjects[record.data.id] = JSON.parse(text);
        					 }
        				 },null,true,JSON.stringify(metaobjects[record.data.id]));
        			}
        		}
        	}
        })
	});
	
	this.panel = Ext.create('Ext.panel.Panel',
		{
			xtype: 'panel',
		  	   title: 'MetaObjects',
		  	   layout: {
		  		   type: 'hbox',
		  		   align: 'center'
		  	   },
		  	   items: [
		  	           grid,
  	  	  	           {
  	  	  	        	   xtype: 'button',
  	  	  	        	   text: 'add',
	  	  	  	     	    handler: function() {
	  	  	  	     	    	metaobjects.push(new MetaObject(metaobjects.length, ''));
	  	  	  	     	    }
  	  	  	           },
  	  	  	           {
  	  	  	        	   xtype: 'button',
  	  	  	        	   text: 'delete',
	  	  	  	     	    handler: function() {
	  	  	  	     	    	alert('You clicked the button!');
	  	  	  	     	    }
  	  	  	           }
		  	           ],
		  	 		closable: 'true'
	});
	
}

MetaObjectsEditor.prototype.save = function() {
	var self = this;
	saveMetaModel(g_metamodel_id, function(data){
		if(data) {
			self.panel.setTitle('JSONEditor');
		}
	});
}

MetaObjectsEditor.prototype.getPanel = function() {
	return this.panel;
}

MetaObjectsEditor.prototype.Initialize = function() {
}

MetaObjectsEditor.prototype.onActivate = function() {
	current_editor = this;
}

function MetaRelationsEditor(metarelations) {
	var l_metaobjs = [];
	for(var i=0;i < metarelations.length;i++) {
		if(metarelations[i] != null) l_metaobjs.push(metarelations[i]);
	}
	Ext.create('Ext.data.Store', {
	    storeId:'simpsonsStore',
	    fields:['id', 'name', 'arrow_type'],
	    data:{
	    	'items':l_metaobjs
	    },
	    proxy: {
	        type: 'memory',
	        reader: {
	            type: 'json',
	            root: 'items'
	        }
	    }
	});
	
	var grid = Ext.create('Ext.grid.Panel', {
	    title: 'MetaRelations',
	    store: Ext.data.StoreManager.lookup('simpsonsStore'),
	    columns: [
	        { header: 'Id',  dataIndex: 'id' },
	        { header: 'Name', dataIndex: 'name', flex: 1 },
	        { header: 'Arrow type', dataIndex: 'arrow_type', flex: 1 }
	    ],
	    height: 200,
	    width: 400,
	    selModel : new Ext.selection.RowModel({
        	singleSelect : true,
        	listeners : {
        		select : {
        			fn : function(rmodel,record,index,options){
        				 Ext.Msg.prompt('編集','プロパティ',function(btn,text){
        					 if(btn != 'cancel') {
        						 metarelations[record.data.id] = JSON.parse(text);
        					 }
        				 },null,true,JSON.stringify(metarelations[record.data.id]));
        			}
        		}
        	}
        })
	});
	
	this.panel = Ext.create('Ext.panel.Panel',
		{
			xtype: 'panel',
		  	   title: 'MetaRelations',
		  	   layout: {
		  		   type: 'hbox',
		  		   align: 'center'
		  	   },
		  	   items: [
		  	           grid,
  	  	  	           {
  	  	  	        	   xtype: 'button',
  	  	  	        	   text: 'add',
	  	  	  	     	    handler: function() {
	  	  	  	     	    	metarelations.push(new MetaRelation(metarelations.length, ''));
	  	  	  	     	    }
  	  	  	           },
  	  	  	           {
  	  	  	        	   xtype: 'button',
  	  	  	        	   text: 'delete',
	  	  	  	     	    handler: function() {
	  	  	  	     	    	
	  	  	  	     	    }
  	  	  	           }
		  	           ],
		  	 		closable: 'true'
	});
	
}

MetaRelationsEditor.prototype.save = function() {
	var self = this;
	saveMetaModel(g_metamodel_id, function(data){
		if(data) {
			self.panel.setTitle('JSONEditor');
		}
	});
}

MetaRelationsEditor.prototype.getPanel = function() {
	return this.panel;
}

MetaRelationsEditor.prototype.Initialize = function() {
}

MetaRelationsEditor.prototype.onActivate = function() {
	current_editor = this;
}

function MetaPropertyEditor(metaobjects) {
	var l_metaobjs = [];
	this.selected_index = -1;
	var self = this;
	for(var i=0;i < metaobjects.length;i++) {
		if(metaobjects[i] != null) l_metaobjs.push(metaobjects[i]);
	}
	Ext.create('Ext.data.Store', {
	    storeId:'simpsonsStore',
	    fields:['id', 'name', 'graphic'],
	    data:{
	    	'items':l_metaobjs
	    },
	    proxy: {
	        type: 'memory',
	        reader: {
	            type: 'json',
	            root: 'items'
	        }
	    }
	});
	
	var grid = Ext.create('Ext.grid.Panel', {
	    title: 'MetaProperties',
	    store: Ext.data.StoreManager.lookup('simpsonsStore'),
	    columns: [
	        { header: 'Id',  dataIndex: 'id' },
	        { header: 'Name', dataIndex: 'name', flex: 1 },
	        { header: 'Graphic', dataIndex: 'graphic', flex: 1 }
	    ],
	    height: 200,
	    width: 400,
	    selModel : new Ext.selection.RowModel({
        	singleSelect : true,
        	listeners : {
        		select : {
        			fn : function(rmodel,record,index,options){
        				self.selected_index = record.data.id;
        				 Ext.Msg.prompt('編集','プロパティ',function(btn,text){
        					 if(btn != 'cancel') {
        						 metaobjects[record.data.id] = JSON.parse(text);
        					 }
        				 },null,true,JSON.stringify(metaobjects[record.data.id]));
        			}
        		}
        	}
        })
	});
	
	this.panel = Ext.create('Ext.panel.Panel',
		{
			xtype: 'panel',
		  	   title: 'MetaProperties',
		  	   layout: {
		  		   type: 'hbox',
		  		   align: 'center'
		  	   },
		  	   items: [
		  	           grid,
  	  	  	           {
  	  	  	        	   xtype: 'button',
  	  	  	        	   text: 'add',
	  	  	  	     	    handler: function() {
	  	  	  	     	    	metaobjects.push(new MetaProperty(metaobjects.length, ''));
	  	  	  	     	    }
  	  	  	           },
  	  	  	           {
  	  	  	        	   xtype: 'button',
  	  	  	        	   text: 'delete',
	  	  	  	     	    handler: function() {
//	  	  	  	     	    	alert(self.selected_index);
//	  	  	  	     	    	metaobjects.slice(self.selected_index, 1);
	  	  	  	     	    	metaobjects.slice(7, 1);
	  	  	  	     	    }
  	  	  	           }
		  	           ],
		  	 		closable: 'true'
	});
	
}

MetaPropertyEditor.prototype.save = function() {
	var self = this;
	saveMetaModel(g_metamodel_id, function(data){
		if(data) {
			self.panel.setTitle('JSONEditor');
		}
	});
}

MetaPropertyEditor.prototype.getPanel = function() {
	return this.panel;
}

MetaPropertyEditor.prototype.Initialize = function() {
}

MetaPropertyEditor.prototype.onActivate = function() {
	current_editor = this;
}

function MetaJSONEditor(metadiagram) {
	this.resource = g_metamodel;
	var self = this;
	var editor = Ext.create('Ext.panel.Panel',
		{
		  	   title: 'JSONEditor',
		  	   layout: {
		  		   type: 'hbox',
		  		   align: 'center'
		  	   },
		  	   items: [
		  	           {
		  	        	   xtype: 'textarea',
		  	        	   autoScroll: true,
	  	        		   width: Ext.getCmp('centerpanel').getWidth(),
	  	        		   height: Ext.getCmp('centerpanel').getHeight(),
		  	        		   value: JSON.stringify(g_metamodel),
		  	        		   listeners: {
		  	        			   change: {
		  	        				   fn: function(field, newValue, oldValue, opt) {
		  	        						g_metamodel = JSON.parse(newValue);
		  	        						editor.setTitle('JSONEditor*')
		  	        						console.log('change');
		  	        				   }
		  	        			   }
		  	        		   }
		  	           }
		  	           ],
		  	 		closable: 'true'
	});
	this.editor = editor;
}

MetaJSONEditor.prototype.save = function() {
	var self = this;
	saveMetaModel(g_metamodel_id, function(data){
		if(data) {
			self.editor.setTitle('JSONEditor');
		}
	});
}

MetaJSONEditor.prototype.getPanel = function() {
	return this.editor;
}

MetaJSONEditor.prototype.Initialize = function() {
}

MetaJSONEditor.prototype.onActivate = function() {
	current_editor = this;
}

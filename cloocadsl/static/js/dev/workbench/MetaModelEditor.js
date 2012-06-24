/*
 * メタモデルエディタの基底クラス
 * datas
 * title
 * cb1
 * MetaMetaElement
 */
MetaJSONEditor.prototype.createGridEditor = function(datas, title, cb1, MetaMetaElement) {
	var self = this;
	/*
	 * datasは辞書型、配列に変換する。
	 */
	var l_datas = [];
	for(var key in datas) {
		l_datas.push(datas[key]);
	}
	Ext.create('Ext.data.Store', {
	    storeId:'simpsonsStore',
	    fields:['id', 'name'],
	    data:{'items':l_datas},
	    proxy: {type: 'memory',reader: {type: 'json',root: 'items'}}
	});
	/*
	 * Gridを作成する。
	 */
	var grid = Ext.create('Ext.grid.Panel', {
	    title: title,
	    store: Ext.data.StoreManager.lookup('simpsonsStore'),
	    columns: [
	        { header: 'ID',  dataIndex: 'id' },
	        { header: '名前', dataIndex: 'name', flex: 1 }
	    ],
	    height: 200,
	    width: 400,
    	listeners : {
    		itemdblclick : {
    			fn : function(rmodel,record,item,index,options){
    				cb1(datas[record.data.id]);
    			}
    		}
    	},
    	tbar:[
              {
                  text:'追加',
                  iconCls:'add',
                  handler:function(btn){
                	  var new_element = new MetaMetaElement();
                	  datas[new_element.id] = new_element;
                      var data = {
                          id: new_element.id,name: new_element.name
                      };
                      grid.getStore().insert(new_element.id,data);
//                      self.editor.setTitle(self.title + '*');
                      self.jsoneditor.setValue(JSON.stringify(g_metamodel));

                  }
              },
              {
                  text:'削除',
                  iconCls:'delete',
                  handler:function(btn){
                      var record = grid.getSelectionModel().getSelection()[0];
                      if (record) {
                          grid.getStore().remove(record);
                          delete datas[record.get('id')];
//                          self.editor.setTitle(self.title + '*');
                          self.jsoneditor.setValue(JSON.stringify(g_metamodel));
                      }
                  }
              }
              ]
	});
	var panel = Ext.create('Ext.panel.Panel',
			{
				xtype: 'panel',
			  	   title: title,
			  	   layout: {
			  		   type: 'hbox',
			  		   align: 'center'
			  	   },
			  	   items: [grid],
		});
	return panel;
}
/*
BaseGridEditor.prototype.save = function() {
	var self = this;
	saveMetaModel(g_metaproject.id, function(data){
		if(data) {
			self.panel.setTitle(self.title);
		}
	});
}

BaseGridEditor.prototype.getPanel = function() {
	return this.panel;
}

BaseGridEditor.prototype.Initialize = function() {
}

BaseGridEditor.prototype.onActivate = function() {
	current_editor = this;
}
*/

/*
 * jsonエディタも付ける、json側がマスターになってる
 */
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

//MetaDiagramsEditor.prototype.show_setting_metadiagram_window = function(metadiagram, fn) {
function show_setting_metadiagram_window(metadiagram, fn) {
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
	        		show_setting_metadiagram_window(metadiagram);
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
	saveMetaModel(g_metaproject.id, function(data){
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

function createMetaObjectGrid(fn, selected) {
	var l_metaobjs = [];
	for(var i=0;i < g_metamodel.metaobjects.length;i++) {
		if(g_metamodel.metaobjects[i] != null) l_metaobjs.push(g_metamodel.metaobjects[i]);
	}
	createMetaElementGrid(l_metaobjs, fn, selected);
}

function createMetaRelationGrid(fn, selected) {
	var l_metaobjs = [];
	for(var i=0;i < g_metamodel.metarelations.length;i++) {
		if(g_metamodel.metarelations[i] != null) l_metaobjs.push(g_metamodel.metarelations[i]);
	}
	createMetaElementGrid(l_metaobjs, fn, selected);
}

function createMetaElementGrid(l_elements, fn, selected) {
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


function MetaJSONEditor(metadiagram) {
	this.resource = g_metamodel;
	var self = this;
	this.jsoneditor = Ext.create('Ext.form.field.TextArea', {
		title: 'json',
		autoScroll: true,
		width: Ext.getCmp('centerpanel').getWidth(),
		height: Ext.getCmp('centerpanel').getHeight(),
 		   value: JSON.stringify(g_metamodel),
 		   listeners: {
 			   change: {
 				   fn: function(field, newValue, oldValue, opt) {
 					  g_metamodel = JSON.parse(newValue);
 						self.editor.setTitle('メタモデル*')
 				   }
 			   }
 		   }
    });
	/*
	this.jsoneditor = Ext.create('Ext.panel.Panel',
		{
		  	   title: 'json',
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
		  	 		closable: false
	});
	*/
	this.deditor = this.createGridEditor(g_metamodel.metadiagrams, 'MetaDiagram', function(d){
		self.createJsonWindow(g_metamodel.metadiagrams[d.id], function(field, newValue, oldValue, opt) {
			   g_metamodel.metadiagrams[d.id] = JSON.parse(newValue);
			   self.jsoneditor.setValue(JSON.stringify(g_metamodel));
			   });
	}, MetaDiagram);
	this.oeditor = this.createGridEditor(g_metamodel.metaobjects, 'MetaObjects', function(metaobj){
		console.log(metaobj.id);
		self.createJsonWindow(g_metamodel.metaobjects[metaobj.id], function(field, newValue, oldValue, opt) {
			   g_metamodel.metaobjects[metaobj.id] = JSON.parse(newValue);
			   self.jsoneditor.setValue(JSON.stringify(g_metamodel));
			   });
	}, MetaObject);
	this.reditor = this.createGridEditor(g_metamodel.metarelations, 'MetaRelationships', function(metaobj){
		console.log(metaobj.id);
		self.createJsonWindow(g_metamodel.metarelations[metaobj.id], function(field, newValue, oldValue, opt) {
			   g_metamodel.metarelations[metaobj.id] = JSON.parse(newValue);
			   self.jsoneditor.setValue(JSON.stringify(g_metamodel));
			   });
		/*
		 Ext.Msg.prompt('編集','プロパティ',function(btn,text){
			 if(btn != 'cancel') {
				 g_metamodel.metarelations[metaobj.id] = JSON.parse(text);
                 self.jsoneditor.setValue(JSON.stringify(g_metamodel));
			 }
		 },null,true,JSON.stringify(metaobj));
		 */
	}, MetaRelation);
	this.peditor = this.createGridEditor(g_metamodel.metaproperties, 'MetaProperties', function(metaprop){
		console.log(metaprop.id);
		self.createJsonWindow(g_metamodel.metaproperties[metaprop.id], function(field, newValue, oldValue, opt) {
			   g_metamodel.metaproperties[metaprop.id] = JSON.parse(newValue);
			   self.jsoneditor.setValue(JSON.stringify(g_metamodel));
			   });
	}, MetaProperty);
	var tabpanel = Ext.create('Ext.tab.Panel', {
		title: 'メタモデル',
		tabPosition: 'bottom',
        defaults :{
            bodyPadding: 6
        },
	    items: [this.deditor, this.oeditor, this.reditor, this.peditor, this.jsoneditor],
	    closable: 'true'
	});

	this.editor = tabpanel;
}

MetaJSONEditor.prototype.save = function() {
	var self = this;
	saveMetaModel(g_metaproject.id, function(data){
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

MetaJSONEditor.prototype.createJsonWindow = function(metaelement, fn) {
	var self = this;
	var textarea = Ext.create('Ext.form.field.TextArea', {
		title: 'json',
		autoScroll: true,
		width: 480,
		height: 240,
 		   value: JSON.stringify(metaelement),
 		   listeners: {
 			   change: {
 				   fn: fn/*function(field, newValue, oldValue, opt) {
 					   g_metamodel.metaproperties[id] = JSON.parse(newValue);
 					   self.jsoneditor.setValue(JSON.stringify(g_metamodel));
 					   console.log(JSON.stringify(g_metamodel));
 				   }*/
 			   }
 		   }
    });
	var win = Ext.create('Ext.window.Window', {
	    title: 'json',
	    width: 480,
	    height: 240,
	    layout: 'fit',
	    items: [textarea]
	});
	win.show()
}

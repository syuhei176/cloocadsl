function MetaModelEditor(metaobjects) {
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
	    title: 'Simpsons',
	    store: Ext.data.StoreManager.lookup('simpsonsStore'),
	    columns: [
	        { header: 'Id',  dataIndex: 'id' },
	        { header: 'Name', dataIndex: 'name', flex: 1 }
	    ],
	    height: 200,
	    width: 400,
	    selModel : new Ext.selection.RowModel({
        	singleSelect : true,
        	listeners : {
        		select : {
        			fn : function(rmodel,record,index,options){
        				Ext.Msg.alert('MetaObject', record.data.id+","+record.data);
        			}
        		}
        	}
        })
	});
	
	var metamodeleditor = Ext.create('Ext.panel.Panel',
		{
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
	  	  	  	     	    	alert('You clicked the button!');
	  	  	  	     	    	metaobjects.push(new MetaObject(metaobject_IdGenerator.getNewId(), ''));
	  	  	  	     	    }
  	  	  	           },
  	  	  	           {
  	  	  	        	   xtype: 'button',
  	  	  	        	   text: 'update',
	  	  	  	     	    handler: function() {
	  	  	  	     	    	alert('You clicked the button!')
	  	  	  	     	    }

  	  	  	           },
		  	 		{
		  	  	  	   title: 'Tool',
		  	  	  	   layout: {
		  	  	  		   type: 'vbox',
		  	  	  		   align: 'center'
		  	  	  	   },
		  	  	  	   items: [
		  	  	  	           {
		  	  	  	        	   xtype: 'button',
		  	  	  	        	   text: 'add',
			  	  	  	     	    handler: function() {
			  	  	  	     	    	alert('You clicked the button!')
			  	  	  	     	    }
		  	  	  	           },
		  	  	  	           {
		  	  	  	        	   xtype: 'button',
		  	  	  	        	   text: 'update',
			  	  	  	     	    handler: function() {
			  	  	  	     	    	alert('You clicked the button!')
			  	  	  	     	    }

		  	  	  	           }
		  	  	  	           ]
		  	  		}
		  	           ],
		  	 		closable: 'true'
	});
	
	var tab = editor_tabs.add(metamodeleditor);
	editor_tabs.setActiveTab(tab);
}

function MetaRelationEditor(metarelations) {
	var l_metaobjs = [];
	for(var i=0;i < metarelations.length;i++) {
		if(metarelations[i] != null) l_metaobjs.push(metarelations[i]);
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
	    title: 'Simpsons',
	    store: Ext.data.StoreManager.lookup('simpsonsStore'),
	    columns: [
	        { header: 'Id',  dataIndex: 'id' },
	        { header: 'Name', dataIndex: 'name', flex: 1 }
	    ],
	    height: 200,
	    width: 400,
	    selModel : new Ext.selection.RowModel({
        	singleSelect : true,
        	listeners : {
        		select : {
        			fn : function(rmodel,record,index,options){
        				Ext.Msg.alert('MetaObject', record.data.id+","+record.data);
        			}
        		}
        	}
        })
	});
	
	var metamodeleditor = Ext.create('Ext.panel.Panel',
		{
		  	   title: 'MetaRelation',
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
	  	  	  	     	    	alert('You clicked the button!');
	  	  	  	     	    	metarelations.push(new MetaRelation(metarelation_IdGenerator.getNewId(), ''));
	  	  	  	     	    }
  	  	  	           },
  	  	  	           {
  	  	  	        	   xtype: 'button',
  	  	  	        	   text: 'update',
	  	  	  	     	    handler: function() {
	  	  	  	     	    	alert('You clicked the button!')
	  	  	  	     	    }

  	  	  	           },
		  	 		{
		  	  	  	   title: 'Tool',
		  	  	  	   layout: {
		  	  	  		   type: 'vbox',
		  	  	  		   align: 'center'
		  	  	  	   },
		  	  	  	   items: [
		  	  	  	           ]
		  	  		}
		  	           ],
		  	 		closable: 'true'
	});
	
	var tab = editor_tabs.add(metamodeleditor);
	editor_tabs.setActiveTab(tab);
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
		  	        						g_metamodel = eval('('+newValue+')');
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

/**
 * Save MetaModel
 * グローバル変数g_metamodelの内容をサーバに保存する。
 */
function saveMetaModel(id, fn) {
	var xml = JSON.stringify(g_metamodel);
	$.post('/msave', { id : id, xml : xml }, fn, "json");
}


MetaJSONEditor.prototype.getPanel = function() {
	return this.editor;
}

MetaJSONEditor.prototype.Initialize = function() {
}

MetaJSONEditor.prototype.onActivate = function() {
	current_editor = this;
}

function TempConfigEditor() {
	var self = this;
	var editor = Ext.create('Ext.panel.Panel',
		{
		  	   title: 'TemplateConfig',
		  	   layout: {
		  		   type: 'hbox',
		  		   align: 'center'
		  	   },
		  	   items: [
		  	           {
		  	        	   xtype: 'textarea',
	  	        		   width: Ext.getCmp('centerpanel').getWidth(),
	  	        		   height: Ext.getCmp('centerpanel').getHeight(),
		  	        		   value: g_config_of_template,
		  	        		   listeners: {
		  	        			   change: {
		  	        				   fn: function(field, newValue, oldValue, opt) {
		  	        					   editor.setTitle('TemplateConfig*');
		  	        					   g_config_of_template = newValue;
		  	        				   }
		  	        			   }
		  	        		   }
		  	           }
		  	           ],
		  	 		closable: 'true'
	});
	this.editor = editor;
}

TempConfigEditor.prototype.save = function() {
	var self = this;
	$.post('/tcsave', { id : g_metamodel_id, tc : g_config_of_template },
			function(data) {
				if(data) {
					self.editor.setTitle('TemplateConfig');
				}
			}, "json");
}

TempConfigEditor.prototype.getPanel = function() {
	return this.editor;
}

TempConfigEditor.prototype.Initialize = function() {
}

TempConfigEditor.prototype.onActivate = function() {
	current_editor = this;
}

function TemplateEditor(template) {
	this.template = template;
	this.resource = template;
	var self = this;
	this.panel = Ext.create('Ext.panel.Panel',
		{
		  	   title: template.name,
		  	   layout: {
		  		   type: 'hbox',
		  		   align: 'center'
		  	   },
		  	   items: [
		  	           {
		  	        	   xtype: 'textarea',
		  	        	   autoScroll: true,
		  	        		   width: Ext.getCmp('centerpanel').getWidth() - 40,
		  	        		   height: Ext.getCmp('centerpanel').getHeight() - 40,
		  	        		   value: template.content,
		  	        		   listeners: {
		  	        			   change: {
		  	        				   fn: function(field, newValue, oldValue, opt) {
		  	        					 template.content = newValue;
		  	        					 self.panel.setTitle(template.name + '*');
		  	        				   }
		  	        			   }
		  	        		   }
		  	           }
		  	           ],
		  	 		closable: 'true'
	});
}

TemplateEditor.prototype.save = function() {
	var self = this;
	Ext.MessageBox.show({title: 'Please wait',msg: 'Loading...',progressText: 'Initializing...',width:300,progress:true,closable:false,animEl: 'mb6'});
	$.post('/template/save', { id : g_metamodel_id, fname : this.template.name , content : this.template.content},
			function(data) {
				if(data) {
					self.panel.setTitle(self.template.name);
					Ext.MessageBox.hide();
				}
			}, "json");
}

TemplateEditor.prototype.getPanel = function() {
	return this.panel;
}

TemplateEditor.prototype.Initialize = function() {
}

TemplateEditor.prototype.onActivate = function() {
	current_editor = this;
	current_resource = this.resource;
}

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
	  	        		   width: Ext.getCmp('centerpanel').getWidth(),
	  	        		   height: Ext.getCmp('centerpanel').getHeight(),
		  	        		   value: JSON.stringify(g_metamodel),
		  	        		   listeners: {
		  	        			   change: {
		  	        				   fn: function(field, newValue, oldValue, opt) {
		  	        						g_metamodel = eval('('+newValue+')');
		  	        						console.log('change');
		  	        				   }
		  	        			   }
		  	        		   }
		  	           }
		  	           ],
		  	 		closable: 'true'
	});
	var tab = editor_tabs.add(editor);
	tab.on('activate', function(){
		current_editor = self;
	});
	editor_tabs.setActiveTab(tab);
}

MetaJSONEditor.prototype.save = function() {
	saveMetaModel(g_metamodel_id);
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
		  	        					   g_config_of_template = newValue;
		  	        				   }
		  	        			   }
		  	        		   }
		  	           }
		  	           ],
		  	 		closable: 'true'
	});
	var tab = editor_tabs.add(editor);
	tab.on('activate', function(){
		current_editor = self;
	});
	editor_tabs.setActiveTab(tab);
}

TempConfigEditor.prototype.save = function() {
	$.post('/tcsave', { id : g_metamodel_id, tc : g_config_of_template },
			function(data) {
				if(data) {
					
				}
			}, "json");
}

function TemplateEditor(template) {
	this.template = template;
	var self = this;
	var editor = Ext.create('Ext.panel.Panel',
		{
		  	   title: template.name,
		  	   layout: {
		  		   type: 'hbox',
		  		   align: 'center'
		  	   },
		  	   items: [
		  	           {
		  	        	   xtype: 'textarea',
		  	        		   width: Ext.getCmp('centerpanel').getWidth(),
		  	        		   height: Ext.getCmp('centerpanel').getHeight(),
		  	        		   value: template.content,
		  	        		   listeners: {
		  	        			   change: {
		  	        				   fn: function(field, newValue, oldValue, opt) {
		  	        					 template.content = newValue;
		  	        				   }
		  	        			   }
		  	        		   }
		  	           }
		  	           ],
		  	 		closable: 'true'
	});
	var tab = editor_tabs.add(editor);
	tab.on('activate', function(){
		current_editor = self;
		current_resource = template;
	});
	editor_tabs.setActiveTab(tab);
}

TemplateEditor.prototype.save = function() {
	$.post('/template/save', { id : g_metamodel_id, fname : this.template.name , content : this.template.content},
			function(data) {
				if(data) {
					
				}
			}, "json");
}
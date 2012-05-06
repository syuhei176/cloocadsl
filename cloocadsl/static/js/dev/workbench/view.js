function MetaDiagramsEditor(metaobjects) {
	var l_metaobjs = [];
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
	    title: 'MetaDiagrams',
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
		  	   title: 'MetaDiagrams',
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
	  	  	  	     	    	metaobjects.push(new MetaDiagram(metaobject_IdGenerator.getNewId(), ''));
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

function MetaObjectsEditor(metaobjects) {
	var l_metaobjs = [];
	for(var i=0;i < metaobjects.length;i++) {
		if(metaobjects[i] != null) l_metaobjs.push(metaobjects[i]);
	}
	Ext.create('Ext.data.Store', {
	    storeId:'simpsonsStore',
	    fields:['id', 'name', 'graphic'],
	    data:{'items':l_metaobjs},
	    proxy: {
	        type: 'memory',
	        reader: {
	            type: 'json',
	            root: 'items'
	        }
	    }
	});
	
	var grid = Ext.create('Ext.grid.Panel', {
	    title: 'MetaObjects',
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
	  	  	  	     	    	metaobjects.push(new MetaObject(metaobject_IdGenerator.getNewId(), ''));
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
	  	  	  	     	    	metarelations.push(new MetaRelation(metaobject_IdGenerator.getNewId(), ''));
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
	var style = '"width:'+(Ext.getCmp('centerpanel').getWidth() - 40)+'px;height:'+(Ext.getCmp('centerpanel').getHeight())+'px;"'
	this.panel = Ext.create('Ext.panel.Panel',
		{
		  	   title: template.name,
		  	   layout: {
		  		   type: 'hbox',
		  		   align: 'center'
		  	   },
		  	   items: [{
		  		   html: '<textarea id="templatetextarea_'+template.name+'" style='+style+'>'+template.content+'</textarea>'}
/*		  	           {
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
		  	           }*/
		  	           ],
		  	 		closable: 'true'
	});
}

TemplateEditor.prototype.save = function() {
	var self = this;
	Ext.MessageBox.show({title: 'Please wait',msg: 'Loading...',progressText: 'Initializing...',width:300,progress:true,closable:false,animEl: 'mb6'});
	this.template.content = this.template.content.replace(/\t/g, "  ");
	$.post('/template/save', { id : g_metamodel_id, fname : this.template.name , content : this.template.content},
			function(data) {
				if(data) {
					self.panel.setTitle(self.template.name);
				}
				Ext.MessageBox.hide();
			}, "json");
}

TemplateEditor.prototype.getPanel = function() {
	return this.panel;
}

TemplateEditor.prototype.Initialize = function() {
	var self = this;
	var textarea = document.getElementById('templatetextarea_'+this.template.name);
	var myCodeMirror = CodeMirror.fromTextArea(textarea, {lineNumbers:true, onChange:function(editor, arg) {
			 self.template.content = editor.getValue();
				 self.panel.setTitle(self.template.name + '*');
			   }});
}

TemplateEditor.prototype.onActivate = function() {
	current_editor = this;
	current_resource = this.resource;
}

function WellcomeMessageEditor() {
	this.resource = g_metaproject.welcome_message;
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
		  	        		   value: g_metaproject.welcome_message,
		  	        		   listeners: {
		  	        			   change: {
		  	        				   fn: function(field, newValue, oldValue, opt) {
		  	        					 g_metaproject.welcome_message = newValue;
		  	        						editor.setTitle('JSONEditor*')
		  	        				   }
		  	        			   }
		  	        		   }
		  	           }
		  	           ],
		  	 		closable: 'true'
	});
	this.editor = editor;
}

WellcomeMessageEditor.prototype.save = function() {
	var self = this;
	saveAll(g_metamodel_id, function(data){
		if(data) {
			self.editor.setTitle('JSONEditor');
		}
	});
}

WellcomeMessageEditor.prototype.getPanel = function() {
	return this.editor;
}

WellcomeMessageEditor.prototype.Initialize = function() {
}

WellcomeMessageEditor.prototype.onActivate = function() {
	current_editor = this;
}
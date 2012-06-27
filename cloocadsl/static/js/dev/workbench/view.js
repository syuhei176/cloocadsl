function TempConfigEditor() {
	var self = this;
	
	Ext.create('Ext.data.Store', {
	    storeId:'targets',
	    fields:['name','downloadable','runnable','deploy','mapping'],
	    data:{'items':g_wbconfig.targets},
	    proxy: {
	        type: 'memory',
	        reader: { type: 'json', root: 'items' }
	    }
	});
	
	var grid = Ext.create('Ext.grid.Panel', {
	    title: 'targets',
	    store: Ext.data.StoreManager.lookup('targets'),
	    columns: [
	        { header: 'Name', dataIndex: 'name', flex: 1 },
	        { header: 'download', dataIndex: 'downloadable', flex: 1 },
	        { header: 'run', dataIndex: 'runnable', flex: 1 },
	        { header: 'deploy', dataIndex: 'deploy', flex: 1 }
	    ],
		width: Ext.getCmp('centerpanel').getWidth() - 50,
		height: Ext.getCmp('centerpanel').getHeight() - 200,
    	listeners : {
    		itemdblclick : {
    			fn : function(rmodel,record,item,index,event,options){
    				self.show_setting_mappings_window(g_wbconfig.targets[index]/*record.data*/);
    			}
    		}
    	}
	});
	if(g_wbconfig.editor == undefined) {
		g_wbconfig.editor = {};
	}
	var grideditor = Ext.create('Ext.panel.Panel', {
		  	   title: 'grid',
		  	   width: Ext.getCmp('centerpanel').getWidth() - 50,
		  	   height: Ext.getCmp('centerpanel').getHeight() - 50,
		  	   layout: {
		  		   type: 'vbox',
		  		   align: 'center'
		  	   },
		  	   items: [grid,
		  	           {
			    	xtype: 'checkbox',
			        fieldLabel: 'generate',
			    	checked: g_wbconfig.editor.generatable,
		            listeners:{
		            	scope: this,
		                'change': function(field, newValue, oldValue, opt){
		                	g_wbconfig.editor.generatable = newValue;
		                	self.texteditor.setValue(JSON.stringify(g_wbconfig));
		                }
		            }
		  	   },{
			    	xtype: 'checkbox',
			        fieldLabel: 'download',
			        checked: g_wbconfig.editor.downloadable,
		            listeners:{
		            	scope: this,
		                'change': function(field, newValue, oldValue, opt){
		                	g_wbconfig.editor.downloadable = newValue;
		                	self.texteditor.setValue(JSON.stringify(g_wbconfig));
		                }
		            }
		  	   }
		  	           ]
	});
	this.texteditor = Ext.create('Ext.form.field.TextArea', {
			title: 'json',
			autoScroll: true,
			width: Ext.getCmp('centerpanel').getWidth(),
			height: Ext.getCmp('centerpanel').getHeight(),
     		   value: JSON.stringify(g_wbconfig),
     		   listeners: {
     			   change: {
     				   fn: function(field, newValue, oldValue, opt) {
     					   g_wbconfig = JSON.parse(newValue);
     						self.editor.setTitle('WBConfig*')
     				   }
     			   }
     		   }
        });
	var tabpanel = Ext.create('Ext.tab.Panel', {
		title: 'WBConfig',
		tabPosition: 'bottom',
        defaults :{
            bodyPadding: 6
        },
	    items: [grideditor,this.texteditor],
	    closable: 'true'
	});
	this.editor = tabpanel;
}

TempConfigEditor.prototype.show_setting_mapping_window = function(mapping, mappings, fn) {
	var self = this;
	var _is_diagram = true;
	if(mapping.type == 'template_diagram') {
		_is_diagram = false;
	}else{
		_is_diagram = true;
	}
	var type_states = Ext.create('Ext.data.Store', {
	    fields: ['disp','type'],
	    data : [
	        {"disp":"テンプレート","type":"template"},
	        {"disp":"テンプレート（ダイアグラム）","type":"template_diagram"},
	        {"disp":"コピー","type":"copy"}
	    ]
	});

	var win = Ext.create('Ext.window.Window', {
	    title: 'mapping',
	    height: 240,
	    width: 360,
	    layout: 'vbox',
	    items: [{
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
	                	if(mapping.type == 'template_diagram') {
	                	}else{
	                	}
	                }
		    }
	    },{
	    	xtype: 'textfield',
	        fieldLabel: 'src',
	    	value: mapping.src,
            listeners:{
            	scope: this,
                'change': function(field, newValue, oldValue, opt){
                	mapping.src = newValue;
                	self.texteditor.setValue(JSON.stringify(g_wbconfig));
                }
           }
	    },{
	    	xtype: 'textfield',
	        fieldLabel: 'dest',
	    	value: mapping.dest,
            listeners:{
            	scope: this,
                'change': function(field, newValue, oldValue, opt){
                	mapping.dest = newValue;
                	self.texteditor.setValue(JSON.stringify(g_wbconfig));
                }
           }
	    },{
	    	hidden: _is_diagram,
	    	xtype: 'numberfield',
	        fieldLabel: 'diagram',
	    	value: mapping.diagram,
            listeners:{
            	scope: this,
                'change': function(field, newValue, oldValue, opt){
                	mapping.diagram = newValue;
                	self.texteditor.setValue(JSON.stringify(g_wbconfig));
                }
           }
	    },{
	    	xtype: 'button',
	        text: 'OK',
	        handler: function() {
	        	win.hide();
	        	if(fn!=null) {
	        		fn(mapping.type, mapping.src, mapping.dest);
	        	}
            	self.texteditor.setValue(JSON.stringify(g_wbconfig));
	        }
	    }]
	});
	win.show();
}

TempConfigEditor.prototype.show_setting_mappings_window = function(target) {
	var self = this;
	var win = null;
	
	var grid = Ext.create('Ext.grid.Panel', {
        border: false,
        columns: [
                  {text: "type", dataIndex: 'type'},
                  {text: "src", dataIndex: 'src'},
                  {text: "dest", dataIndex: 'dest'}
        ],
        store: Ext.create('Ext.data.Store', {data:target.mapping,fields:['type','src','dest']}),
        sm: Ext.create('Ext.selection.RowModel', {
            singleSelect:true
        }),
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
    	    width: 480,
            items: [{
                text:'add',
                tooltip:'add',
                iconCls:'add',
                handler : function() {
                	self.show_setting_mapping_window({}, target.mapping, function(type,src,dest){
                    	var m = {type:type,src:src,dest:dest};
                    	var i = target.mapping.length;
                    	target.mapping.push(m);
                        grid.getStore().insert(i,m);
                    	self.texteditor.setValue(JSON.stringify(g_wbconfig));
                	});
                }
            },{
                text:'update',
                tooltip:'update',
                iconCls:'add',
                handler : function() {
                	var index =  grid.getSelectionModel().getSelection()[0].index;
                	if(index == undefined) {
                		alert("コンフィグを開きなおしてください。");
                	}else{
                    	self.show_setting_mapping_window(target.mapping[index], target.mapping, function(type,src,dest){
                    		grid.getStore().getAt(index).set('type', type);
                    		grid.getStore().getAt(index).set('src', src);
                    		grid.getStore().getAt(index).set('dest', dest);
                    	});
                	}
                }
            },{
                text:'delete',
                tooltip:'delete',
                iconCls:'add',
                handler : function() {
                	var record = grid.getSelectionModel().getSelection()[0];
                	var index = record.index;
                	if(index == undefined) {
                		alert("コンフィグを開きなおしてください。");
                	}else{
                    	alert(''+target.mapping[index].type+','+target.mapping[index].src+',');
                		target.mapping.splice(index, 1);
                    	grid.getStore().remove(record);
                    	self.texteditor.setValue(JSON.stringify(g_wbconfig));
                	}
                }
            },{
		    	xtype: 'checkbox',
		        fieldLabel: 'download',
		        checked: target.downloadable,
		        listeners:{
		        	scope: this,
		            'change': function(field, newValue, oldValue, opt){
		            	target.downloadable = newValue;
		            }
		        }
		       },{
		        	xtype: 'checkbox',
		            fieldLabel: 'runnable',
		            checked: target.runnable,
		            listeners:{
		            	scope: this,
		                'change': function(field, newValue, oldValue, opt){
		                	target.runnable = newValue;
		                }
		            }
		       },{
		        	xtype: 'checkbox',
		            fieldLabel: 'deploy',
		            checked: target.deploy,
		            listeners:{
		            	scope: this,
		                'change': function(field, newValue, oldValue, opt){
		                	target.deploy = newValue;
		                }
		            }
		       }]
        }]
     });
	
	var win = Ext.create('Ext.window.Window', {
	    title: 'target',
	    height: 240,
	    width: 480,
	    layout: 'fit',
	    items: [grid]
	});
	win.show();
}

TempConfigEditor.prototype.save = function() {
	var self = this;
	$.post('/tcsave', { id : g_metaproject.id, tc : JSON.stringify(g_wbconfig) },
			function(data) {
				if(data) {
					self.editor.setTitle('WBConfig');
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
		  	   items: [{html: '<textarea id="templatetextarea_'+template.name+'" style='+style+'>'+template.content+'</textarea>'}],
		  	 		closable: 'true'
	});
}

TemplateEditor.prototype.save = function() {
	var self = this;
	Ext.MessageBox.show({title: 'Please wait',msg: 'Loading...',progressText: 'Initializing...',width:300,progress:true,closable:false,animEl: 'mb6'});
	this.template.content = this.template.content.replace(/\t/g, "  ");
	$.post('/template/save', { id : g_metaproject.id, fname : this.template.name , target : this.template.path, content : this.template.content},
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
	textarea.parentNode.style.backgroundColor = '#EEC';
	textarea.parentNode.style.color = '#000';
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
		  	   title: 'welcomemessage',
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
		  	        						editor.setTitle('welcomemessage*')
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
	$.post('/welsave', { id : g_metaproject.id, welcome_message:g_metaproject.welcome_message },
			function(data) {
				if(data) {
					self.editor.setTitle('welcomemessage');
				}
			}, "json");
}

WellcomeMessageEditor.prototype.getPanel = function() {
	return this.editor;
}

WellcomeMessageEditor.prototype.Initialize = function() {
}

WellcomeMessageEditor.prototype.onActivate = function() {
	current_editor = this;
}
/**
 * 
 * @param option : editor option
 * @returns
 */
function CloocaWorkbench(option) {
	/*
	 * jarty カスタマイズ 
	 */
	Jarty.Function.file = function(runtime, option) {
		runtime.write("<file name="+option.name + " >");
	}
	Jarty.Function.fileClose = function(runtime) {
		runtime.write("</file>");
	}
	/*
	 * end of jarty カスタマイズ 
	 */

	this.option = option;
	this.editorTabPanel = new EditorTabPanel();
	this.editorTabPanel_preview = new EditorTabPanel();
	this.editorTabPanel_template = new EditorTabPanel();
	this.editorTabPanel_template_preview = new EditorTabPanel();
	this.init_layout();
	this.menupanel = new MenuPanel(this);
	this.menupanel.setAvailabledRedo(false);
	this.statuspanel = new SouthTabPanel(this);
	
	this.metaDatacontroller = new MetaDataController();
	this.metaDatacontroller.load();
	this.metaPackageExplorer = new MetaPackageExplorer(this.metaDatacontroller, this);
	
	this.templateController = new TemplateController();
	this.templateExplorer = new TemplateExplorer(this.templateController, this);
	
	this.vcs = new VersionControllSystem(this);
	
	var self = this;
	
	this.toolCompiler = new ToolCompiler(self.metaDatacontroller.getMetaModel());
	/*
	 * メタモデルが更新されるたびに呼ばれる
	 */
	this.metaDatacontroller.on('change', function(mmc, package){
		//preview
//		var toolCompiler = new ToolCompiler(self.metaDatacontroller.getMetaModel());
		if(self.toolCompiler.Compile()) {
			self.modelController.setCtool(self.toolCompiler.getCompiledTool());
			self.modelExplorer = new ModelExplorer(self.modelController, self, self.toolCompiler.getCompiledTool(), self.editorTabPanel_preview);
		}
	});
	this.toolCompiler.Compile();
	this.modelController = new ModelController(this.toolCompiler.getCompiledTool());
	this.modelExplorer = new ModelExplorer(this.modelController, this, this.toolCompiler.getCompiledTool(), self.editorTabPanel_preview);
	
	/*
	 * テンプレートが更新されるたびに呼ばれる
	 */
	this.templateController.on('change', function(name, newValue){
		self.modelCompile(newValue);
	});
}

CloocaWorkbench.prototype.getPropertyPanel = function() {
	return this.statuspanel;
}

CloocaWorkbench.prototype.save = function() {
	if(this.editorTabPanel.current_editor) {
		this.editorTabPanel.current_editor.save();
	}
	if(this.editorTabPanel_template.current_editor) {
		this.editorTabPanel_template.current_editor.save();
	}
}

CloocaWorkbench.prototype.saveAll = function() {
	this.metaDatacontroller.save();
	this.templateController.saveModified()
}


CloocaWorkbench.prototype.modelCompile = function(template) {
	var model = this.modelController.getCompiledModel();
	console.log(model);
	var result = null;
	var error = '';
	try {
		result = (Jarty.eval(template, copy(model)));
		result = result.replace(/</g,'&lt;');
		result = result.replace(/>/g,'&gt;');
	}catch(e){
		error = e.message;
	}
	Ext.getCmp('template-preview').removeAll();
	Ext.getCmp('template-preview').add({
		title : 'preview',
		autoScroll : true,
		html : '<div style="color:red;">'+error+'</div><br><pre><code>'+result+'</code></pre>'
	});
	function copy(a) {
	    var F = function(){};
	    F.prototype = a;
	    return new F;
	}
}

CloocaWorkbench.prototype.init_layout = function() {
	var self = this;
	new Ext.Viewport({
		layout:'border',
		items:[{	//north
			id:'menupanel',
			margins:'0 3 0 3',
			region:'north'
				},{	//center(accordion)
		    	   id:'centerpanel',
		    	   region:'center',
		    	   layout : 'accordion',
		    	   items : [{	//metamodel(border)
		    		   		title : 'MetaModel',
		    		   		layout : 'border',
		    		   		defaults: {
		    		   		    collapsible: true,
		    		   		    split: true,
		    		   		    bodyStyle: 'padding:1px'
		    		   		},
		    		   		items : [{	//metamodel explorer
		     		    	   id:'package-explorer',
		    		    	   title:'Package Explorer',
		    		   			region:'west',
		    		   		    margins: '5 0 0 0',cmargins: '5 5 0 0',
	    		   			    width: 200,minSize: 100,maxSize: 220
		    		   		},{			//metamodel editor
		    		   			id:'metamodel-centerpanel',
		    		   			region:'center',
		    		   		    collapsible: false,
		    		   		    split: false,
	    		   			    items : [this.editorTabPanel.getPanel()],
	    		   			    listeners : {
	    		   			    	resize : function(panel, adjWidth, adjHeight, eOpts) {
	    		   			    		console.log(adjWidth, adjHeight);
	    		   			    		self.editorTabPanel.fireResizeEvent(adjWidth, adjHeight);
	    		   			    	}
	    		   			    }
		    		   		},{			//metamodel preview
		    		   			title : 'Preview',
		    		   			region:'east',
		    		   		    margins: '5 0 0 0',cmargins: '5 5 0 0',
	    		   			    width: 400,minSize: 200,maxSize: 600,
                                autoScroll : true,
                                scroll : 'horizontal',
                                items : [{
                                	width: 800,
                                    layout: 'hbox',
                                	items : [
			    		    		   {
			    		    			   id : 'model-explorer',
			    		    			   title : 'ModelExplorer'
			    		    		   },
			    		    		   this.editorTabPanel_preview.getPanel()]
                                }]
		    		   		}]
				    	   },{	//template(border)
				    		   title : 'Template',
				    		   layout : 'border',
				    		   items : [{	//explorer
			    		    	   id:'template-explorer',
				    			   region:'west',
			    		    	   title:'Template Explorer',
			    		   		    collapsible: true,
			    		   		    split: true,
			    		   		    width : 240,
				    		   },{			//editor
				    			   region:'center',
			    		    	   layout : 'hbox',
			    		    	   items : [this.editorTabPanel_template.getPanel()]
				    		   },{			//preview
				    			   title : 'Preview',
				    			   region:'east',
			    		   		    collapsible: true,
			    		   		    split: true,
				    			   xtype : 'tabpanel',
	    		    			   id : 'template-preview',
	    		    			   width : 320,
	    		    				tabPosition: 'top',
	    		    		        defaults :{
	    		    		            bodyPadding: 6,
	    		    		            closable: false,
	    		    		        },
	    		    			    items: []
				    		   }]
				    	   }]
		       },{	//south
		    	   id:'south-panel',
//		    	   title:'south',
		    	   region:'south',
		    	   margins:'0 3 0 3',
		    	   split:false
		       }]
	});
}


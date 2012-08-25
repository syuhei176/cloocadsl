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
		runtime.write("/* start file "+option.name + " */");
	}
	Jarty.Function.fileClose = function(runtime) {
		runtime.write("/* end file */");
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
	
	/*
	this.easyExplorer_dev = new EasyExplorer(this.metaDatacontroller, this);
	this.notationController = new NotationController();
	this.notationExplorer = new NotationExplorer(this.notationController, this);
	*/
	
	this.vcs = new VersionControllSystem(this);
	
	var self = this;
	
	/*
	 * メタモデルが更新されるたびに呼ばれる
	 */
	this.metaDatacontroller.addChangeListener(function(){
		//preview
		var toolCompiler = new ToolCompiler(self.metaDatacontroller.getMetaModel());
		toolCompiler.Compile();
		self.modelController.setCtool(toolCompiler.getCompiledTool());
		self.modelExplorer = new ModelExplorer(self.modelController, null, toolCompiler.getCompiledTool());
	});
	var toolCompiler = new ToolCompiler(self.metaDatacontroller.getMetaModel());
	toolCompiler.Compile();
	this.modelController = new ModelController(toolCompiler.getCompiledTool());
	this.modelExplorer = new ModelExplorer(this.modelController, this, toolCompiler.getCompiledTool());
	
	this.templateController.on('change', function(name, newValue){
		self.modelCompile(newValue);
	});

}

CloocaWorkbench.prototype.modelCompile = function(template) {
	var model = this.modelController.getModel();
	var result = (Jarty.eval(template, copy(model)));
	Ext.getCmp('template-preview').removeAll();
	Ext.getCmp('template-preview').add({
		title : 'preview',
		html : result
	});
	function copy(a) {
	    var F = function(){};
	    F.prototype = a;
	    return new F;
	}
}

CloocaWorkbench.prototype.init_layout = function() {
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
		    		   		    bodyStyle: 'padding:15px'
		    		   		},
		    		   		items : [{	//metamodel explorer
		     		    	   id:'package-explorer',
		    		    	   title:'Package Explorer',
		    		   			region:'west',
		    		   		    margins: '5 0 0 0',cmargins: '5 5 0 0',
	    		   			    width: 120,minSize: 100,maxSize: 140
		    		   		},{			//metamodel editor
		    		   			region:'center',
		    		   		    collapsible: false,
		    		   		    split: false,
	    		   			    items : [this.editorTabPanel.getPanel()]
		    		   		},{			//metamodel preview
		    		   			region:'east',
		    		   		    margins: '5 0 0 0',cmargins: '5 5 0 0',
	    		   			    width: 300,minSize: 200,maxSize: 350,
                                layout: 'hbox',
                                items : [
			    		    		   {
			    		    			   id : 'model-explorer',
			    		    			   title : 'ModelExplorer'
			    		    		   },
			    		    		   this.editorTabPanel_preview.getPanel()
			    		    	   ]
		    		   		}]
				    	   },{	//template(border)
				    		   title : 'Template',
				    		   layout : 'border',
				    		   items : [{	//explorer
			    		    	   id:'template-explorer',
				    			   region:'west',
			    		    	   title:'Template Explorer',
			    		   		    collapsible: true,
			    		   		    split: true
				    		   },{			//editor
				    			   region:'center',
			    		    	   layout : 'hbox',
			    		    	   items : [this.editorTabPanel_template.getPanel()]
				    		   },{			//preview
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
		    	   region:'south',
		    	   margins:'0 3 0 3',
		    	   split:true
		       }]
	});
}


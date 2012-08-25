/**
 * 
 * @param option : editor option
 * @returns
 */
function CloocaWorkbench(option) {
	this.option = option;
	this.editorTabPanel = new EditorTabPanel();
	this.editorTabPanel_preview = new EditorTabPanel();
	this.init_layout();
	this.menupanel = new MenuPanel(this);
	this.menupanel.setAvailabledRedo(false);
	this.statuspanel = new SouthTabPanel(this);
	
	this.metaDatacontroller = new MetaDataController();
	this.metaDatacontroller.load();
	this.metaPackageExplorer = new MetaPackageExplorer(this.metaDatacontroller, this);
	
	this.easyExplorer_dev = new EasyExplorer(this.metaDatacontroller, this);
	
	this.templateController = new TemplateController();
	this.templateExplorer = new TemplateExplorer(this.templateController, this);
	
	this.notationController = new NotationController();
	this.notationExplorer = new NotationExplorer(this.notationController, this);
	
	this.vcs = new VersionControllSystem(this);
	
	var self = this;
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
}

CloocaWorkbench.prototype.init_layout = function() {
	new Ext.Viewport({
		layout:'border',
		items:[
		       new Ext.Panel({
		    	   id: 'centerpanel',
		    	   html:'',
		    	   width:'100px',
		    	   region:'center',
		    	   /*
		    	   layout: 'fit',
		    	   items : [this.editorTabPanel.getPanel()]
		    	   */
		    	   autoScroll : true,
		    	   layout:'accordion',
		    	   defaults: {
		    	        bodyStyle: 'padding:15px'
		    	   },
		    	   layoutConfig: {
		    	        titleCollapse: false,
		    	        animate: true,
		    	        activeOnTop: true
		    	   },
		    	   items: [{
    		    	   title:'Package Explorer',
    		    	   html:' ',
    		    	   layout : 'hbox',
    		    	   items : [
    		    		   this.editorTabPanel.getPanel(),
    		    		   {
    		    			   id : 'model-explorer',
    		    			   title : 'ModelExplorer'
    		    		   },
    		    		   this.editorTabPanel_preview.getPanel()
    		    	   ]
		    	   },{
    		    	   title:'Template Explorer',
    		    	   html:' '
		    	   }]
		       }),
		       new Ext.Panel({
		    	   id:'menupanel',
		    	   margins:'0 3 0 3',
		    	   region:'north',
		    	   items: []
		       }),
		       new Ext.Panel({
		    	   id:'south-panel',
		    	   margins:'0 3 0 3',
		    	   region:'south',
		    	   split:true,
		    	   items: []
		    	   }),
		       new Ext.Panel({
		     	   id:'east-panel',
		    	   html:'toolbuttons'
		       }),
		       new Ext.Panel({
		    	   id:'west-panel',
		    	   html:' ',
		    	   margins:'0 0 0 3',
		    	   region:'west',
		    	   width: 280,
		    	   height: 300,
		    	   collapsible:true,
		    	   split:true,
		    	   layout:'accordion',
		    	   defaults: {
		    	        bodyStyle: 'padding:15px'
		    	   },
		    	   layoutConfig: {
		    	        titleCollapse: false,
		    	        animate: true,
		    	        activeOnTop: true
		    	   },
		    	   items: [{
    		    	   id:'package-explorer',
    		    	   title:'Package Explorer',
    		    	   html:' '
		    	   },{
    		    	   id:'template-explorer',
    		    	   title:'Template Explorer',
    		    	   html:' '
		    	   },{
    		    	   id:'notation-explorer',
    		    	   title:'Notation Explorer',
    		    	   html:' '
		    	   },{
    		    	   id:'tool-explorer',
    		    	   title:'Tool Explorer',
    		    	   html:' '
		    	   },{
    		    	   id:'easy-explorer',
    		    	   title:'clooca Workbench',
    		    	   html:' '
		    	   }]
		       }),
		       ]
	});
}

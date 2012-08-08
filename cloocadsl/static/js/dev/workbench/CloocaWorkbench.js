/**
 * 
 * @param option : editor option
 * @returns
 */
function CloocaWorkbench(option) {
	this.option = option;
	this.editorTabPanel = new EditorTabPanel();
	this.init_layout();
	this.menupanel = new MenuPanel(this);
	this.menupanel.setAvailabledRedo(false);
	this.statuspanel = new StatusPanel(this);
	
	this.metaDatacontroller = new MetaDataController();
	this.metaDatacontroller.load();
	this.metaPackageExplorer = new MetaPackageExplorer(this.metaDatacontroller, this);
	
	this.easyExplorer_dev = new EasyExplorer(this.metaDatacontroller, this);
	
	this.templateController = new TemplateController();
	this.templateExplorer = new TemplateExplorer(this.templateController, this);
	
	this.notationController = new NotationController();
	this.notationExplorer = new NotationExplorer(this.notationController, this);
	
	this.vcs = new VersionControllSystem(this);
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
		    	   layout: 'fit',
		    	   items : [this.editorTabPanel.getPanel()]
		       }),
		       new Ext.Panel({
		    	   id:'menupanel',
		    	   margins:'0 3 0 3',
		    	   region:'north',
		    	   items: []
		       }),
		       new Ext.Panel({
		    	   id:'status-panel',
		    	   margins:'0 3 0 3',
		    	   region:'south',
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
		    	   width: 220,
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

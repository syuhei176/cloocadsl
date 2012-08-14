/**
 * 
 * @param option : editor option
 * @returns
 */
function CloocaEditor(option) {
	this.option = option;
	this.editorTabPanel = new EditorTabPanel();
	this.init_layout();
	this.menupanel = new MenuPanel(this);
	this.menupanel.setAvailabledRedo(false);
}

CloocaEditor.prototype.init_layout = function() {
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
		    	   id:'propertypanel',
		    	   title: 'property',
		    	   html:'',
		    	   margins:'3 3 3 3',
		    	   region:'south',
		    	   collapsible:true,
		    	   split:true,
		    	   items : []
		    	   }),
		       new Ext.Panel({
		     	   id:'toolpanel',
		    	   title:'Tool',
		    	   html:'toolbuttons',
		    	   margins:'0 3 0 3',
		    	   region:'east',
		    	   collapsible:true,
		    	   split:true,
    		       layout: {
    		    	    type: 'vbox',
    		    	    align : 'stretch',
    		    	    pack  : 'start'
    		    	},
    		    	items: [
    		    	    {html:'panel 1', flex:1},
    		    	    {html:'panel 3', flex:2}
    		    	]
		       }),
		       new Ext.Panel({
		    	   id:'modelexplorer',
		    	   title:'Model Explorer',
		    	   html:' ',
		    	   margins:'0 0 0 3',
		    	   region:'west',
		    	   collapsible:true,
		    	   split:true,
		    	   items: []
		       }),
		       ]
	});
}

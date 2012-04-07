function MetaModelEditor(metaobjects) {
	Ext.create('Ext.data.Store', {
	    storeId:'simpsonsStore',
	    fields:['id', 'name'],
	    data:{
	    	'items':metaobjects
	    },
	    proxy: {
	        type: 'memory',
	        reader: {
	            type: 'json',
	            root: 'items'
	        }
	    }
	});
	
//	var grid = Ext.grid.GridPanel({
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
	Ext.create('Ext.data.Store', {
	    storeId:'simpsonsStore',
	    fields:['id', 'name'],
	    data:{
	    	'items':metarelations
	    },
	    proxy: {
	        type: 'memory',
	        reader: {
	            type: 'json',
	            root: 'items'
	        }
	    }
	});
	
//	var grid = Ext.grid.GridPanel({
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
	var metamodeleditor = Ext.create('Ext.panel.Panel',
		{
		  	   title: 'JSONEditor',
		  	   layout: {
		  		   type: 'hbox',
		  		   align: 'center'
		  	   },
		  	   items: [
		  	           {
		  	        	   xtype: 'textarea',
		  	        		   width: 240,
		  	        		   height: 240,
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
	/*
	metamodeleditor.addListener('change', function(field, newValue, oldValue, opt){
		metadiagram = eval('('+newValue+')');
		console.log('change');
	})
	*/
	var tab = editor_tabs.add(metamodeleditor);
	editor_tabs.setActiveTab(tab);
}
function HistoryView(history_data) {
	Ext.create('Ext.data.Store', {
	    storeId:'simpsonsStore',
	    fields:['id', 'name'],
	    data:{
	    	'items':history_data.verlist
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
	
//	var tab = editor_tabs.add(metamodeleditor);
//	editor_tabs.setActiveTab(tab);
}

function ProjectInfoViewer() {
	var html = 'ID:' + g_project_id + '<br>NAME:' + g_projectinfo.name + '<br>REPOSITORY:' + g_projectinfo.rep_id
	this.panel = Ext.create('Ext.panel.Panel',
			{
			  	   title: 'プロジェクト情報',
			  	   html: html,
			  	   closable: 'true'
			}
	);

}

ProjectInfoViewer.prototype.getPanel = function() {
	return this.panel;
}

ProjectInfoViewer.prototype.Initialize = function() {
	
}

ProjectInfoViewer.prototype.onActivate = function() {
	
}

function WelcomeMessageView() {
	var html = g_projectinfo.metamodel.welcome_message;
	this.panel = Ext.create('Ext.panel.Panel',
			{
			  	   title: 'ウェルカム',
			  	   html: html,
			  	   closable: 'true'
			}
	);

}

WelcomeMessageView.prototype.getPanel = function() {
	return this.panel;
}

WelcomeMessageView.prototype.Initialize = function() {
	
}

WelcomeMessageView.prototype.onActivate = function() {
	
}

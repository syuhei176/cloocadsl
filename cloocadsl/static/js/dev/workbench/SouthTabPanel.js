function SouthTabPanel(wb) {
	var self = this;
	this.wb = wb;
	
	var error_panel = Ext.create('Ext.panel.Panel', {
			xtype: 'panel',
			title: 'Error',
			layout: {
				type: 'hbox',
				align: 'center'
			},
			items: []
		});
	
	var property_panel = Ext.create('Ext.panel.Panel', {
			id: 'property-panel',
			xtype: 'panel',
			title: 'Property',
			/*
			layout: {
				type: 'vbox',
				align: 'left'
			},
			*/
			items: []
	});
	
	var tabpanel = Ext.create('Ext.tab.Panel', {
//		title: name,
		tabPosition: 'top',
        defaults :{
            bodyPadding: 6,
    	    closable: true
        },
	    items: [property_panel, error_panel],
	    closable: false
	});
	
	/*
	 * 積極的にレンダリングする
	 */
	Ext.getCmp('south-panel').add(tabpanel);
	return {
		getPanel : function() {
			return tabpanel;
		},
		setPropertyPanel : function(props) {
			var property_panel = Ext.getCmp('property-panel');
			property_panel.removeAll();
			for(var i=0;i < props.length;i++) {
				property_panel.add(props[i]);
			}
		}
	}
}

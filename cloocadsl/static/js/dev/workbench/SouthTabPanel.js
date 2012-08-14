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
			height: 180,
			layout: {
				type: 'vbox',
				align: 'left'
			},
			items: []
	});
	
	var tabpanel = Ext.create('Ext.tab.Panel', {
		title: name,
		tabPosition: 'top',
        defaults :{
            bodyPadding: 6,
    	    closable: true
        },
	    items: [error_panel, property_panel],
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
		setPropertyPanel : function(p) {
			var property_panel = Ext.getCmp('property-panel');
			property_panel.removeAll();
			property_panel.add(p);
		}
	}
}

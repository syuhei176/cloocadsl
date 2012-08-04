function StatusPanel(wb) {
	var self = this;
	this.wb = wb;
	
	this.error_win = Ext.create('Ext.window.Window', {
	    title: 'エラー',
	    height: 200,
	    width: 400,
	    layout: 'fit',
	    closable: true,
	    items: {  // Let's put an empty grid in just to illustrate fit layout
	        xtype: 'grid',
	        border: false,
	        columns: [{header: 'error'}],                 // One header just for show. There's no data,
	        store: Ext.create('Ext.data.ArrayStore', {}) // A dummy empty data store
	    }
	});
	this.version_win = Ext.create('Ext.window.Window', {
	    title: 'バージョン　リスト',
	    height: 200,
	    width: 400,
	    layout: 'fit',
	    closable: true,
	    items: {  // Let's put an empty grid in just to illustrate fit layout
	        xtype: 'grid',
	        border: false,
	        columns: [{header: 'verion'}],                 // One header just for show. There's no data,
	        store: Ext.create('Ext.data.ArrayStore', {}) // A dummy empty data store
	    }
	});
	this.share_win = Ext.create('Ext.window.Window', {
	    title: 'シェア　リスト',
	    height: 200,
	    width: 400,
	    layout: 'fit',
	    closable: true,
	    items: {  // Let's put an empty grid in just to illustrate fit layout
	        xtype: 'grid',
	        border: false,
	        columns: [{header: 'user'}],                 // One header just for show. There's no data,
	        store: Ext.create('Ext.data.ArrayStore', {}) // A dummy empty data store
	    }
	});
	
	this.terminal_win = Ext.create('Ext.window.Window', {
	    title: 'terminal',
	    height: 240,
	    width: 400,
	    closable: false,
	    html: '<div id="terminal"></div>'
	});
	
	this.terminal_win.show();
	this.terminal_win.hide();
	/*
    $('#terminal').terminal(function(command, term) {
        if (command !== '') {
        	if(command) {
        		if(command == 'add') {
                    term.echo('add [option]');
        		}else if(command == 'refresh') {
        			term.echo('refresh');
        		}else if(command == 'check') {
        			term.echo('check');
        		}else{
                    term.error('command not found');
        		}
        	}
        } else {
           term.echo('');
        }
    }, {
        greetings: 'workbench cui',
        name: 'wb-cui',
        height: 200,
        prompt: 'wb>'});
    */
	
	this.panel = {
        tbar: [{
        	id: 'status-bar',
        	html: '編集中'
        },'-',{
            id: 'error-status',
            text: '×',
            iconCls: 'add16',
        	handler : onItemClick,
            menu: [{
            	text: 'error1'
            },{
            	text: 'error2'
            }]
        },{
            id: 'version-status',
            text: 'V',
            iconCls: 'add16',
        	handler : onItemClick
        },{
            id: 'share-status',
            text: 'S',
            iconCls: 'add16',
        	handler : onItemClick
        },{
            id: 'terminal',
            text: 'T',
            iconCls: 'add16',
        	handler : onItemClick
        }]
    };
	function　onItemClick(item) {
		var pushed_win = null;
		var pushed_win_id = null;
		if(item.id == 'error-status') {
			pushed_win = self.error_win;
		}else if(item.id == 'version-status') {
			pushed_win = self.version_win;
		}else if(item.id == 'share-status') {
			pushed_win = self.share_win;
		}else if(item.id == 'terminal') {
			pushed_win = self.terminal_win;
		}
		if(pushed_win.isHidden()) {
			pushed_win.show();
			Ext.getCmp(item.id).setText('[V]');
		}else{
			pushed_win.hide();
			Ext.getCmp(item.id).setText('V');
		}
	}
	/*
	 * 積極的にレンダリングする
	 */
	Ext.getCmp('status-panel').add(this.panel);
}

StatusPanel.prototype.getPanel = function() {
	return this.panel;
}

StatusPanel.prototype.setStatus = function(status) {
	Ext.getCmp('status-bar').setText(status);
}
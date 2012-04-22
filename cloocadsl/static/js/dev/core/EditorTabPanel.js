function EditorTabPanel() {
	this.editors = [];
	this.current_editor = null;
	this.listeners = [];
	var self = this;
	this.tabpanel = Ext.create('Ext.tab.Panel', {
        defaults :{
            bodyPadding: 6,
            closable: 'true',
        },
	    items: [
	        {
	            title: 'Welcome',
	            html : 'Welcome to the clooca DSL.<br><br>test',
	            closable: 'true'
	        }
	        ],
	});
}

EditorTabPanel.prototype.getPanel = function() {
	return this.tabpanel;
}

EditorTabPanel.prototype.on = function(event, fn) {
	this.listeners.push({event:event, fn:fn});
}

EditorTabPanel.prototype.fireSelectTab = function() {
	for(var i=0;i < this.listeners.length;i++) {
		this.listeners[i].fn();
	}
}


EditorTabPanel.prototype.add = function(editor, key) {
	var self = this;
	for(var i=0;i < this.editors.length;i++) {
		if(this.editors[i].editor.key == key) {
			this.tabpanel.setActiveTab(this.editors[i].tab);
			return;
		}
	}
	var tab = this.tabpanel.add(editor.getPanel());
	this.editors.push({ editor : editor, tab : tab });
	tab.on('activate', function(){
		self.current_editor = editor;
		editor.onActivate();
	});
	tab.on('close', function(){
//		self.current_editor = null;
		for(var i=0;i < self.editors.length;i++) {
			if(self.editors[i].tab == tab) self.editors.splice(i, 1);
		}
	});
	this.tabpanel.setActiveTab(tab);
	editor.Initialize();
}

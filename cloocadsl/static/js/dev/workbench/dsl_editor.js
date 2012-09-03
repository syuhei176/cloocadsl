function DSLEditor(key, name, metaDataController) {
	this.key = key;
	this.name = name;
	this.metaDataController = metaDataController;
	this.panel = Ext.create('Ext.panel.Panel', {
		id: 'dsleditor-'+this.key,
		title: name,
		layout : 'fit',
		width : Ext.getCmp('metamodel-centerpanel').getWidth() - 10,
		height : Ext.getCmp('metamodel-centerpanel').getHeight() - 50,
		html : '<textarea id="dsleditor-textarea-'+this.key+'" style="font-size:32pt;">' + this.metaDataController.get(this.key).content + '</textarea>',
		autoScroll: true,
		closable: true
	});
}

DSLEditor.prototype.save = function() {
	this.metaDataController.save();
}

DSLEditor.prototype.getPanel = function() {
	return this.panel;
}

DSLEditor.prototype.Initialize = function() {
	var self = this;
	console.log(this.key);
	var textarea = document.getElementById('dsleditor-textarea-'+this.key);
	textarea.parentNode.style.backgroundColor = '#FFF';
	textarea.parentNode.style.color = '#000';
	var myCodeMirror = CodeMirror.fromTextArea(textarea, { mode:"dsl", lineNumbers:true, onChange:function(editor, arg) {
				p = self.metaDataController.get(self.key);
				p.content = editor.getValue();
				self.metaDataController.setOP_updated(p);
				self.panel.setTitle(self.name + '*');
				/*
				 * compile(p.content);
				 * dsl定義構文のパース→メタパッケージエクスプローラにクラスを表示
				 */
			 }
	});
}

DSLEditor.prototype.onActivate = function() {
	
}

DSLEditor.prototype.onDeactivate = function() {
	
}

DSLEditor.prototype.onResize = function(w, h) {
	this.panel.setWidth(w - 10);
	this.panel.setHeight(h - 50);
}

function DSMLEditor(key, name, pkg, metaModelController) {
	this.key = key;
	this.name = name;
	this.pkg = pkg;
	this.metaModelController = metaModelController;
	this.panel = Ext.create('Ext.panel.Panel', {
		id: 'dsleditor-'+this.key,
		title: name,
		layout : 'fit',
		width : Ext.getCmp('metamodel-centerpanel').getWidth() - 10,
		height : Ext.getCmp('metamodel-centerpanel').getHeight() - 50,
		html : '<textarea id="dsleditor-textarea-'+this.key+'" style="font-size:18pt;">' + this.pkg.content.text + '</textarea>',
		autoScroll: true,
		closable: true
	});
	this.codemirror = null;
}

DSMLEditor.prototype.save = function() {
	this.metaModelController.save();
}

DSMLEditor.prototype.getPanel = function() {
	return this.panel;
}

DSMLEditor.prototype.Initialize = function() {
	var self = this;
	console.log(this.key);
	var textarea = document.getElementById('dsleditor-textarea-'+this.key);
	textarea.parentNode.style.backgroundColor = '#FFF';
	textarea.parentNode.style.color = '#000';
	var myCodeMirror = CodeMirror.fromTextArea(textarea, { mode:"dsl", lineNumbers:true, onChange:function(editor, arg) {
				self.metaModelController.update(self.pkg.parent_uri + '.' + self.pkg.name, 'text',editor.getValue());
				//p = self.metaDataController.get(self.key);
				//p.content = editor.getValue();
				//self.metaDataController.setOP_updated(p);
				self.panel.setTitle(self.name + '*');
				/*
				 * compile(p.content);
				 * dsl定義構文のパース→メタパッケージエクスプローラにクラスを表示
				 */
			 }
	});
	console.log(myCodeMirror);
	this.codemirror = myCodeMirror;
}

DSMLEditor.prototype.onActivate = function() {
	
}

DSMLEditor.prototype.onDeactivate = function() {
	
}

DSMLEditor.prototype.onResize = function(w, h) {
	this.panel.setWidth(w - 10);
	this.panel.setHeight(h - 50);
}

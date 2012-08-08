function DSLEditor(key, name, metaDataController) {
	this.key = key;
	this.metaDataController = metaDataController;
	this.panel = Ext.create('Ext.panel.Panel', {
		id: 'dsleditor-'+this.key,
		title: name,
		autoScroll: true,
		html : '<textarea id="dsleditor-textarea-'+this.key+'" style="font-size:32pt;">' + this.metaDataController.get(this.key).content + '</textarea>',
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
				p = self.metaDataController.getPackage(self.key);
				p.content = editor.getValue();
				p.modified_after_commit = true;
				self.panel.setTitle(self.template.name + '*');
			 }
	});
}

DSLEditor.prototype.onActivate = function() {
	
}

DSLEditor.prototype.onDeactivate = function() {
	
}

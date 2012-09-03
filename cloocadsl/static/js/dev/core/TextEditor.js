function TextEditor(key, name, elem, modelController, ctool, wb) {
	var self = this;
	this.key = key;
	this.name = name;
	this.elem = elem;
	this.modelController = modelController;
	this.ctool = ctool;
	this.wb = wb;
	this.panel = Ext.create('Ext.panel.Panel', {
		id: 'texteditor-'+self.key,
		title: self.name,
		layout : 'fit',
		width : 480,
		height : Ext.getCmp('centerpanel').getHeight() - 120,
		html : '<textarea id="texteditor-textarea-'+self.key+'" style="font-size:32pt;">' + self.elem.text + '</textarea>',
		autoScroll: true,
		closable: true
	});
}

TextEditor.prototype.save = function() {
	//this.metaDataController.save();
}

TextEditor.prototype.getPanel = function() {
	return this.panel;
}

TextEditor.prototype.Initialize = function() {
	var self = this;
	console.log(this.key);
	var textarea = document.getElementById('texteditor-textarea-'+this.key);
	textarea.parentNode.style.backgroundColor = '#FFF';
	textarea.parentNode.style.color = '#000';
	var myCodeMirror = CodeMirror.fromTextArea(textarea, { mode:"dsl", lineNumbers:true, onChange:function(editor, arg) {
				self.elem.text = editor.getValue();
				self.panel.setTitle(self.name + '*');
			 }
	});
}

TextEditor.prototype.onActivate = function() {
	
}

TextEditor.prototype.onDeactivate = function() {
	
}

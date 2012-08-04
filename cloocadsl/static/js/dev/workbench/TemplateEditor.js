function TemplateEditor(templateController, template) {
	var self = this;
	this.templateController = templateController;
	this.template = template;
	this.resource = template;
	var self = this;
	var style = '"width:'+(Ext.getCmp('centerpanel').getWidth() - 40)+'px;height:'+(Ext.getCmp('centerpanel').getHeight())+'px;"'
	this.panel = Ext.create('Ext.panel.Panel',
		{
		  	   title: template.name,
		  	   layout: {
		  		   type: 'hbox',
		  		   align: 'center'
		  	   },
		  	   items: [{html: '<textarea id="templatetextarea_'+template.name+'" style='+style+'>'+template.content+'</textarea>'}],
		  	 		closable: 'true'
	});
	this.templateController.setChangeNotification(this.template.name, function(newValue) {
		var textarea = document.getElementById('templatetextarea_'+self.template.name);
		textarea.value = newValue;
	});
}

TemplateEditor.prototype.save = function() {
	this.templateController.save(this.template.name, this.template.package_uri, this.template.content);
}

TemplateEditor.prototype.getPanel = function() {
	return this.panel;
}

TemplateEditor.prototype.Initialize = function() {
	var self = this;
	var textarea = document.getElementById('templatetextarea_'+this.template.name);
	textarea.parentNode.style.backgroundColor = '#F0F0E0';
	textarea.parentNode.style.color = '#000';
	var myCodeMirror = CodeMirror.fromTextArea(textarea, { mode : 'mako', lineNumbers:true, onChange:function(editor, arg) {
			 self.template.content = editor.getValue();
			 self.panel.setTitle(self.template.name + '*');
			 }
	});
}

TemplateEditor.prototype.onActivate = function() {
//	current_editor = this;
//	current_resource = this.resource;
}

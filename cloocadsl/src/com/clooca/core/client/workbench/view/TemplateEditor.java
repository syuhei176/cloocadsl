package com.clooca.core.client.workbench.view;

import com.clooca.core.client.view.AbstractEditor;
import com.google.gwt.user.client.ui.ScrollPanel;
import com.google.gwt.user.client.ui.TextArea;

public class TemplateEditor extends AbstractEditor {
	
	ScrollPanel panel = new ScrollPanel();
	
	public TemplateEditor() {
		TextArea textArea = new TextArea();
		textArea.setWidth("480px");
		textArea.setHeight("600px");
		textArea.setText("");
		panel.add(textArea);
		this.initEditor(panel, "template","template");
	}
}

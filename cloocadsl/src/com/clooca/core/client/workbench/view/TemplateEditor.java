package com.clooca.core.client.workbench.view;

import com.clooca.core.client.model.Template;
import com.clooca.core.client.view.AbstractEditor;
import com.clooca.core.client.workbench.presenter.TemplateController;
import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ChangeHandler;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.ScrollPanel;
import com.google.gwt.user.client.ui.TabPanel;
import com.google.gwt.user.client.ui.TextArea;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.user.client.ui.Widget;

public class TemplateEditor extends AbstractEditor {
	
	ScrollPanel panel = new ScrollPanel();
	
	public TemplateEditor(final TemplateController controller) {
		final TextArea textArea = new TextArea();
		textArea.setWidth("400px");
		textArea.setHeight("120px");
		textArea.setText(controller.getMetamodel().getGen_property());
		VerticalPanel vpanel = new VerticalPanel();
		VerticalPanel buttonPanel = new VerticalPanel();
		HorizontalPanel hpanel = new HorizontalPanel();
		hpanel.add(textArea);
		hpanel.add(buttonPanel);
		vpanel.add(hpanel);
		panel.add(vpanel);
		textArea.addChangeHandler(new ChangeHandler(){

			@Override
			public void onChange(ChangeEvent event) {
				controller.getMetamodel().gen_property = textArea.getText();
			}});
		
		TabPanel tabPanel = new TabPanel();
		for(Template temp : controller.getTemplates()) {
			tabPanel.add(createPanel(temp), temp.name);
		}
		vpanel.add(tabPanel);
		initEditor(panel, "template","template");
	}
	
	private Widget createPanel(final Template temp) {
		VerticalPanel vpanel = new VerticalPanel();
		final TextBox name = new TextBox();
		final TextArea content = new TextArea();
		content.setWidth("400px");
		content.setHeight("200px");
		name.setText(temp.name);
		content.setText(temp.content);
		name.addChangeHandler(new ChangeHandler(){

			@Override
			public void onChange(ChangeEvent event) {
				temp.name = name.getText();
			}});
		name.addChangeHandler(new ChangeHandler(){

			@Override
			public void onChange(ChangeEvent event) {
				temp.content = content.getText();
			}});
		vpanel.add(name);
		vpanel.add(content);
		return vpanel;
	}
}

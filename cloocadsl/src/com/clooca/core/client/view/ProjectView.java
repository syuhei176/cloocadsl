package com.clooca.core.client.view;

import com.clooca.core.client.presenter.DiagramController;
import com.clooca.core.client.presenter.ModelController;
import com.clooca.core.client.presenter.ProjectController;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DockPanel;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.user.client.ui.Widget;

public class ProjectView {
	VerticalPanel mainpanel = new VerticalPanel();
	ProjectController mProjectController;
	
	public ProjectView(ProjectController pc) {
		mProjectController = pc;
		Button open_button = new Button("save");
		Button o_button = new Button("open");
		Button m_button = new Button("meta open");
		Button meta_save_button = new Button("meta save");
		mainpanel.add(open_button);
		mainpanel.add(o_button);
		mainpanel.add(m_button);
		mainpanel.add(meta_save_button);
		open_button.addClickHandler(new ClickHandler(){

			@Override
			public void onClick(ClickEvent event) {
				mProjectController.save();
			}});
		o_button.addClickHandler(new ClickHandler(){

			@Override
			public void onClick(ClickEvent event) {
				DiagramController dc = new DiagramController(mProjectController.getProjectInfo().model.getRootDiagram());
				
				dc.addListeners(PropertyView.GetElementSelectionListener());
				EditorTabView.CreateNewTab("Sample", new DiagramEditor(dc));
			}});
		m_button.addClickHandler(new ClickHandler(){

			@Override
			public void onClick(ClickEvent event) {
				mProjectController.mMetaModelController.addListeners(PropertyView.GetElementSelectionListener());

				EditorTabView.CreateNewTab("Sample", new MetaModelEditor(mProjectController.mMetaModelController));
			}});
		meta_save_button.addClickHandler(new ClickHandler(){

			@Override
			public void onClick(ClickEvent event) {
				mProjectController.saveMetaModel();
			}});
	}
	
	public Widget getWidget() {
		return mainpanel;
	}
}

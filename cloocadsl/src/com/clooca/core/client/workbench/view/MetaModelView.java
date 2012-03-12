package com.clooca.core.client.workbench.view;

import com.clooca.core.client.model.gopr.element.Diagram;
import com.clooca.core.client.model.gopr.element.Model;
import com.clooca.core.client.presenter.DiagramController;
import com.clooca.core.client.presenter.MetaModelController;
import com.clooca.core.client.presenter.ModelController;
import com.clooca.core.client.presenter.ProjectController;
import com.clooca.core.client.view.DiagramEditor;
import com.clooca.core.client.view.EditorTabView;
import com.clooca.core.client.view.MetaModelEditor;
import com.clooca.core.client.view.PropertyView;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DockPanel;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.user.client.ui.Widget;

public class MetaModelView {
	VerticalPanel mainpanel = new VerticalPanel();
	MetaModelController mMetaModelController;
	
	public MetaModelView(MetaModelController mc) {
		mMetaModelController = mc;
		Button o_button = new Button("preview");
		Button m_button = new Button("meta open");
		Button meta_save_button = new Button("meta save");
		mainpanel.add(o_button);
		mainpanel.add(m_button);
		mainpanel.add(meta_save_button);
		o_button.addClickHandler(new ClickHandler(){

			@Override
			public void onClick(ClickEvent event) {
				mMetaModelController.compile();
				Model model = new Model();
				model.id = 1;
				model.root = new Diagram();
				model.root.id = 2;
				model.root.meta = mMetaModelController.getMetaModel().meta_diagram;
				DiagramController dc = new DiagramController(model.getRootDiagram());
				
				dc.addListeners(PropertyView.GetElementSelectionListener());
				EditorTabView.CreateNewTab("Preview", new DiagramEditor(dc));
			}});
		m_button.addClickHandler(new ClickHandler(){

			@Override
			public void onClick(ClickEvent event) {
				mMetaModelController.addListeners(PropertyView.GetElementSelectionListener());

				EditorTabView.CreateNewTab("Sample", new MetaModelEditor(mMetaModelController));
			}});
		meta_save_button.addClickHandler(new ClickHandler(){

			@Override
			public void onClick(ClickEvent event) {
				mMetaModelController.saveRequest(mMetaModelController.getMetaModel().id);
//				mProjectController.saveMetaModel();
			}});
	}
	
	public Widget getWidget() {
		return mainpanel;
	}
}

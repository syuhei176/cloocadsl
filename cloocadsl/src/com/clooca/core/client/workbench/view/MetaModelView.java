package com.clooca.core.client.workbench.view;

import com.clooca.core.client.model.gopr.element.Diagram;
import com.clooca.core.client.model.gopr.element.Model;
import com.clooca.core.client.presenter.DiagramController;
import com.clooca.core.client.view.DiagramEditor;
import com.clooca.core.client.view.EditorTabView;
import com.clooca.core.client.view.PropertyView;
import com.clooca.core.client.workbench.presenter.TemplateController;
import com.clooca.core.client.workbench.presenter.WorkbenchController;
import com.clooca.core.client.workbench.presenter.WorkbenchController.LoadedListener;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.user.client.ui.Widget;

public class MetaModelView {
	VerticalPanel mainpanel = new VerticalPanel();
	WorkbenchController mWorkbenchController;
	TemplateController mTemplateController;
	
	public MetaModelView(WorkbenchController mc) {
		mWorkbenchController = mc;
		mWorkbenchController.addLoadListener(new LoadedListener(){

			@Override
			public void onLoaded() {
				if(mTemplateController == null) mTemplateController = new TemplateController(mWorkbenchController.getMetaModel());
			}});
		
		Button o_button = new Button("preview");
		Button m_button = new Button(" open ");
		Button me_button = new Button(" open2");
		Button prop_button = new Button(" prop ");
		Button meta_save_button = new Button(" save ");
		mainpanel.add(o_button);
		mainpanel.add(m_button);
		mainpanel.add(me_button);
		mainpanel.add(prop_button);
		mainpanel.add(meta_save_button);
		o_button.addClickHandler(new ClickHandler(){

			@Override
			public void onClick(ClickEvent event) {
				mWorkbenchController.compile();
				Model model = new Model();
				model.id = 1;
				model.root = new Diagram();
				model.root.id = 2;
				model.root.meta = mWorkbenchController.getMetaModel().meta_diagram;
				DiagramController dc = new DiagramController(model.getRootDiagram());
				
				dc.addListeners(PropertyView.GetElementSelectionListener());
				EditorTabView.CreateNewTab("Preview", new DiagramEditor(dc));
			}});
		m_button.addClickHandler(new ClickHandler(){

			@Override
			public void onClick(ClickEvent event) {
				mWorkbenchController.addListeners(PropertyView.GetElementSelectionListener());

				EditorTabView.CreateNewTab("MetaModel", new MetaModelEditor(mWorkbenchController));
			}});
		me_button.addClickHandler(new ClickHandler(){

			@Override
			public void onClick(ClickEvent event) {
				EditorTabView.CreateNewTab("MetaModel", new MetaElementEditor(mWorkbenchController));
			}});
		prop_button.addClickHandler(new ClickHandler(){

			@Override
			public void onClick(ClickEvent event) {
				EditorTabView.CreateNewTab("MetaModel", new TemplateEditor(mTemplateController));
			}});
		meta_save_button.addClickHandler(new ClickHandler(){

			@Override
			public void onClick(ClickEvent event) {
				mWorkbenchController.saveRequest(mWorkbenchController.getMetaModel().id);
//				mProjectController.saveMetaModel();
			}});
	}
	
	public Widget getWidget() {
		return mainpanel;
	}
}

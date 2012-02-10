package com.clooca.testeditor.client.framework.gui;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.logical.shared.ResizeEvent;
import com.google.gwt.event.logical.shared.ResizeHandler;
import com.google.gwt.storage.client.Storage;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DockPanel;
import com.google.gwt.user.client.ui.RootLayoutPanel;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.clooca.core.client.gopr.element.Diagram;
import com.clooca.core.client.gopr.metamodel.MetaDiagram;
import com.clooca.core.client.gopr.metamodel.MetaModel;
import com.clooca.core.client.gui.*;
import com.clooca.core.client.model.LoginInfo;

public class ModelEditor {
	 
	static public ToolPanel mToolPanel;
	 
//	static private MenuPanel mMenuPanel;
	 
//	static public StatusTabPanel mStatusPanel;
	
//	static public DiagramExplorer mDiagramExplorer;	
	
	/*
	 * Main Panel
	 */
	static DockPanel EditorPanel = new DockPanel();
	
	private LoginInfo loginInfo;
		
	public LoginInfo getLoginInfo() {
		return loginInfo;
	}

	public void setLoginInfo(LoginInfo li) {
		loginInfo = li;
	}
	
	Diagram diagram;
	
	public void print() {
		GWT.log("diagram " + diagram.getNodeObjects().size());
	}
	
	public ModelEditor() {
		final MetaModel metamodel = new MetaModel();
//		metamodel.createSample();
//		diagram = (Diagram)metamodel.getMetaDiagram().getInstance();

		EditorPanel.setPixelSize(Window.getClientWidth(), Window.getClientHeight());
	    Window.addResizeHandler(new ResizeHandler() {
	        public void onResize(ResizeEvent ev) {
	    		EditorPanel.setPixelSize(ev.getWidth(), ev.getHeight());
	        }
	    });
		EditorPanel.setBorderWidth(1);
		EditorPanel.setStyleName("editor-dock-panel");
		
		mToolPanel = new ToolPanel();
		new EditorTabPanel();
		EditorTabPanel.addListener(PropertyPanel.GetDiagramSelectionListener());
		EditorTabPanel.addListener(mToolPanel);
		
		EditorPanel.add(PropertyPanel.getpanel(), DockPanel.SOUTH);
		EditorPanel.setCellHeight(PropertyPanel.getpanel(), "150px");
		
		EditorPanel.add(mToolPanel.getPanel(), DockPanel.EAST);
		EditorPanel.setCellWidth(mToolPanel.getPanel(), "32px");
		
		VerticalPanel vpanel = new VerticalPanel();
		Button open_button = new Button("MetaModel");
		Button update_button = new Button("Preview");
		vpanel.add(open_button);
		vpanel.add(update_button);
		EditorPanel.add(vpanel, DockPanel.WEST);
		EditorPanel.setCellWidth(vpanel, "100px");
		open_button.addClickHandler(new ClickHandler(){

			@Override
			public void onClick(ClickEvent event) {
	    		EditorTabPanel.CreateNewTab("Sample", new mdlCanvas("Sample", "Sample", mToolPanel, (Diagram)metamodel.getMetaDiagram().getInstance()));
			}});
		update_button.addClickHandler(new ClickHandler(){

			@Override
			public void onClick(ClickEvent event) {
				print();
				MetaModel metamodel2 = new MetaModel();
				MetaDiagram metadiagram = metamodel2.getMetaDiagram();
				metadiagram.UpdateMetaModel(diagram);
	    		EditorTabPanel.CreateNewTab("Sample2", new mdlCanvas("Sample2", "Sample2", mToolPanel, (Diagram)metadiagram.getInstance()));
			}});
		
		EditorPanel.add(EditorTabPanel.getPanel(), DockPanel.CENTER);
		
//		EditorTabPanel.CreateNewTab("Sample", new mdlCanvas("Sample", "Sample", this.mToolPanel, diagram));
		
	    RootLayoutPanel rp = RootLayoutPanel.get();
	    rp.clear();
	    rp.add(EditorPanel);
	    
//	    CommonController.SetModelExplorer(mDiagramExplorer);
	}
	
	public void initModel() {
		EditorTabPanel.clear();
//		mDiagramExplorer.Clear();
		Storage session = Storage.getSessionStorageIfSupported();
		String username = "";
        if(session != null){
        	username = session.getItem("username");
        }
	}
			
}

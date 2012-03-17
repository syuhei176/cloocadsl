package com.clooca.workbench.client;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.logical.shared.ResizeEvent;
import com.google.gwt.event.logical.shared.ResizeHandler;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.user.client.History;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.DockPanel;
import com.google.gwt.user.client.ui.RootLayoutPanel;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.clooca.core.client.model.LoginInfo;
import com.clooca.core.client.model.ProjectInfo;
import com.clooca.core.client.model.gopr.element.Diagram;
import com.clooca.core.client.model.gopr.metaelement.MetaDiagram;
import com.clooca.core.client.model.gopr.metaelement.MetaModel;
import com.clooca.core.client.presenter.DiagramController;
import com.clooca.core.client.presenter.ModelController;
import com.clooca.core.client.presenter.ProjectController;
import com.clooca.core.client.presenter.XMLPresenter;
import com.clooca.core.client.view.DiagramEditor;
import com.clooca.core.client.view.EditorTabView;
import com.clooca.core.client.view.ProjectView;
import com.clooca.core.client.view.PropertyView;
import com.clooca.core.client.workbench.presenter.MetaModelController;
import com.clooca.core.client.workbench.view.MetaModelView;
import com.clooca.webutil.client.RequestGenerator;

public class cloocaIDE {
	 
//	static public ToolPanel mToolPanel;
	
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
	
	MetaModelController mMetaModelController;
	
	public cloocaIDE() {

		EditorPanel.setPixelSize(Window.getClientWidth(), Window.getClientHeight());
	    Window.addResizeHandler(new ResizeHandler() {
	        public void onResize(ResizeEvent ev) {
	    		EditorPanel.setPixelSize(ev.getWidth(), ev.getHeight());
	        }
	    });
		EditorPanel.setBorderWidth(1);
		EditorPanel.setStyleName("editor-dock-panel");
		
		new EditorTabView();
//		EditorTabView.addListener(PropertyView.GetDiagramSelectionListener());
		
		mMetaModelController = new MetaModelController();
		
//		MenuPanel mMenuPanel = new MenuPanel(mProjectController);
//		EditorPanel.add(mMenuPanel.getPanel(), DockPanel.NORTH);
//		EditorPanel.setCellWidth(mMenuPanel.getPanel(), "40px");

		EditorPanel.add(PropertyView.getpanel(), DockPanel.SOUTH);
		EditorPanel.setCellHeight(PropertyView.getpanel(), "150px");
		
		
		MetaModelView mModelView = new MetaModelView(mMetaModelController);
		EditorPanel.add(mModelView.getWidget(), DockPanel.WEST);
		EditorPanel.setCellWidth(mModelView.getWidget(), "100px");
		
		VerticalPanel eastPanel = new VerticalPanel();
		EditorPanel.add(eastPanel, DockPanel.EAST);
		EditorPanel.setCellWidth(eastPanel, "30px");
		
		
		EditorPanel.add(EditorTabView.getPanel(), DockPanel.CENTER);
		
//		EditorTabPanel.CreateNewTab("Sample", new mdlCanvas("Sample", "Sample", mToolPanel, diagram));
		
	    RootLayoutPanel rp = RootLayoutPanel.get();
	    rp.clear();
	    rp.add(EditorPanel);
	    
//	    CommonController.SetModelExplorer(mDiagramExplorer);
	    check();
	}
	
	public void initModel() {
		EditorTabView.clear();
//		mDiagramExplorer.Clear();
	}
	
	private void check() {
		final DialogBox db = new DialogBox();
		db.setTitle("読み込み中");
		db.setText("読み込み中");
		db.show();
		db.center();
      	RequestGenerator.send("/cgi-bin/core/checkloggedin.cgi", "", new RequestCallback(){

    		@Override
    		public void onError(Request request,
    				Throwable exception) {
    			db.hide();
    		}

    		@Override
    		public void onResponseReceived(Request request,
    				Response response) {
    			Window.alert(response.getText());
    			JSONObject jsonobj = JSONParser.parseLenient(response.getText()).isObject();
    			if(jsonobj != null) {
    				mMetaModelController.loadRequest(Integer.decode(History.getToken()));
    			}
    			db.hide();
    		}});
	}
			
}

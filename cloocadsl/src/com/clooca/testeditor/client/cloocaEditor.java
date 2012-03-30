package com.clooca.testeditor.client;

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
import com.clooca.core.client.model.UserInfo;
import com.clooca.core.client.model.gopr.element.Diagram;
import com.clooca.core.client.model.gopr.metaelement.MetaDiagram;
import com.clooca.core.client.model.gopr.metaelement.MetaModel;
import com.clooca.core.client.presenter.DiagramController;
import com.clooca.core.client.presenter.ModelController;
import com.clooca.core.client.presenter.ProjectController;
import com.clooca.core.client.view.DiagramEditor;
import com.clooca.core.client.view.EditorTabView;
import com.clooca.core.client.view.ProjectView;
import com.clooca.core.client.view.PropertyView;
import com.clooca.webutil.client.Console;
import com.clooca.webutil.client.RequestGenerator;

/**
 * 
 * @author Syuhei Hiya
 *
 * ProjectInfo
 */
public class cloocaEditor {
	
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
	
	ProjectController mProjectController;
	
	public cloocaEditor() {

		EditorPanel.setPixelSize(Window.getClientWidth(), Window.getClientHeight());
	    Window.addResizeHandler(new ResizeHandler() {
	        public void onResize(ResizeEvent ev) {
	    		EditorPanel.setPixelSize(ev.getWidth(), ev.getHeight());
	        }
	    });
		EditorPanel.setBorderWidth(1);
		EditorPanel.setStyleName("editor-dock-panel");
		
		EditorTabView.init();
		
		EditorPanel.add(PropertyView.getpanel(), DockPanel.SOUTH);
		EditorPanel.setCellHeight(PropertyView.getpanel(), "150px");
		
//		EditorPanel.add(mToolPanel.getPanel(), DockPanel.EAST);
//		EditorPanel.setCellWidth(mToolPanel.getPanel(), "32px");
		
		mProjectController = new ProjectController();
		ProjectView mModelView = new ProjectView(mProjectController);
		EditorPanel.add(mModelView.getWidget(), DockPanel.WEST);
		EditorPanel.setCellWidth(mModelView.getWidget(), "100px");
		
		EditorPanel.add(EditorTabView.getPanel(), DockPanel.CENTER);
		
//		EditorTabPanel.CreateNewTab("Sample", new mdlCanvas("Sample", "Sample", mToolPanel, diagram));
		
	    RootLayoutPanel rp = RootLayoutPanel.get();
	    rp.clear();
	    rp.add(EditorPanel);
	    
		mProjectController.load(Integer.decode(History.getToken()));
//	    check();
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
    			Console.log(response.getText());
    			JSONObject jsonobj = JSONParser.parseLenient(response.getText()).isObject();
    			if(jsonobj != null) {
        			UserInfo userInfo = new UserInfo(jsonobj);
        			ProjectController.setUserInfo(userInfo);
    				mProjectController.load(Integer.decode(History.getToken()));
    			}
    			db.hide();
    		}});
	}

			
}

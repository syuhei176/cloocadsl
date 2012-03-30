package com.clooca.core.client.presenter;

import com.clooca.core.client.model.ProjectInfo;
import com.clooca.core.client.model.UserInfo;
import com.clooca.core.client.workbench.presenter.WorkbenchController;
import com.clooca.core.client.workbench.presenter.WorkbenchController.LoadedListener;
import com.clooca.webutil.client.Console;
import com.clooca.webutil.client.RequestGenerator;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;
import com.google.gwt.http.client.URL;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.DialogBox;

public class ProjectController {
	
	static UserInfo userInfo;
	ProjectInfo projectInfo;
	public ModelController mModelController;
	public WorkbenchController mMetaModelController;
	
	public ProjectController() {
		mModelController = new ModelController();
		mMetaModelController = new WorkbenchController(null);
//		mMetaModelController.create_sample();
	}
	
	static public void setUserInfo(UserInfo _userInfo) {
		userInfo = _userInfo;
	}
	
	static public UserInfo getUserInfo() {
		return userInfo;
	}
	
	public void load(int pid) {
		loadRequest(pid);
	}
	
	public void save() {
		saveRequest(URL.encodeQueryString(XMLPresenter.genModel(projectInfo.model)));
	}
	
	public void saveMetaModel() {
		mMetaModelController.saveRequest(/*this.projectInfo.getMetaModelId()*/1);
	}
	
	public void loadMetaModel() {
		mMetaModelController.loadRequest(this.projectInfo.getMetaModelId());
	}
	
	public void loadMetaModel(int metamodel_id) {
		mMetaModelController.loadRequest(metamodel_id);
	}
	
	public void commit() {
		commit(projectInfo.getId());
	}
	
	public void update() {
		
	}
	
	public void setProjectName() {
		
	}
	
	public void getProjectName() {
		
	}
	
	public ProjectInfo getProjectInfo() {
		return this.projectInfo;
	}
	
	public void generate() {
      	RequestGenerator.send("/gen", "pid="+projectInfo.getId(), new RequestCallback(){

    		@Override
    		public void onError(Request request,
    				Throwable exception) {
    		}

    		@Override
    		public void onResponseReceived(Request request,
    				Response response) {
    			Window.alert(response.getText());
//    			JSONObject jsonObject = JSONParser.parseLenient(response.getText()).isObject();
    		}});
	}
	
	private void saveRequest(String request) {
		final DialogBox db = new DialogBox();
		db.setTitle("読み込み中");
		db.setText("読み込み中");
		db.show();
		db.center();
      	RequestGenerator.send("/psave", "pid="+projectInfo.getId()+"&xml="+request, new RequestCallback(){

    		@Override
    		public void onError(Request request,
    				Throwable exception) {
    			db.hide();
    		}

    		@Override
    		public void onResponseReceived(Request request,
    				Response response) {
    			Console.log(response.getText());
//    			JSONObject jsonObject = JSONParser.parseLenient(response.getText()).isObject();
    			db.hide();
    		}});
    }
	
	private void loadRequest(int pid) {
		final DialogBox db = new DialogBox();
		db.setTitle("読み込み中");
		db.setText("読み込み中");
		db.show();
		db.center();
      	RequestGenerator.send("/pload", "pid="+pid, new RequestCallback(){

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
    			projectInfo = new ProjectInfo(jsonobj);
//    			loadMetaModel(projectInfo.getMetaModelId());
    			mMetaModelController.loadRequest(projectInfo.getMetaModelId(), new LoadedListener(){

					@Override
					public void onLoaded() {
		    			projectInfo.model = XMLPresenter.parse(projectInfo.getXml());
		    			projectInfo.model.id = (int) projectInfo.getId();
					}});
    			db.hide();
    		}});
    }
	
	private void commit(long pid) {
		final DialogBox db = new DialogBox();
		db.setTitle("読み込み中");
		db.setText("読み込み中");
		db.show();
		db.center();
      	RequestGenerator.send("/commit", "pid="+pid, new RequestCallback(){

    		@Override
    		public void onError(Request request,
    				Throwable exception) {
    			db.hide();
    		}

    		@Override
    		public void onResponseReceived(Request request,
    				Response response) {
    			Console.log(response.getText());
    			db.hide();
    		}});
    }

}

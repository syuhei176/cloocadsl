package com.clooca.core.client.workbench.presenter;

import java.util.ArrayList;
import java.util.List;

import com.clooca.core.client.model.Template;
import com.clooca.core.client.model.gopr.metaelement.MetaModel;
import com.clooca.webutil.client.Console;
import com.clooca.webutil.client.RequestGenerator;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONBoolean;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;

public class TemplateController {
	MetaModel metamodel;
	List<Template> templates = new ArrayList<Template>();
	
	public TemplateController(MetaModel metamodel) {
		this.metamodel = metamodel;
		loadTree();
	}
	
	private void loadTree() {
      	RequestGenerator.send("/tree", "id="+metamodel.id, new RequestCallback(){

    		@Override
    		public void onError(Request request,
    				Throwable exception) {
    			Console.log(exception.getMessage());
    		}

    		@Override
    		public void onResponseReceived(Request request,
    				Response response) {
    			Console.log(response.getText());
    			JSONArray jsonArray = JSONParser.parseLenient(response.getText()).isArray();
    			JSONObject jsonObject;
    	        JSONString jsonString;
    	        JSONBoolean jsonBoolean;
    	        JSONNumber jsonNumber;
    	        
    	        templates.clear();
    	        
    	        for(int i=0;i < jsonArray.size();i++) {
    	        	jsonObject = jsonArray.get(i).isObject();
    	        	Template template = new Template();
    				if((jsonString = jsonObject.get("name").isString()) != null) {
    					template.name = jsonString.stringValue();
    				}
    				if((jsonString = jsonObject.get("content").isString()) != null) {
    					template.content = jsonString.stringValue();
    				}
    				templates.add(template);
    	        }
    	        
    		}});
	}
	
	private void save() {
      	RequestGenerator.send("/cgi-bin/core/temp/save.cgi", "id="+metamodel.id, new RequestCallback(){

    		@Override
    		public void onError(Request request,
    				Throwable exception) {
    			Console.log(exception.getMessage());
    		}

    		@Override
    		public void onResponseReceived(Request request,
    				Response response) {
    			Console.log(response.getText());
    			JSONArray jsonArray = JSONParser.parseLenient(response.getText()).isArray();
    			JSONObject jsonObject;
    	        JSONString jsonString;
    	        JSONBoolean jsonBoolean;
    	        JSONNumber jsonNumber;
    	        
    	        templates.clear();
    	        
    	        for(int i=0;i < jsonArray.size();i++) {
    	        	jsonObject = jsonArray.get(i).isObject();
    	        	Template template = new Template();
    				if((jsonString = jsonObject.get("name").isString()) != null) {
    					template.name = jsonString.stringValue();
    				}
    				if((jsonString = jsonObject.get("content").isString()) != null) {
    					template.content = jsonString.stringValue();
    				}
    				templates.add(template);
    	        }
    	        
    		}});
	}


	public MetaModel getMetamodel() {
		return metamodel;
	}

	public List<Template> getTemplates() {
		return templates;
	}

}

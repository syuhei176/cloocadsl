package com.clooca.core.client.gopr.metamodel;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.user.client.Window;
import com.clooca.core.client.gopr.element.Model;
import com.clooca.webutil.client.RequestGenerator;

/**
 * 
 * @author Syuhei Hiya
 * Meta Model Class
 *
 */
public class MetaModel {
	int id;
	String name;
	MetaDiagram meta_diagram;
	
	public MetaModel() {
		meta_diagram = new MetaDiagram(0);
	}
	
	private void setId(int id) {
		this.id = id;
	}
	
	public void createSample() {
		meta_diagram.createSample();
//		meta_diagram.load(0);
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public MetaDiagram getMetaDiagram() {
		return meta_diagram;
	}
	
	public void load(int id) {
      	RequestGenerator.send("/cgi-bin/core/metamodel.cgi", "id="+id, new RequestCallback(){

    		@Override
    		public void onError(Request request,
    				Throwable exception) {
    		}

    		@Override
    		public void onResponseReceived(Request request,
    				Response response) {
    			JSONObject jsonObject = JSONParser.parseLenient(response.getText()).isObject();
    	        JSONString jsonString;
    	        JSONArray jsonArray;
    	        JSONNumber jsonNumber;
    	        
    			if((jsonObject = jsonObject.isObject()) != null) {
    				
    				if((jsonNumber = jsonObject.get("id").isNumber()) != null) {
    					setId((int) (jsonNumber.doubleValue()));
    				}
    				
    				if((jsonString = jsonObject.get("name").isString()) != null) {
    					name = (jsonString.stringValue());
    				}
    				
    				if((jsonObject = jsonObject.get("root").isObject()) != null) {
    					int root_id = (int) jsonObject.get("diagram").isObject().get("id").isNumber().doubleValue();
    					meta_diagram = new MetaDiagram(root_id);
    					meta_diagram.load(jsonObject);
    				}

    			}

    		}});

	}
	
	public Model getInstance() {
		return new Model(this);
	}
	
	public interface LoadModelListener {
		public void load(Model model);
	}
	
	List<LoadModelListener> listeners = new ArrayList<LoadModelListener>();
	
	public void addListener(LoadModelListener l) {
		listeners.add(l);
	}
	
	public void loadModel() {
      	RequestGenerator.send("/cgi-bin/core/load.cgi", "pid="+id, new RequestCallback(){

    		@Override
    		public void onError(Request request,
    				Throwable exception) {
    		}

    		@Override
    		public void onResponseReceived(Request request,
    				Response response) {
    			Window.alert(response.getText());
    			JSONObject jsonObject = JSONParser.parseLenient(response.getText()).isObject();
    			Model model = GetInstance(jsonObject);
    			for(LoadModelListener l : listeners) {
    				l.load(model);
    			}
    		}});
	}
	
	private Model GetInstance(JSONObject json_model) {
		JSONObject jsonObject;
        JSONNumber jsonNumber;
        Model model = new Model(this);

		if((jsonNumber = json_model.get("id").isNumber()) != null) {
			setId((int) jsonNumber.doubleValue());
		}
		
		if((jsonObject = json_model.get("root").isObject()) != null) {
			model.setRootDiagram(getMetaDiagram().GetInstance(jsonObject));
		}
		return model;
	}
	
}

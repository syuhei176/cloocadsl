package com.clooca.core.client.gopprr.metaelement;

import com.clooca.core.client.gopprr.element.ModelElement;
import com.clooca.core.client.gopprr.element.Role;
import com.clooca.webutil.client.RequestGenerator;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;

public class MetaRole extends MetaElement {
	
	String name;
	MetaObject meta_object;
	MetaDiagram parent_diagram;
	
	public MetaRole(int id, String name, MetaObject meta_object) {
		super(id);
		this.name = name;
		this.meta_object = meta_object;
	}
	
	public MetaRole(int id, MetaDiagram parent_diagram) {
		super(id);
		load(id);
		this.parent_diagram = parent_diagram;
	}
	
	public String getName() {
		return name;
	}
	
	public MetaObject getMetaObject() {
		return meta_object;
	}

	@Override
	public ModelElement getInstance() {
		return new Role(this);
	}
	
	public void load(int id) {
      	RequestGenerator.send("/cgi-bin/core/metarole.cgi", "id="+id, new RequestCallback(){

    		@Override
    		public void onError(Request request,
    				Throwable exception) {
    		}

    		@Override
    		public void onResponseReceived(Request request,
    				Response response) {
    			JSONObject jsonObject = JSONParser.parseLenient(response.getText()).isObject();
    	        JSONString jsonString;
    	        JSONNumber jsonNumber;
    	        
    			if((jsonObject = jsonObject.isObject()) != null) {
    				
    				if((jsonString = jsonObject.get("name").isString()) != null) {
    					name = (jsonString.stringValue());
    				}

    				if((jsonNumber = jsonObject.get("metaobj_id").isNumber()) != null) {
    					int metaobj_id = (int) jsonNumber.doubleValue();
    					meta_object = parent_diagram.getMetaObject(metaobj_id);
    				}
    				
    			}

    		}});

	}

}

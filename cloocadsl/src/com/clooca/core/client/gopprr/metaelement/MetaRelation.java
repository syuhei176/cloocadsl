package com.clooca.core.client.gopprr.metaelement;

import com.clooca.core.client.gopprr.element.ModelElement;
import com.clooca.core.client.gopprr.element.Relationship;
import com.clooca.webutil.client.RequestGenerator;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;

public class MetaRelation extends MetaElement {
	
	String name;
	
	public MetaRelation(int id, String name) {
		super(id);
		this.name = name;
	}
	
	public MetaRelation(int id) {
		super(id);
		load(id);
	}
	
	public String getName() {
		return name;
	}
	
	@Override
	public ModelElement getInstance() {
		return new Relationship(this);
	}
	
	public void load(int id) {
      	RequestGenerator.send("./cgi-bin/core/metarelation.cgi", "id="+id, new RequestCallback(){

    		@Override
    		public void onError(Request request,
    				Throwable exception) {
    		}

    		@Override
    		public void onResponseReceived(Request request,
    				Response response) {
    			JSONObject jsonObject = JSONParser.parseLenient(response.getText()).isObject();
    	        JSONString jsonString;
    	        
    			if((jsonObject = jsonObject.isObject()) != null) {
    				
    				if((jsonString = jsonObject.get("name").isString()) != null) {
    					name = (jsonString.stringValue());
    				}
    				
    			}

    		}});

	}
	
}

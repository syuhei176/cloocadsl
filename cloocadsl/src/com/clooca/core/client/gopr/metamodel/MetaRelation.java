package com.clooca.core.client.gopr.metamodel;

import java.util.ArrayList;
import java.util.List;

import com.clooca.core.client.gopr.element.ModelElement;
import com.clooca.core.client.gopr.element.Relationship;
import com.clooca.webutil.client.RequestGenerator;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;

public class MetaRelation extends MetaElement {
	MetaDiagram parent;
	String name;
	List<Binding> bindings;
	List<MetaProperty> properties;
	
	public MetaRelation(int id, String name, List<Binding> bindings, List<MetaProperty> properties) {
		super(id);
		this.name = name;
		this.bindings = bindings;
		this.properties = properties;
	}
	
	public MetaRelation(int id, MetaDiagram parent) {
		super(id);
		this.parent = parent;
		load(id);
	}
	
	public String getName() {
		return name;
	}
	
	@Override
	public ModelElement getInstance() {
		return new Relationship(this);
	}
	
	public List<Binding> getBindings() {
		return bindings;
	}
	
	public List<MetaProperty> getProperties() {
		return properties;
	}
	
	public void load(int id) {
      	RequestGenerator.send("/cgi-bin/core/metarelation.cgi", "id="+id, new RequestCallback(){

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
    				
    				if((jsonString = jsonObject.get("name").isString()) != null) {
    					name = (jsonString.stringValue());
    				}
    				
    				if((jsonArray = jsonObject.get("binding").isArray()) != null) {
    					bindings = new ArrayList<Binding>();
    					for(int i=0;i < jsonArray.size();i++) {
            				if((jsonNumber = jsonArray.get(i).isNumber()) != null) {
            					int binding_id = (int) jsonNumber.doubleValue();
            					bindings.add(parent.getBinding(binding_id));
            				}
    					}
    				}
    				
    			}

    		}});

	}
	
}

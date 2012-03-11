package com.clooca.core.client.model.gopr.metaelement;

import java.util.ArrayList;
import java.util.List;

import com.clooca.core.client.model.gopr.element.ModelElement;
import com.clooca.core.client.model.gopr.element.Relationship;
import com.clooca.core.client.model.gopr.element.VersionElement;
import com.clooca.webutil.client.RequestGenerator;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;

public class MetaRelation {
	MetaDiagram parent;
	public int id;
	public String name;
	public List<Binding> bindings = new ArrayList<Binding>();
	public List<MetaProperty> properties = new ArrayList<MetaProperty>();
	public VersionElement ve = new VersionElement();
	
	public MetaRelation(int id, String name, List<Binding> bindings, List<MetaProperty> properties) {
		this.name = name;
		this.bindings = bindings;
		this.properties = properties;
	}
	
	public MetaRelation() {
		
	}
	
	public String getName() {
		return name;
	}
	
	
	public List<Binding> getBindings() {
		return bindings;
	}
	
	public List<MetaProperty> getProperties() {
		return properties;
	}
	

	
}

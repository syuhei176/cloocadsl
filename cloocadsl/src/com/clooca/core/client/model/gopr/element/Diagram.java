package com.clooca.core.client.model.gopr.element;

import java.util.ArrayList;
import java.util.List;

import com.clooca.core.client.model.gopr.RequestCommands;
import com.clooca.core.client.model.gopr.metaelement.Binding;
import com.clooca.core.client.model.gopr.metaelement.MetaDiagram;
import com.clooca.core.client.model.gopr.metaelement.MetaElement;
import com.clooca.core.client.model.gopr.metaelement.MetaRelation;
import com.clooca.core.client.util.*;
import com.clooca.webutil.client.RequestGenerator;
import com.google.gwt.core.client.GWT;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.user.client.Window;

public class Diagram {
	
	public int id;
	public MetaDiagram meta;
	public List<NodeObject> nodes = new ArrayList<NodeObject>();
	public List<Relationship> relationships = new ArrayList<Relationship>();
//	private ArrayList<GraphModificationListener> listeners = new ArrayList<GraphModificationListener>();
	public VersionElement ve = new VersionElement();
	
	public Diagram() {
		
	}
	
	public int getId() {
		return id;
	}
	/**
	 * 
	 */
	private static final long serialVersionUID = -5741155386373928424L;
	
	public List<NodeObject> getNodeObjects() {
		return nodes;
	}
	
	public List<Relationship> getRelationships() {
		return relationships;
	}
	
}

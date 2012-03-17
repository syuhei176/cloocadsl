package com.clooca.core.client.model.gopr.metaelement;

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
import com.clooca.core.client.model.gopr.element.ModelElement;
import com.clooca.core.client.model.gopr.element.NodeObject;
import com.clooca.core.client.model.gopr.element.VersionElement;
import com.clooca.core.client.util.Point2D;
import com.clooca.core.client.util.Rectangle2D;
import com.clooca.webutil.client.RequestGenerator;

public class MetaObject {
	public int id;
	public String name;
	boolean abstractable;
	public GraphicInfo graphic = new GraphicInfo();
	int tool;
	public List<MetaProperty> properties = new ArrayList<MetaProperty>();
	public VersionElement ve = new VersionElement();
	public Point2D pos = new Point2D();
	public Rectangle2D bound = new Rectangle2D(0,0,65,40);
	
	public MetaObject() {
		
	}
	
	public MetaObject(int id, String name, boolean abstractable, GraphicInfo graphic, int tool, List<MetaProperty> properties) {
		this.name = name;
		this.abstractable = abstractable;
		this.graphic = graphic;
		this.tool = tool;
		this.properties = properties;
	}
	
	public String getName() {
		return name;
	}
	
	public boolean isAbstractable() {
		return abstractable;
	}
	
	
	public int getTool() {
		return tool;
	}
	
	public List<MetaProperty> getProperties() {
		return properties;
	}
	

	
	public NodeObject getInstance(JSONObject json_object) {
		return null;
	}
	
}

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
import com.google.gwt.user.client.Window;
import com.clooca.core.client.model.gopr.element.Model;
import com.clooca.webutil.client.RequestGenerator;

/**
 * 
 * @author Syuhei Hiya
 * Meta Model Class
 *
 */
public class MetaModel {
	public int id;
	public String name;
	public MetaDiagram meta_diagram;
	
	
	public MetaModel() {
		meta_diagram = new MetaDiagram();
	}
	
	
}

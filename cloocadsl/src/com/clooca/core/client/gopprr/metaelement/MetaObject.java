package com.clooca.core.client.gopprr.metaelement;

import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.clooca.core.client.diagram.shape.CircleShape;
import com.clooca.core.client.diagram.shape.RectShape;
import com.clooca.core.client.gopprr.element.ModelElement;
import com.clooca.core.client.gopprr.element.NodeObject;
import com.clooca.webutil.client.RequestGenerator;

public class MetaObject extends MetaElement {
	String name;
	boolean abstractable;
	String graphic;
	int tool;
	
	public MetaObject(int id, String name, boolean abstractable, String graphic, int tool) {
		super(id);
		this.name = name;
		this.abstractable = abstractable;
		this.graphic = graphic;
		this.tool = tool;
	}
	
	public MetaObject(int id) {
		super(id);
		load(id);
	}

	
	public String getName() {
		return name;
	}
	
	public boolean isAbstractable() {
		return abstractable;
	}
	
	public String getGraphic() {
		return graphic;
	}
	
	public int getTool() {
		return tool;
	}
	
	@Override
	public ModelElement getInstance() {
		if(tool == 1) {
			if(graphic.matches("rect")) {
				return new NodeObject(this, new RectShape());
			} else if(graphic.matches("circle")) {
				return new NodeObject(this, new CircleShape(15, false));
			} else if(graphic.matches("fillcircle")) {
				return new NodeObject(this, new CircleShape(15, true));
			}else{
				return new NodeObject(this, new RectShape());
			}
		} else {
			return null;
		}
	}
	
	public void load(int id) {
      	RequestGenerator.send("/cgi-bin/core/metaobject.cgi", "id="+id, new RequestCallback(){

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

    				if((jsonNumber = jsonObject.get("abstract").isNumber()) != null) {
    					int _abstract = (int) jsonNumber.doubleValue();
    					if(_abstract == 0) {
    						abstractable = false;
    					}else{
    						abstractable = true;
    					}
    				}
    				
    				if((jsonNumber = jsonObject.get("graphic").isNumber()) != null) {
    					int _graphic = (int) jsonNumber.doubleValue();
    					if(_graphic == 0) {
    						graphic = "rect";
    					}else if(_graphic == 1){
    						graphic = "circle";
    					}else if(_graphic == 2){
    						graphic = "fillcircle";
    					}
    				}
    				
    				if((jsonNumber = jsonObject.get("tool").isNumber()) != null) {
    					tool = (int) jsonNumber.doubleValue();
    				}
    				
    			}

    		}});

	}
	
}
